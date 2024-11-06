import { getProductsData } from '../utils/getfileData.js';
import OutputView from '../view/OutputView.js';

export default class Controller {
  constructor() {
    this.outputView = new OutputView();
  }

  async run() {
    const inventory = await getProductsData();
    this.outputView.printGreetingAndInventory(inventory);
  }
}
