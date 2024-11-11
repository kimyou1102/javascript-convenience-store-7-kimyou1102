import InventoryManagement from '../src/model/InventoryManagement.js';

describe('재고관리 테스트', () => {
  test('상품 정보를 가질 수 있다.', () => {
    const productData = [];

    const inventoryManagement = new InventoryManagement(productData);

    expect(inventoryManagement.getInventoryInfo()).toBe(productData);
  });

  test.each([
    ['감자칩', '반짝할인'],
    ['콜라', '탄산2+1'],
    ['비타민워터', 'null'],
  ])('상품 이름으로 프로모션 이름을 가져올 수 있다.', (productName, promotionName) => {
    const productData = [
      {
        name: '콜라',
        price: 1000,
        quantity: 10,
        promotion: '탄산2+1',
      },
      {
        name: '감자칩',
        price: 1500,
        quantity: 5,
        promotion: '반짝할인',
      },
      {
        name: '비타민워터',
        price: 1500,
        quantity: 5,
        promotion: 'null',
      },
    ];

    const inventoryManagement = new InventoryManagement(productData);

    expect(inventoryManagement.getPromotionNameByProductName(productName)).toBe(promotionName);
  });

  test('부족한 수량이 없는 경우 0을 반환한다.', () => {
    const productData = [
      {
        name: '콜라',
        price: 1000,
        quantity: 10,
        promotion: '탄산2+1',
      },
      {
        name: '사이다',
        price: 1000,
        quantity: 8,
        promotion: '탄산2+1',
      },
    ];
    const productInfo = {
      name: '콜라',
      quantity: 3,
      promotion: '탄산2+1',
      applicableQuantity: 3,
    };

    const inventoryManagement = new InventoryManagement(productData);

    expect(inventoryManagement.inSufficientCount(productInfo)).toBe(0);
  });

  test('부족한 수량을 확인할 수 있다.', () => {
    const productData = [
      {
        name: '콜라',
        price: 1000,
        quantity: 10,
        promotion: '탄산2+1',
      },
      {
        name: '사이다',
        price: 1000,
        quantity: 8,
        promotion: '탄산2+1',
      },
    ];
    const productInfo = {
      name: '사이다',
      quantity: 10,
      promotion: '탄산2+1',
      applicableQuantity: 3,
    };
    const inventoryManagement = new InventoryManagement(productData);

    expect(inventoryManagement.inSufficientCount(productInfo)).toBe(4);
  });

  test('해당 상품의 재고를 차감할 수 있다.', () => {
    const productData = [
      {
        name: '콜라',
        price: 1000,
        quantity: 10,
        promotion: '탄산2+1',
      },
      {
        name: '사이다',
        price: 1000,
        quantity: 8,
        promotion: '탄산2+1',
      },
    ];
    const productInfo = {
      name: '사이다',
      quantity: 2,
      promotion: '탄산2+1',
    };

    const inventoryManagement = new InventoryManagement(productData);
    inventoryManagement.buyProduct(productInfo);

    const afterInventory = inventoryManagement
      .getInventoryInfo()
      .filter((e) => e.name === productInfo.name)[0];

    expect(afterInventory.quantity).toBe(6);
  });

  test('프로모션 상품이 재고가 부족할 시 프로모션 미적용 상품의 재고를 차감한다.', () => {
    const productData = [
      {
        name: '콜라',
        price: 1000,
        quantity: 1,
        promotion: '탄산2+1',
      },
      {
        name: '콜라',
        price: 1000,
        quantity: 10,
        promotion: 'null',
      },
      {
        name: '사이다',
        price: 1000,
        quantity: 8,
        promotion: '탄산2+1',
      },
    ];
    const productInfo = {
      name: '콜라',
      quantity: 3,
      promotion: '탄산2+1',
      applicableQuantity: 3,
    };

    const inventoryManagement = new InventoryManagement(productData);
    inventoryManagement.buyProduct(productInfo);

    const afterInventory = inventoryManagement
      .getInventoryInfo()
      .filter((e) => e.name === productInfo.name && e.promotion === 'null')[0];

    expect(afterInventory.quantity).toBe(7);
  });
});
