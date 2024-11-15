import Controller from '../src/controller/Controller';
import { MissionUtils } from '@woowacourse/mission-utils';

const mockQuestions = (inputs) => {
  const messages = [];

  MissionUtils.Console.readLineAsync = jest.fn((prompt) => {
    messages.push(prompt);
    const input = inputs.shift();

    if (input === undefined) {
      throw new Error('NO INPUT');
    }

    return Promise.resolve(input);
  });

  MissionUtils.Console.readLineAsync.messages = messages;
};

describe('컨트롤러 테스트', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  const inventory = [
    {
      name: '사이다',
      quantity: 10,
      promotion: '탄산2+1',
    },
    {
      name: '사이다',
      quantity: 10,
      promotion: 'null',
    },
    {
      name: '비타민워터',
      quantity: 10,
      promotion: 'null',
    },
    {
      name: '탄산수',
      quantity: 5,
      promotion: '탄산2+1',
    },
  ];
  const promotions = [
    {
      name: '탄산2+1',
      buy: 2,
      get: 1,
      start_date: '2024-01-01',
      end_date: '2024-12-31',
    },
  ];

  test('구입할 상품 중 프로모션이 가능한 상품 목록을 구할 수 있다.', () => {
    const result = [{ name: '사이다', quantity: 1, promotion: '탄산2+1' }];
    const productToBuy = [
      { name: '사이다', quantity: 1, promotion: '탄산2+1' },
      { name: '비타민워터', quantity: 1, promotion: 'null' },
    ];

    const controller = new Controller(inventory, promotions);

    expect(controller.getApplicablePromotionProducts(productToBuy)).toEqual(result);
  });

  test('프로모션 가능한 것들중 더 가져와야할 개수가 있다는 안내후 추가한다면 구매할 물품 개수를 추가한다.', async () => {
    const products = [
      { name: '사이다', quantity: 2, promotion: '탄산2+1' },
      {
        name: '탄산수',
        quantity: 1,
        promotion: '탄산2+1',
      },
    ];

    mockQuestions(['[사이다-2],[탄산수-1]', 'Y', 'N']);

    const controller = new Controller(inventory, promotions);
    await controller.setProducts();
    await controller.checkPromotionCount(products);

    expect(controller.promotionProducts).toEqual([
      {
        name: '사이다',
        quantity: 1,
        promotion: '탄산2+1',
        applicableQuantity: 3,
      },
      {
        name: '탄산수',
        quantity: 0,
        promotion: '탄산2+1',
        applicableQuantity: 3,
      },
    ]);
    expect(controller.productsToBuy).toEqual([
      {
        applicableQuantity: 3,
        name: '사이다',
        quantity: 3,
        promotion: '탄산2+1',
      },
      {
        applicableQuantity: 3,
        name: '탄산수',
        quantity: 1,
        promotion: '탄산2+1',
      },
    ]);
  });

  test('프로모션 가능 재고가 있는지 체크하고, 재고 부족이면 일부 수량에 대해 정가로 결제할지 여부 안내후 정가로 결제하지 않는다면 정가로 결제해야하는 수량만큼 뺀다.', async () => {
    const products = [{ name: '사이다', quantity: 12, promotion: '탄산2+1' }];

    mockQuestions(['[사이다-12]', 'N']);

    const controller = new Controller(inventory, promotions);
    await controller.setProducts();
    await controller.checkPromotionStock(products);

    expect(controller.promotionProducts).toEqual([
      {
        name: '사이다',
        quantity: 3,
        promotion: '탄산2+1',
        applicableQuantity: 3,
      },
    ]);
    expect(controller.productsToBuy).toEqual([
      {
        name: '사이다',
        quantity: 9,
        promotion: '탄산2+1',
        applicableQuantity: 3,
      },
    ]);
  });
});
