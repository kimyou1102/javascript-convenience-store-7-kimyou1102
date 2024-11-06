import { getProductsData } from '../utils/getfileData.js';
import InputView from '../view/InputView.js';
import OutputView from '../view/OutputView.js';
import { INPUT_MESSAGE } from '../constants/constants.js';

export default class Controller {
  constructor() {
    this.inputView = new InputView();
    this.outputView = new OutputView();
  }

  async run() {
    const inventory = await getProductsData();
    this.outputView.printGreetingAndInventory(inventory);
    const productToBuy = await this.getProductToBuy();
  }

  async getProductToBuy() {
    return await this.getValidatedInputWithRetry(INPUT_MESSAGE.PURCHASE);
  }

  async getValidatedInputWithRetry(message) {
    const input = await this.inputView.getInput(message);
    return input;
  }
}
