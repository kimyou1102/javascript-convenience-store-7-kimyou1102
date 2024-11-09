import { Console } from '@woowacourse/mission-utils';

export default class OutputView {
  printReceipt(products, promotionProducts, membership) {
    Console.print('==============W 편의점================');
    Console.print('상품명		수량	금액');
    this.printProducts(products);
    Console.print('=============증	정===============');
    this.printPromotionProducts(promotionProducts);
    Console.print('====================================');
    this.printPurchasePriceResult(products, membership, promotionProducts);
  }

  printPurchasePriceResult(products, membership, promotionProducts) {
    const totalMoney = products.reduce((a, b) => a + b.price * b.quantity, 0);
    Console.print(`총구매액		${products.reduce((a, b) => a + b.quantity, 0)}	${totalMoney}`);
    const promotion = promotionProducts.reduce((a, b) => a + b.price * b.quantity, 0);
    Console.print(`행사할인			-${promotion}`);
    Console.print(`멤버십할인			-${membership}`);
    Console.print(`내실돈			 ${totalMoney - promotion - membership}`);
  }

  printProducts(products) {
    products.forEach((product) => {
      Console.print(`${product.name}		${product.quantity}	${product.quantity * product.price}`);
    });
  }

  printPromotionProducts(products) {
    products.forEach((product) => {
      Console.print(`${product.name}		${product.quantity}`);
    });
  }

  printGreetingAndInventory(inventory) {
    Console.print('안녕하세요. W편의점입니다.');
    Console.print('현재 보유하고 있는 상품입니다.\n');
    this.printInventoryList(inventory);
  }

  printInventoryList(inventory) {
    inventory.forEach(({ name, price, quantity, promotion }) => {
      const money = price.toLocaleString('ko-KR');
      let quantityWithUnit = `${quantity}개`;

      if (quantity === 0) quantityWithUnit = '재고 없음';

      this.printInventory(name, money, promotion, quantityWithUnit);
    });
  }

  printInventory(name, money, promotion, quantityWithUnit) {
    if (promotion === 'null') {
      Console.print(`- ${name} ${money}원 ${quantityWithUnit}`);
      return;
    }
    Console.print(`- ${name} ${money}원 ${quantityWithUnit} ${promotion}`);
  }
}
