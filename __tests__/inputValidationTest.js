import { validateProductInput, validateAnswerInput } from '../src/utils/validation';
import { ERROR_MESSAGE } from '../src/constants/constants';

describe('구매 상품 입력 예외처리', () => {
  test.each([
    [''],
    ['[사이다]'],
    ['[사이다-1],'],
    ['[사이다-1]*[콜라-2]'],
    ['[사이다-1]]'],
    ['[사이다'],
    ['[]'],
    ['[사이다-1][감자칩-2]'],
    ['[사이다-1]1'],
  ])('구매할 상품 입력 예외 테스트 - 입력: %s', async (product) => {
    expect(() => validateProductInput(product)).toThrow(ERROR_MESSAGE.PRODUCT.INVALID_FORMAT);
  });

  test.each([['[사이다-1]'], ['[사이다-1],[감자칩-2]']])(
    '구매할 상품 입력 제대로된 값 테스트 - 입력: %s',
    async (product) => {
      expect(() => validateProductInput(product)).not.toThrow(ERROR_MESSAGE.PRODUCT.INVALID_FORMAT);
    },
  );
});

describe('구매 상품 입력 예외처리', () => {
  test.each([[''], ['1'], ['dfdY']])('구매할 상품 입력 예외 테스트 - 입력: %s', async (product) => {
    expect(() => validateAnswerInput(product)).toThrow(ERROR_MESSAGE.INVALID_FORMAT);
  });

  test.each([['Y'], ['N']])('구매할 상품 입력 제대로된 값 테스트 - 입력: %s', async (product) => {
    expect(() => validateAnswerInput(product)).not.toThrow(ERROR_MESSAGE.INVALID_FORMAT);
  });
});
