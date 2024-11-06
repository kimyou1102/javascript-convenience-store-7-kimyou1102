import InventoryManagement from '../src/model/InventoryManagement';

describe('재고관리 테스트', () => {
  test('상품 정보를 가질 수 있다.', () => {
    const productData = [];

    const inventoryManagement = new InventoryManagement(productData);

    expect(inventoryManagement.getInventoryInfo()).toBe(productData);
  });

  test('재고가 있는 상품은 구매 가능하다.', () => {
    const productData = [
      {
        name: '콜라',
        price: 1000,
        quantity: 10,
        promotion: '탄산2+1',
      },
      {
        name: '사이다',
        price: 1000,
        quantity: 8,
        promotion: '탄산2+1',
      },
    ];
    const productInfo = {
      name: '콜라',
      quantity: 3,
    };

    const inventoryManagement = new InventoryManagement(productData);

    expect(inventoryManagement.isPurchasable(productInfo)).toBe(true);
  });

  test('재고가 없는 상품은 구매 가능하다.', () => {
    const productData = [
      {
        name: '콜라',
        price: 1000,
        quantity: 10,
        promotion: '탄산2+1',
      },
      {
        name: '사이다',
        price: 1000,
        quantity: 8,
        promotion: '탄산2+1',
      },
    ];
    const productInfo = {
      name: '사이다',
      quantity: 10,
    };
    const inventoryManagement = new InventoryManagement(productData);

    expect(inventoryManagement.isPurchasable(productInfo)).toBe(false);
  });

  test('해당 상품의 재고를 차감할 수 있다.', () => {
    const productData = [
      {
        name: '콜라',
        price: 1000,
        quantity: 10,
        promotion: '탄산2+1',
      },
      {
        name: '사이다',
        price: 1000,
        quantity: 8,
        promotion: '탄산2+1',
      },
    ];
    const productInfo = {
      name: '사이다',
      quantity: 2,
    };

    const inventoryManagement = new InventoryManagement(productData);
    inventoryManagement.buyProduct(productInfo);

    const afterInventory = inventoryManagement
      .getInventoryInfo()
      .filter((e) => e.name === productInfo.name)[0];

    expect(afterInventory.quantity).toBe(6);
  });
});
