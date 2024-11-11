export default class InventoryManagement {
  #inventoryInfo;

  constructor(inventoryInfo) {
    this.#inventoryInfo = inventoryInfo;
  }

  getInventoryInfo() {
    return this.#inventoryInfo;
  }

  getProductByProductName(productName) {
    const product = this.#inventoryInfo.filter((product) => product.name === productName);

    return product[0];
  }

  getPromotionNameByProductName(productName) {
    const product = this.#inventoryInfo.filter(
      (product) => product.name === productName && product.promotion !== 'null',
    );
    if (product.length === 0) return 'null';
    return product[0].promotion;
  }

  inSufficientCount(productInfo) {
    const product = this.getInventoryInfo().filter(
      (e) => e.name === productInfo.name && e.promotion === productInfo.promotion,
    )[0];
    const share = Math.floor(product.quantity / productInfo.applicableQuantity);
    const canStock = share * productInfo.applicableQuantity;
    if (canStock - productInfo.quantity >= 0) return 0;
    return productInfo.quantity - canStock;
  }

  getTotalInSufficientCount(productName, quantity) {
    const product = this.#inventoryInfo.filter((product) => product.name === productName);
    const sumStock = product.reduce((a, b) => a + b.quantity, 0);

    if (sumStock >= quantity) return true;
    return false;
  }

  buyProduct(productInfo) {
    let index = this.getProductIndex(productInfo);
    let product = this.#inventoryInfo[index];
    if (product.quantity < productInfo.applicableQuantity) {
      index = this.getProductIndex({ ...productInfo, promotion: 'null' });
    }

    product = this.#inventoryInfo[index];
    this.#inventoryInfo[index].quantity = product.quantity - productInfo.quantity;
  }

  getProductIndex(productInfo) {
    return this.getInventoryInfo().findIndex(
      (e) => e.name === productInfo.name && e.promotion === productInfo.promotion,
    );
  }
}
