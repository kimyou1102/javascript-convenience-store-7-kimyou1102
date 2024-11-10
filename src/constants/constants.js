export const INPUT_MESSAGE = {
  PURCHASE: '\n구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])',
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
