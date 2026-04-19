# Order API

주문 생성, 조회, 수정, 취소 관련 API입니다.

> 모든 요청에 `Authorization: Bearer {token}` 헤더가 필요합니다.

---

## 목록

| Method | URL                                    | 설명             |
| ------ | -------------------------------------- | ---------------- |
| GET    | /api/members/me/orders                 | 주문 목록 조회   |
| GET    | /api/members/me/orders/:orderId        | 주문 상세 조회   |
| POST   | /api/members/me/orders                 | 주문 생성 / 결제 |
| PATCH  | /api/members/me/orders/:orderId        | 주문 수정        |
| POST   | /api/members/me/orders/:orderId/cancel | 주문 취소        |

---

## 주문 목록 조회

과거 주문 내역을 반환합니다.

- **Method**: GET
- **URL**: `/api/members/me/orders`
- **사용자**: 유저

### Response

| key                                | 설명                 | 비고                                         |
| ---------------------------------- | -------------------- | -------------------------------------------- |
| orders[].orderId                   | 주문 id              |                                              |
| orders[].orderNumber               | 주문 번호            |                                              |
| orders[].orderDate                 | 주문 일시            |                                              |
| orders[].status                    | 주문 상태            | `PAID`, `SHIPPING`, `DELIVERED`, `CANCELLED` |
| orders[].totalPrice                | 결제 금액            |                                              |
| orders[].representativeProductName | 대표 상품명          | 예: `시어 버터 핸드크림 외 1건`              |
| orders[].representativeThumbnail   | 대표 상품 썸네일 URL |                                              |

### Example

```json
{
  "orders": [
    {
      "orderId": 8801,
      "orderNumber": "ORD-20260401-001",
      "orderDate": "2026-04-01T10:00:00Z",
      "status": "DELIVERED",
      "totalPrice": 57000,
      "representativeProductName": "시어 버터 핸드 크림 외 1건",
      "representativeThumbnail": "https://cdn.../thumb.jpg"
    }
  ]
}
```

### Status

| status | 설명      |
| ------ | --------- |
| 200    | 조회 성공 |
| 401    | 인증 실패 |

---

## 주문 상세 조회

마이페이지 주문 상세 화면에서 사용합니다.

- **Method**: GET
- **URL**: `/api/members/me/orders/:orderId`
- **사용자**: 유저

### Response

| key                             | 설명           | 비고                                         |
| ------------------------------- | -------------- | -------------------------------------------- |
| orderId                         | 주문 고유 id   |                                              |
| orderNumber                     | 주문 번호      |                                              |
| status                          | 주문 상태      | `PAID`, `SHIPPING`, `DELIVERED`, `CANCELLED` |
| items[]                         | 주문 상품 배열 | 상품명, 옵션, 수량, 단가                     |
| shippingAddress.base_address    | 기본주소       |                                              |
| shippingAddress.detail_address  | 상세주소       |                                              |
| shippingAddress.receiverName    | 수령인 이름    |                                              |
| shippingAddress.receiverPhone   | 수령인 연락처  |                                              |
| shippingAddress.shippingRequest | 배송 요청사항  |                                              |
| payment                         | 결제 수단      | 예: `["card", "point"]`                      |
| tracking.carrier                | 택배사         |                                              |
| tracking.trackingNumber         | 운송장 번호    |                                              |
| createdAt                       | 주문 일시      | ISO 8601 형식                                |

### Example

```json
{
  "orderId": 8801,
  "orderNumber": "ORD-20250315-001042",
  "status": "SHIPPING",
  "items": [
    {
      "name": "시어버터 핸드크림",
      "qty": 2,
      "price": 22400
    }
  ],
  "shippingAddress": {
    "base_address": "서울시 00구 00로 123",
    "detail_address": "00아파트 111동 111호",
    "receiverName": "홍길동",
    "receiverPhone": "010-1234-5678",
    "shippingRequest": "경비실 보관해주세요"
  },
  "payment": ["card", "point"],
  "tracking": {
    "carrier": "CJ대한통운",
    "trackingNumber": "123456789"
  },
  "createdAt": "2026-04-01T23:24:15Z"
}
```

### Status

| status | 설명           |
| ------ | -------------- |
| 200    | 조회 성공      |
| 401    | 인증 실패      |
| 404    | 해당 주문 없음 |

---

## 주문 생성 / 결제

주문 정보를 생성하고 결제를 진행합니다.

- **Method**: POST
- **URL**: `/api/members/me/orders`
- **사용자**: 유저

> 포인트 사용 시 즉시 차감, 재고 즉시 차감, 결제한 상품은 장바구니에서 즉시 삭제됩니다.

### Request

| key                         | 설명           | 비고                                     |
| --------------------------- | -------------- | ---------------------------------------- |
| items[]                     | 주문 상품 배열 | `productId`, `quantity`, `optionId` 포함 |
| couponId                    | 적용할 쿠폰 id | 없을 경우 `null`                         |
| usedPoint                   | 사용할 포인트  | 100원 단위, 보유량 초과 불가             |
| paymentMethod               | 결제 수단      | `card`                                   |
| shippingInfo.receiverName   | 수령인 이름    |                                          |
| shippingInfo.phone          | 수령인 연락처  |                                          |
| shippingInfo.base_address   | 기본주소       |                                          |
| shippingInfo.detail_address | 상세주소       |                                          |
| shippingInfo.request        | 배송 요청사항  |                                          |

### Response

| key         | 설명           | 비고                      |
| ----------- | -------------- | ------------------------- |
| orderId     | 주문 고유 id   |                           |
| orderNumber | 주문 번호      | 예: `ORD-20250401-001205` |
| totalAmount | 최종 결제 금액 | 상품금액 - 쿠폰 - 포인트  |
| status      | 주문 상태      | `PAID` 고정               |

### Example

```json
{
  "success": true,
  "message": "결제가 성공적으로 완료되었습니다.",
  "data": {
    "orderId": 8801,
    "orderNumber": "ORD-20250401-001205",
    "totalAmount": 55800,
    "status": "PAID"
  }
}
```

### Status

| status | 설명                                    |
| ------ | --------------------------------------- |
| 201    | 주문 생성 및 결제 성공                  |
| 400    | 잘못된 요청 (재고 부족, 포인트 초과 등) |
| 401    | 인증 실패                               |

---

## 주문 수정

배송 전 수령 정보를 수정합니다. 결제완료(`PAID`) 상태에서만 수정 가능합니다.

- **Method**: PATCH
- **URL**: `/api/members/me/orders/:orderId`
- **사용자**: 유저

> 수정 가능 항목: 수령인 이름, 연락처, 주소, 배송 요청사항

### Request

| key             | 설명          | 비고 |
| --------------- | ------------- | ---- |
| receiverName    | 수령인 이름   |      |
| receiverPhone   | 수령인 연락처 |      |
| base_address    | 기본주소      |      |
| detail_address  | 상세주소      |      |
| shippingRequest | 배송 요청사항 |      |

### Example

```json
{
  "message": "배송지 정보가 수정되었습니다."
}
```

### Status

| status | 설명                            |
| ------ | ------------------------------- |
| 200    | 수정 성공                       |
| 400    | 잘못된 요청                     |
| 401    | 인증 실패                       |
| 403    | 수정 불가 상태 (배송 시작 이후) |

---

## 주문 취소

주문을 취소합니다. 배송 시작(`SHIPPING`) 이전 단계에서만 가능합니다.

- **Method**: POST
- **URL**: `/api/members/me/orders/:orderId/cancel`
- **사용자**: 유저

> 취소 완료 후 재고 및 포인트가 원상복구됩니다.

### Request

| key          | 설명      | 비고 |
| ------------ | --------- | ---- |
| cancelReason | 취소 사유 |      |

### Response

| key                      | 설명             | 비고            |
| ------------------------ | ---------------- | --------------- |
| orderId                  | 주문 고유 id     |                 |
| orderNumber              | 주문 번호        |                 |
| status                   | 변경된 주문 상태 | `CANCELED` 고정 |
| canceledAt               | 취소 일시        |                 |
| refundInfo.totalAmount   | 환불될 총 금액   |                 |
| refundInfo.restoredPoint | 복구된 포인트    |                 |

### Example

```json
{
  "message": "주문이 정상적으로 취소되었습니다.",
  "orderId": 20260401,
  "orderNumber": "ORD-20260401-001205",
  "status": "CANCELED",
  "canceledAt": "2026-04-01T20:15:30Z",
  "refundInfo": {
    "totalAmount": 170000,
    "restoredPoint": 5000
  }
}
```

### Status

| status | 설명                            |
| ------ | ------------------------------- |
| 200    | 취소 성공                       |
| 400    | 잘못된 요청                     |
| 401    | 인증 실패                       |
| 403    | 취소 불가 상태 (배송 시작 이후) |
