import { Console } from '@woowacourse/mission-utils';

export default class OutputView {
  printGreetingAndInventory(inventory) {
    Console.print('안녕하세요. W편의점입니다.');
    Console.print('현재 보유하고 있는 상품입니다.\n');
    this.printInventoryList(inventory);
  }

  printInventoryList(inventory) {
    inventory.forEach(({ name, price, quantity, promotion }) => {
      const money = Number(price).toLocaleString('ko-KR');
      let quantityWithUnit = `${quantity}개`;

      if (quantity === '0') quantityWithUnit = '재고 없음';

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
