import Membership from '../src/model/Membership';

describe('멤버십 클래스 테스트', () => {
  test('멤버십 할인금이 사용가능한 멤버십 할인금보다 작을 경우, 멤버십 할인금만큼 할인한다.', () => {
    const MEMBERSHIP_AMOUNT = 8000;
    const MONEY = 12000;
    const DISCOUNT_MONEY = 3600;

    const membership = new Membership(MEMBERSHIP_AMOUNT);

    expect(membership.discountMembership(MONEY)).toBe(DISCOUNT_MONEY);
  });

  test('멤버십 할인금이 사용가능한 멤버십 할인금보다 클 경우, 사용가능한 멤버십 할인금만큼 할인한다.', () => {
    const MEMBERSHIP_AMOUNT = 2400;
    const MONEY = 12000;
    const DISCOUNT_MONEY = 2400;

    const membership = new Membership(MEMBERSHIP_AMOUNT);

    expect(membership.discountMembership(MONEY)).toBe(DISCOUNT_MONEY);
  });

  test('사용가능한 멤버십 할인금이 0원인 경우, 할인하지 않는다.', () => {
    const MEMBERSHIP_AMOUNT = 0;
    const MONEY = 12000;
    const DISCOUNT_MONEY = 0;

    const membership = new Membership(MEMBERSHIP_AMOUNT);

    expect(membership.discountMembership(MONEY)).toBe(DISCOUNT_MONEY);
  });
});
