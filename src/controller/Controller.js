import InputView from '../view/InputView.js';
import OutputView from '../view/OutputView.js';
import { INPUT_MESSAGE } from '../constants/constants.js';
import PromotionInfo from '../model/PromotionInfo.js';
import { parseProducts } from '../utils/parseProduct.js';
import { DateTimes } from '@woowacourse/mission-utils';
import InventoryManagement from '../model/InventoryManagement.js';

export default class Controller {
  constructor(inventory, promotions) {
    this.productsToBuy = [];
    this.promotionProducts = [];
    this.inputView = new InputView();
    this.outputView = new OutputView();
    this.inventoryManagement = new InventoryManagement(inventory);
    this.promotionInfo = new PromotionInfo(promotions);
  }

  async run() {
    this.outputView.printGreetingAndInventory(this.inventoryManagement.getInventoryInfo());
    await this.setProducts();
    await this.checkPromotionCount(this.productsToBuy);
    await this.checkPromotionStock(this.productsToBuy);
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
