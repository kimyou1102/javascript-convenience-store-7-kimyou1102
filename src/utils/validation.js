import { ERROR_MESSAGE } from '../constants/constants.js';

export const validateProductInput = (productInput) => {
  hasSpecialSymbol(productInput);
  checkWrapper(productInput);
  const products = productInput.split(',');

  checkComma(products);
  products.forEach((product) => checkItem(product));
};

const checkWrapper = (productInput) => {
  for (let i = 0; i < productInput.length - 1; i++) {
    if (productInput[i] === ']' && productInput[i + 1] !== ',') {
      throw new Error(ERROR_MESSAGE.PRODUCT.INVALID_FORMAT);
    }
    if (productInput[i] === ',' && productInput[i + 1] !== '[') {
      throw new Error(ERROR_MESSAGE.PRODUCT.INVALID_FORMAT);
    }
  }
};

const hasSpecialSymbol = (productInput) => {
  if (productInput.replace(/[^\[\],\w\s가-힣-]/g, '').length !== productInput.length) {
    throw new Error(ERROR_MESSAGE.PRODUCT.INVALID_FORMAT);
  }
};

const checkComma = (products) => {
  for (let i = 0; i < products.length; i++) {
    const startCount = products[i].split('').filter((text) => text === '[').length;
    const endCount = products[i].split('').filter((text) => text === ']').length;

    if (startCount !== endCount) throw new Error(ERROR_MESSAGE.PRODUCT.INVALID_FORMAT);
    if (startCount > 1 || endCount > 1) throw new Error(ERROR_MESSAGE.PRODUCT.INVALID_FORMAT);
  }
};

const checkItem = (product) => {
  checkItemEmpty(product);
  const [name, quantity] = product.split('-').map((x) => x.replace(/\[|\]/g, ''));

  checkProductInfo(name, quantity);
  checkQuantity(quantity);
  if (quantity < 1) throw new Error(ERROR_MESSAGE.PRODUCT.NOT_NEGATIVE_NUMBER);
};

const checkItemEmpty = (product) => {
  if (product === '') {
    throw new Error(ERROR_MESSAGE.PRODUCT.INVALID_FORMAT);
  }
};

const checkProductInfo = (name, quantity) => {
  if (name === '' || quantity === '') {
    throw new Error(ERROR_MESSAGE.PRODUCT.INVALID_FORMAT);
  }
};

const checkQuantity = (quantity) => {
  if (isNaN(quantity)) {
    throw new Error(ERROR_MESSAGE.PRODUCT.INVALID_FORMAT);
  }
};

export const validateAnswerInput = (answer) => {
  if (answer !== 'Y' && answer !== 'N') {
    throw new Error(ERROR_MESSAGE.INVALID_FORMAT);
  }
};
