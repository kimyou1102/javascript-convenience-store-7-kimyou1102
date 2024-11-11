export const INPUT_MESSAGE = {
  PURCHASE: '\n구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])',
  ADD_PURCHASE: '감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)',
  MEMBERSHIP_DISCOUNT: '멤버십 할인을 받으시겠습니까? (Y/N)',
  PROMOTION_NOT_APPLICABLE:
    '개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)',
  PROMPT_FREE_ADDITION: '개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)',
};

export const ERROR_MESSAGE = {
  PRODUCT: {
    OUT_OF_STOCK: '[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.',
    INVALID_FORMAT: '[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.',
    NOT_EXIST: '[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.',
    NOT_NEGATIVE_NUMBER: '[ERROR] 상품의 수량은 1이상으로만 입력 가능합니다. 다시 입력해 주세요.',
  },
  INVALID_FORMAT: '[ERROR] 잘못된 입력입니다. 다시 입력해 주세요.',
};

export const RESPONSE = {
  YES: 'Y',
  NO: 'N',
};
