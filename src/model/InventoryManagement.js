export default class InventoryManagement {
  #inventoryInfo;

  constructor(inventoryInfo) {
    this.#inventoryInfo = inventoryInfo;
  }

  getInventoryInfo() {
    return this.#inventoryInfo;
  }

  isPurchasable(productInfo) {
    const product = this.getInventoryInfo().filter(
      (e) => e.name === productInfo.name,
    )[0];

    if (product.quantity - productInfo.quantity >= 0) {
      return true;
    }
    return false;
  }
}
