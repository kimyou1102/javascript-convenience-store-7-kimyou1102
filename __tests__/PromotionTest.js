import PromotionInfo from '../src/model/PromotionInfo.js';

describe('프로모션 정보 클래스 테스트', () => {
  test('프로모션 정보를 가질 수 있다.', () => {
    const PROMOTIONS = [
      {
        name: '탄산2+1',
        buy: 2,
        get: 1,
        start_date: '2024-01-01',
        end_date: '2024-12-31',
      },
      {
        name: 'MD추천상품',
        buy: 1,
        get: 1,
        start_date: '2024-01-01',
        end_date: '2024-12-31',
      },
    ];

    const promotionInfo = new PromotionInfo(PROMOTIONS);

    expect(promotionInfo.getPromotionInfo()).toEqual(PROMOTIONS);
  });

  test('해당하는 프로모션이 없다면 적용할 수 없다.', () => {
    const PROMOTIONS = [
      {
        name: 'MD추천상품',
        buy: 1,
        get: 1,
        start_date: '2024-01-01',
        end_date: '2024-12-31',
      },
    ];

    const PROMOTION_NAME = 'null';
    const NOW_DATE = '2023-12-31';

    const promotionInfo = new PromotionInfo(PROMOTIONS);

    expect(promotionInfo.isPromotionApplicable(PROMOTION_NAME, NOW_DATE)).toBe(
      false,
    );
  });

  const BEFORE_DATE = '2023-12-31';
  const AFTER_DATE = '2025-01-01';

  test.each([
    ['MD추천상품', BEFORE_DATE],
    ['MD추천상품', AFTER_DATE],
  ])(
    '오늘 날짜가 프로모션 기간을 벗어났다면 적용할 수 없다.',
    (PROMOTION_NAME, NOW_DATE) => {
      const PROMOTIONS = [
        {
          name: 'MD추천상품',
          buy: 1,
          get: 1,
          start_date: '2024-01-01',
          end_date: '2024-12-31',
        },
      ];

      const promotionInfo = new PromotionInfo(PROMOTIONS);
      promotionInfo.isPromotionApplicable(PROMOTION_NAME, NOW_DATE);

      expect(
        promotionInfo.isPromotionApplicable(PROMOTION_NAME, NOW_DATE),
      ).toBe(false);
    },
  );

  const START_DATE = '2024-01-01';
  const END_DATE = '2024-12-31';

  test.each([
    ['MD추천상품', START_DATE],
    ['MD추천상품', END_DATE],
  ])(
    '오늘 날짜가 프로모션 기간 내에 포함된다면 할인을 적용할 수 있다.',
    (PROMOTION_NAME, NOW_DATE) => {
      const PROMOTIONS = [
        {
          name: '탄산2+1',
          buy: 2,
          get: 1,
          start_date: '2024-01-01',
          end_date: '2024-12-31',
        },
        {
          name: 'MD추천상품',
          buy: 1,
          get: 1,
          start_date: '2024-01-01',
          end_date: '2024-12-31',
        },
      ];

      const promotionInfo = new PromotionInfo(PROMOTIONS);

      expect(
        promotionInfo.isPromotionApplicable(PROMOTION_NAME, NOW_DATE),
      ).toBe(true);
    },
  );

  test.each([
    ['탄산2+1', 1, 1],
    ['탄산2+1', 2, 0],
    ['탄산2+1', 3, 1],
    ['MD추천상품', 1, 2],
  ])(
    '프로모션 적용 가능한 상품인 경우 더 가져와야할 개수를 반환한다.',
    (PROMOTION, QUANTITY, COUNT) => {
      const PROMOTIONS = [
        {
          name: '탄산2+1',
          buy: 2,
          get: 1,
          start_date: '2024-01-01',
          end_date: '2024-12-31',
        },
        {
          name: 'MD추천상품',
          buy: 3,
          get: 1,
          start_date: '2024-01-01',
          end_date: '2024-12-31',
        },
      ];

      const promotionInfo = new PromotionInfo(PROMOTIONS);

      expect(promotionInfo.inSufficientCount(PROMOTION, QUANTITY)).toBe(COUNT);
    },
  );
});
