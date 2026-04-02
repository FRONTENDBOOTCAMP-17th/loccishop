# Cart API

장바구니 조회, 상품 추가/수량 변경/삭제 관련 API입니다.

> 모든 요청에 `Authorization: Bearer {token}` 헤더가 필요합니다.

---

## 목록

| Method | URL                                    | 설명                    |
| ------ | -------------------------------------- | ----------------------- |
| GET    | /api/members/me/cart                   | 장바구니 조회           |
| POST   | /api/members/me/cart/items             | 장바구니 상품 추가      |
| PUT    | /api/members/me/cart/items/:cartItemId | 장바구니 상품 수량 변경 |
| DELETE | /api/members/me/cart/:cartItemId       | 장바구니 상품 삭제      |

---

## 장바구니 조회

현재 담긴 상품 목록과 금액 합계를 반환합니다.

- **Method**: GET
- **URL**: `/api/members/me/cart`
- **사용자**: 유저

### Response

| key                   | 설명                | 비고                                               |
| --------------------- | ------------------- | -------------------------------------------------- |
| items[].cartItemId    | 장바구니 아이템 id  |                                                    |
| items[].productId     | 상품 id             |                                                    |
| items[].productName   | 상품명              |                                                    |
| items[].optionId      | 선택한 옵션 id      |                                                    |
| items[].optionLabel   | 옵션 표시 이름      |                                                    |
| items[].quantity      | 수량                | 사은품은 수량 변경 불가 (Read-only)                |
| items[].price         | 옵션 단가           | 할인이 적용된 최종 단가                            |
| items[].thumbnailUrl  | 상품 썸네일 이미지  |                                                    |
| items[].stock         | 현재 재고           |                                                    |
| items[].subtotal      | 상품 금액 합계      | `price * quantity` / 사은품은 `0`                  |
| items[].isGift        | 사은품 여부         | `true`면 가격 '무료' 표시, 수량 조절 버튼 비활성화 |
| items[].giftCondition | 사은품 증정 조건    | 사은품일 때만 전달, 그 외 `null`                   |
| shipping              | 배송비              | 항상 `0`                                           |
| total                 | 최종 결제 예정 금액 |                                                    |

### Example

```json
{
  "items": [
    {
      "cartItemId": 12401,
      "productId": 101,
      "productName": "시어 버터 핸드 크림 (카리테 콩포르)",
      "optionId": "01MA030K26",
      "optionLabel": "30 ml",
      "quantity": 4,
      "price": 17000,
      "thumbnailUrl": "https://cdn.../hand_cream_30ml.jpg",
      "stock": 50,
      "subtotal": 68000,
      "isGift": false,
      "giftCondition": null
    },
    {
      "cartItemId": 99999,
      "productId": 888,
      "productName": "13만원 이상 구매 사은품 (증정)",
      "optionId": null,
      "optionLabel": null,
      "quantity": 1,
      "price": 0,
      "thumbnailUrl": "https://cdn.../gift_pouch_set.jpg",
      "stock": 999,
      "subtotal": 0,
      "isGift": true,
      "giftCondition": "공식몰 13만원 이상 구매 시 증정"
    }
  ],
  "shipping": 0,
  "total": 398000
}
```

### Status

| status | 설명      |
| ------ | --------- |
| 200    | 조회 성공 |
| 401    | 인증 실패 |

---

## 장바구니 상품 추가

상품과 옵션을 선택해 장바구니에 담습니다. 이미 있는 옵션이면 수량이 합산됩니다.

- **Method**: POST
- **URL**: `/api/members/me/cart/items`
- **사용자**: 유저

### Request

| key       | 설명           | 비고                          |
| --------- | -------------- | ----------------------------- |
| productId | 담을 상품 id   |                               |
| optionId  | 선택한 옵션 id | 옵션 없는 상품은 기본 옵션 id |
| quantity  | 담을 수량      | 최소 1개, 재고 초과 불가      |

### Response

| key        | 설명                    | 비고 |
| ---------- | ----------------------- | ---- |
| cartItemId | 장바구니 아이템 id      |      |
| totalItems | 장바구니 전체 아이템 수 |      |

### Example

```json
{
  "success": true,
  "data": {
    "cartItemId": 55,
    "totalItems": 3
  }
}
```

### Status

| status | 설명                       |
| ------ | -------------------------- |
| 200    | 추가 성공                  |
| 400    | 잘못된 요청 (재고 초과 등) |
| 401    | 인증 실패                  |

---

## 장바구니 상품 수량 변경

장바구니 특정 상품의 수량을 변경합니다. 재고를 초과한 수량은 400 오류를 반환합니다.

- **Method**: PUT
- **URL**: `/api/members/me/cart/items/:cartItemId`
- **사용자**: 유저

### Request

| key      | 설명        | 비고                     |
| -------- | ----------- | ------------------------ |
| quantity | 변경할 수량 | 최소 1개, 재고 초과 불가 |

### Response

| key              | 설명                | 비고 |
| ---------------- | ------------------- | ---- |
| cartItemId       | 수정된 아이템 id    |      |
| quantity         | 변경 후 수량        |      |
| summary.subtotal | 총 상품 금액        |      |
| summary.shipping | 배송비              |      |
| summary.total    | 최종 결제 예정 금액 |      |

### Example

```json
{
  "success": true,
  "data": {
    "cartItemId": 55,
    "quantity": 3,
    "summary": {
      "subtotal": 67200,
      "shipping": 0,
      "total": 67200
    }
  }
}
```

### Status

| status | 설명                       |
| ------ | -------------------------- |
| 200    | 수량 변경 성공             |
| 400    | 잘못된 요청 (재고 초과 등) |
| 401    | 인증 실패                  |

---

## 장바구니 상품 삭제

장바구니에 담긴 상품을 삭제합니다. 삭제 시 최종 결제 금액 및 사은품 증정 조건이 즉시 재계산됩니다.

- **Method**: DELETE
- **URL**: `/api/members/me/cart/:cartItemId`
- **사용자**: 유저

### Response

| key                 | 설명                | 비고                      |
| ------------------- | ------------------- | ------------------------- |
| summary.subTotal    | 총 상품 금액        | 삭제된 아이템 제외한 합계 |
| summary.shippingFee | 배송비              |                           |
| summary.total       | 최종 결제 예정 금액 |                           |

### Example

```json
{
  "message": "아이템이 삭제되었습니다.",
  "summary": {
    "subTotal": 330000,
    "shippingFee": 0,
    "total": 330000
  }
}
```

### Status

| status | 설명        |
| ------ | ----------- |
| 200    | 삭제 성공   |
| 400    | 잘못된 요청 |
| 401    | 인증 실패   |
