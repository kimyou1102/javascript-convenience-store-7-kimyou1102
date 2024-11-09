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

  async getProductToBuy() {
    return await this.getValidatedInputWithRetry(INPUT_MESSAGE.PURCHASE);
  }

  async getValidatedInputWithRetry(message) {
    const input = await this.inputView.getInput(message);
    return input;
  }
}
