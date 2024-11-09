import InputView from '../view/InputView.js';
import OutputView from '../view/OutputView.js';
import { INPUT_MESSAGE } from '../constants/constants.js';
import PromotionInfo from '../model/PromotionInfo.js';
import { parseProducts } from '../utils/parseProduct.js';
import { DateTimes } from '@woowacourse/mission-utils';
import InventoryManagement from '../model/InventoryManagement.js';
import Membership from '../model/Membership.js';

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
    this.printPurchaseResult();
  }

  async checkPromotionCount(productsToBuy) {
    for (const { name, promotion, quantity } of productsToBuy) {
      if (!this.promotionInfo.getPromotion(promotion)) return;

      const { get } = this.promotionInfo.getPromotion(promotion);
      const inSufficientCount = this.promotionInfo.inSufficientCount(promotion, quantity);

      if (inSufficientCount !== 0) await this.guideAddInfo(name, get, inSufficientCount);
    }
  }

  async guideAddInfo(name, get, inSufficientCount) {
    const response = await this.getAnswerToAddition(name, get);

    if (response === 'Y') {
      this.updateProductQuantity(name, inSufficientCount);
      this.updatePromotionProductQuantity(name, get);
    }
  }

  async checkPromotionStock(productToBuy) {
    for (const product of productToBuy) {
      if (!this.promotionInfo.getPromotion(product.promotion)) return;
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
    if (response === 'N') {
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
    this.outputView.printPurchaseList(this.productsToBuy, this.promotionProducts, membershipAmount);
  }

  async getMembershipAmount(money) {
    const response = await this.getAnswerToMembership();

    if (response === 'Y') {
      return this.membership.discountMembership(money);
    }
    return 0;
  }

  calculateMoneyToPay() {
    this.updateProductsPrice();
    this.updatePromotionProductsPrice();

    return this.productsToBuy.reduce((a, b) => a + b.price, 0);
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
      const promotion = this.inventoryManagement.getPromotionNameByProductName(product.name);
      return { ...product, promotion };
    });
  }

  async getAnswerToMembership() {
    return await this.getValidatedInputWithRetry('멤버십 할인을 받으시겠습니까? (Y/N)');
  }

  async getAnswerToBuy(name, count) {
    return await this.getValidatedInputWithRetry(
      `현재 ${name} ${count}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)`,
    );
  }

  async getAnswerToAddition(name, count) {
    return await this.getValidatedInputWithRetry(
      `현재 ${name}은(는) ${count}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)`,
    );
  }

  async getProductToBuy() {
    return await this.getValidatedInputWithRetry(INPUT_MESSAGE.PURCHASE);
  }

  async getValidatedInputWithRetry(message) {
    const input = await this.inputView.getInput(message);
    return input;
  }
}
