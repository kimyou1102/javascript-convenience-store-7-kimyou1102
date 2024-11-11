import InputView from '../view/InputView.js';
import OutputView from '../view/OutputView.js';
import { INPUT_MESSAGE, ERROR_MESSAGE, RESPONSE } from '../constants/constants.js';
import PromotionInfo from '../model/PromotionInfo.js';
import { parseProducts } from '../utils/parseProduct.js';
import { DateTimes } from '@woowacourse/mission-utils';
import InventoryManagement from '../model/InventoryManagement.js';
import Membership from '../model/Membership.js';
import { validateProductInput, validateAnswerInput } from '../utils/validation.js';

const MEMBERSHIP_MAX = 8000;

export default class Controller {
  constructor(inventory, promotions) {
    this.productsToBuy = [];
    this.promotionProducts = [];
    this.inputView = new InputView();
    this.outputView = new OutputView();
    this.inventoryManagement = new InventoryManagement(inventory);
    this.promotionInfo = new PromotionInfo(promotions);
    this.membership = new Membership(MEMBERSHIP_MAX);
  }

  async run() {
    this.outputView.printGreetingAndInventory(this.inventoryManagement.getInventoryInfo());
    await this.setProducts();
    await this.checkPromotionCount(this.productsToBuy);
    await this.checkPromotionStock(this.productsToBuy);
    this.deductInventory();
    await this.printPurchaseResult();
  }

  async checkPromotionCount(productsToBuy) {
    for (const { name, promotion, quantity } of productsToBuy) {
      if (!this.promotionInfo.getPromotion(promotion)) continue;
      if (!this.getSameProduct(name, promotion)) continue;
      const { get } = this.promotionInfo.getPromotion(promotion);
      const inSufficientCount = this.promotionInfo.inSufficientCount(promotion, quantity);

      if (inSufficientCount !== 0) await this.guideAddInfo(name, get, inSufficientCount);
    }
  }

  getSameProduct(name, promotion) {
    return this.promotionProducts.find(
      (product) => product.name === name && product.promotion === promotion,
    );
  }

  async guideAddInfo(name, get, inSufficientCount) {
    const response = await this.getAnswerToAddition(name, get);

    if (response === RESPONSE.YES) {
      this.updateProductQuantity(name, inSufficientCount);
      this.updatePromotionProductQuantity(name, get);
    }
  }

  async checkPromotionStock(productToBuy) {
    for (const product of productToBuy) {
      if (!this.promotionInfo.getPromotion(product.promotion)) continue;
      const { get, buy } = this.promotionInfo.getPromotion(product.promotion);
      const applicableQuantity = get + buy;
      const inSufficientCount = this.getInSufficientCount(product, applicableQuantity);
      if (inSufficientCount !== 0)
        await this.guideInSufficientStockInfo(product.name, inSufficientCount, applicableQuantity);
    }
  }

  getInSufficientCount(product, applicableQuantity) {
    return this.inventoryManagement.inSufficientCount({
      ...product,
      applicableQuantity,
    });
  }

  async guideInSufficientStockInfo(name, inSufficientCount, applicableQuantity) {
    const response = await this.getAnswerToBuy(name, inSufficientCount);
    if (response === RESPONSE.NO) {
      this.updateProductQuantity(name, inSufficientCount * -1);
    }
    this.updatePromotionProductQuantity(
      name,
      Math.floor(inSufficientCount / applicableQuantity) * -1,
    );
  }

  deductInventory() {
    this.productsToBuy.forEach((product) => {
      this.inventoryManagement.buyProduct(product);
    });
  }

  async printPurchaseResult() {
    const money = this.calculateMoneyToPay();
    const membershipAmount = await this.getMembershipAmount(money);
    this.outputView.printReceipt(this.productsToBuy, this.promotionProducts, membershipAmount);
    const response = await this.getAnswerToAddPurchase();
    if (response === RESPONSE.YES) await this.run();
  }

  async getMembershipAmount(money) {
    if (money === 0) return 0;
    const response = await this.getAnswerToMembership();

    if (response === RESPONSE.YES) {
      return this.membership.discountMembership(money);
    }
    return 0;
  }

  calculateMoneyToPay() {
    this.updateProductsPrice();
    this.updatePromotionProductsPrice();

    const promotionTotalPrice = this.promotionProducts.reduce(
      (a, b) => a + b.price * b.quantity,
      0,
    );
    return this.productsToBuy.reduce((a, b) => a + b.price * b.quantity, 0) - promotionTotalPrice;
  }

  updateProductsPrice() {
    this.productsToBuy = this.productsToBuy.map((product) => {
      const { price } = this.inventoryManagement.getProductByProductName(product.name);
      return { ...product, price };
    });
  }

  updatePromotionProductsPrice() {
    this.promotionProducts = this.promotionProducts.map((product) => {
      const { price } = this.inventoryManagement.getProductByProductName(product.name);
      return { ...product, price: price };
    });
  }

  async setProducts() {
    const productToBuyString = await this.getProductToBuy();
    const productsToBuy = parseProducts(productToBuyString);
    this.productsToBuy = this.getProductsWithPromotion(productsToBuy);
    const applicablePromotionProducts = this.getApplicablePromotionProducts(this.productsToBuy);

    this.setPromotionProducts(applicablePromotionProducts);
  }

  setPromotionProducts(applicablePromotionProducts) {
    this.promotionProducts = applicablePromotionProducts.map((product) => {
      const { buy, get } = this.promotionInfo.getPromotion(product.promotion);
      const count = Math.floor(product.quantity / (buy + get));
      return {
        ...product,
        quantity: count,
      };
    });
  }

  updateProductQuantity(name, quantityToAdd) {
    const index = this.productsToBuy.findIndex((product) => product.name === name);
    this.productsToBuy[index] = this.getProductWithAddedQuantity(
      this.productsToBuy[index],
      quantityToAdd,
    );
  }

  updatePromotionProductQuantity(name, quantityToAdd) {
    const index = this.promotionProducts.findIndex((product) => product.name === name);
    this.promotionProducts[index] = this.getProductWithAddedQuantity(
      this.promotionProducts[index],
      quantityToAdd,
    );
  }

  getProductWithAddedQuantity(product, quantityToAdd) {
    return {
      ...product,
      quantity: product.quantity + quantityToAdd,
    };
  }

  getApplicablePromotionProducts(productsToBuy) {
    return productsToBuy.filter((product) =>
      this.promotionInfo.isPromotionApplicable(product.promotion, DateTimes.now()),
    );
  }

  getProductsWithPromotion(productsToBuy) {
    return productsToBuy.map((product) => {
      const promotionName = this.inventoryManagement.getPromotionNameByProductName(product.name);
      let applicableQuantity = 0;
      const promotion = this.promotionInfo.getPromotion(promotionName);
      if (promotion) applicableQuantity = promotion.buy + promotion.get;

      return { ...product, promotion: promotionName, applicableQuantity };
    });
  }

  async getAnswerToAddPurchase() {
    return await this.getValidatedInputWithRetry(INPUT_MESSAGE.ADD_PURCHASE, validateAnswerInput);
  }

  async getAnswerToMembership() {
    return await this.getValidatedInputWithRetry(
      INPUT_MESSAGE.MEMBERSHIP_DISCOUNT,
      validateAnswerInput,
    );
  }

  async getAnswerToBuy(name, count) {
    return await this.getValidatedInputWithRetry(
      `\n현재 ${name} ${count}${INPUT_MESSAGE.PROMOTION_NOT_APPLICABLE}`,
      validateAnswerInput,
    );
  }

  async getAnswerToAddition(name, count) {
    return await this.getValidatedInputWithRetry(
      `\n현재 ${name}은(는) ${count}${INPUT_MESSAGE.PROMPT_FREE_ADDITION}`,
      validateAnswerInput,
    );
  }

  async getProductToBuy() {
    return await this.getValidatedInputWithRetry(INPUT_MESSAGE.PURCHASE, this.validateProductToBuy);
  }

  validateProductToBuy = (input) => {
    validateProductInput(input);
    const productsToBuy = parseProducts(input);
    this.validateExistProduct(productsToBuy);
    this.validateProductStock(productsToBuy);
    this.validateDuplication(productsToBuy);
  };

  validateProductStock(productsToBuy) {
    productsToBuy.forEach((product) => {
      const isCheck = this.inventoryManagement.getTotalInSufficientCount(
        product.name,
        product.quantity,
      );
      if (!isCheck) throw new Error(ERROR_MESSAGE.PRODUCT.OUT_OF_STOCK);
    });
  }

  validateDuplication(productsToBuy) {
    const products = productsToBuy.map((product) => product.name);
    const unique = new Set(products);
    if (products.length !== unique.size) {
      throw new Error(ERROR_MESSAGE.PRODUCT.DUPLICATION);
    }
  }

  validateExistProduct = (productsToBuy) => {
    productsToBuy.forEach(({ name }) => {
      const product = this.inventoryManagement.getProductByProductName(name);
      if (!product) throw new Error(ERROR_MESSAGE.PRODUCT.NOT_EXIST);
    });
  };

  async getValidatedInputWithRetry(message, validate) {
    try {
      const input = await this.inputView.getInput(message);
      validate(input);
      return input;
    } catch (error) {
      this.outputView.printError(error.message);
      return await this.getValidatedInputWithRetry(message, validate);
    }
  }
}
