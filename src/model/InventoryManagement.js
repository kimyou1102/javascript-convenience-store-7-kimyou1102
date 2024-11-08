export default class InventoryManagement {
  #inventoryInfo;

  constructor(inventoryInfo) {
    this.#inventoryInfo = inventoryInfo;
  }

  getInventoryInfo() {
    return this.#inventoryInfo;
  }

  getPromotionNameByProductName(productName) {
    const product = this.#inventoryInfo.filter(
      (product) => product.name === productName && product.promotion !== 'null',
    );

    if (product.length === 0) return '';
    return product[0].promotion;
  }

  inSufficientCount(productInfo) {
    const product = this.getInventoryInfo().filter(
      (e) =>
        e.name === productInfo.name && e.promotion === productInfo.promotion,
    )[0];
    if (product.quantity - productInfo.quantity >= 0) {
      return 0;
    }
    return productInfo.quantity - product.quantity;
  }

  buyProduct(productInfo) {
    const index = this.getInventoryInfo().findIndex(
      (e) => e.name === productInfo.name,
    );
    const product = this.getInventoryInfo()[index];

    this.#inventoryInfo[index].quantity =
      product.quantity - productInfo.quantity;
  }
}
