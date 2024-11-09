import InputView from '../view/InputView.js';
import OutputView from '../view/OutputView.js';
import { INPUT_MESSAGE } from '../constants/constants.js';
import PromotionInfo from '../model/PromotionInfo.js';
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
    const productToBuyString = await this.getProductToBuy();
  }

  getApplicablePromotionProducts(productsToBuy) {
    return productsToBuy.filter((product) =>
      this.promotionInfo.isPromotionApplicable(product.promotion, DateTimes.now()),
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
