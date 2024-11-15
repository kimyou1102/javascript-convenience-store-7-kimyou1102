# javascript-convenience-store-precourse

## 구현 기능 목록

### 재고관리

- [x] 상품 정보를 가질 수 있다.(이름, 재고, 가격, 프로모션 여부)
- [x] 각 상품의 재고 수량을 고려하여 부족한 수량을 확인할 수 있다.
- [x] 해당 상품의 재고를 차감할 수 있다.
- [x] 상품의 이름으로 프로모션 이름을 가져올 수 있다.

### 프로모션

- [x] 프로모션 정보를 가질 수 있다.
  - 1+1 또는 2+1 프로모션이 각각 지정된 상품에 적용되며, 동일 상품에 여러 프로모션이 적용되지 않는다.
  - 프로모션은 N개 구매 시 1개 무료 증정(Buy N Get 1 Free)의 형태로 진행된다.
- [x] 프로모션을 적용할 수 있는지 확인할 수 있다.
  - 오늘 날짜가 프로모션 기간 내에 포함된 경우에만 할인을 적용
  - 해당하는 프로모션이 있는 경우만 적용
- [x] 프로모션 적용이 가능한 상품에 대해 고객이 해당 수량만큼 가져왔는지 확인할 수 있다.

### 포스기

- [x] 구입할 상품 중 프로모션이 가능한 상품 목록을 구할 수 있다.
- [x] 프로모션 가능 상품 중 해당 수량만큼 가져오지 않았다면, 그 수량만큼 추가 여부를 물어볼 수 있다.
- [x] 추가한다고 하면 프로모션 가능 상품 개수를 추가할 수 있다.
- [x] 프로모션 재고가 부족하여 일부 수량을 프로모션 혜택 없이 결제해야 하는 경우, 일부 수량에 대해 정가로 결제할지 여부를 물어볼 수 있다.
- [x] 정가로 결제하지 않는다고 하면 구매목록에서 그만큼 뺀다.
  - [x] 정가 결제 여부 상관없이 프로모션 수량은 줄인다.
- [x] 구매 결과를 알려준다.
  - [x] 재구매 여부를 묻고 재구매한다면 다시 구매 과정을 시작한다.

### 멤버십 할인

- [x] 멤버십 회원은 프로모션 미적용 금액의 30%를 할인받는다.
- [x] 프로모션 적용 후 남은 금액에 대해 멤버십 할인을 적용한다.
- [x] 멤버십 할인의 최대 한도는 8,000원이다.
  - [ ] 한도 초과시 에러처리

### 입력

- [x] 구현에 필요한 상품 목록과 행사 목록을 파일 입출력을 통해 불러온다.
  - public/products.md과 public/promotions.md 파일을 이용한다.
  - 두 파일 모두 내용의 형식을 유지한다면 값은 수정할 수 있다.
- [x] 구매할 상품과 수량을 입력 받는다. 상품명, 수량은 하이픈(-)으로, 개별 상품은 대괄호([])로 묶어 쉼표(,)로 구분한다.
- [ ] 프로모션 적용이 가능한 상품에 대해 고객이 해당 수량보다 적게 가져온 경우, 그 수량만큼 추가 여부를 입력받는다.
  - Y: 증정 받을 수 있는 상품을 추가한다.
  - N: 증정 받을 수 있는 상품을 추가하지 않는다.

### 출력

- [x] 환영 인사와 함께 상품명, 가격, 프로모션 이름, 재고를 안내한다. 만약 재고가 0개라면 재고 없음을 출력한다.
- [ ] 프로모션 적용이 가능한 상품에 대해 고객이 해당 수량만큼 가져오지 않았을 경우, 혜택에 대한 안내 메시지를 출력한다.
- [ ] 프로모션 재고가 부족하여 일부 수량을 프로모션 혜택 없이 결제해야 하는 경우, 일부 수량에 대해 정가로 결제할지 여부에 대한 안내 메시지를 출력한다.
- [ ] 멤버십 할인 적용 여부를 확인하기 위해 안내 문구를 출력한다.
- [x] 구매 상품 내역, 증정 상품 내역, 금액 정보를 출력한다.
- [ ] 추가 구매 여부를 확인하기 위해 안내 문구를 출력한다.
- [ ] 사용자가 잘못된 값을 입력했을 때, "[ERROR]"로 시작하는 오류 메시지와 함께 상황에 맞는 안내를 출력한다.

### 예외처리

- [ ] 구입할 상품과 수 입력에 대한 예외처리
  - [ ] 빈값일 경우 예외처리
  - [ ] 대괄호([]), 쉼표(,), 하이픈(-)외 특수기호가 올 경우 예외처리
  - [ ] 수량이 숫자가 아닐 경우 예외처리
  - [ ] 쉼표로 끝나는 경우 예외처리
  - [ ] 개별 상품이 대괄호로 묶이지 않은 경우 예외처리
- [ ] 프로모션 적용 가능 여부 입력에 대한 예외처리
  - [ ] 'Y'와 'N'이 아닌 경우 예외처리
- [ ] 멤버십 할인 적용 여부입력에 대한 예외처리
  - [ ] 'Y'와 'N'이 아닌 경우 예외처리

### 기능 구현 순서

- [x] 환영 인사와 함께 상품명, 가격, 프로모션 이름, 재고를 안내한다. 만약 재고가 0개라면 재고 없음을 출력한다.
- [x] 구입할 상품과 수를 입력받는다.
- [ ] 상품이 프로모션 적용 가능한지 판단한다.
  - [ ] 프로모션 적용이 가능한 상품에 대해 고객이 해당 수량보다 적게 가져온 경우, 필요한 수량을 추가로 가져오면 혜택을 받을 수 있음을 안내한다.
- [ ] 프로모션 재고가 있는지 판단한다.

  - [ ] 프로모션 재고가 부족하여 일부 수량을 프로모션 혜택 없이 결제해야 하는 경우, 일부 수량에 대해 정가로 결제하게 됨을 안내한다.

- [ ] 멤버십 할인 적용 여부를 입력받는다.
- [ ] 최종 결제 금액을 계산한다.
- [ ] 구매 상품 내역, 증정 상품 내역, 금액 정보를 출력한다.
- [ ] 추가 구매 여부를 입력 받는다.
