import Controller from './controller/Controller.js';
import { getProductsData, getPromotionsData } from './utils/getfileData.js';

class App {
  async run() {
    const inventory = await getProductsData();
    const promotions = await getPromotionsData();

    const controller = new Controller(inventory, promotions);
    controller.run();
  }
}

export default App;
