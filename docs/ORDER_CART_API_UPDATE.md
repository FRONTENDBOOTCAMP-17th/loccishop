# LocciShop 주문/장바구니 API 변경 안내

## 변경 요약

1. **주문 상세** — `totalAmount`, `usedPoint`, `earnedPoint` + 아이템별 `productId`, `subtotal`, `thumbnailUrl`, `discountPrice`, `discountRate` 추가
2. **주문 목록** — 페이지네이션 (`page`, `limit`, `sort`) 추가
3. **장바구니** — 페이지네이션 (`page`, `limit`) 추가

---

## 1. GET /members/me/orders/{orderId} — 주문 상세

### 추가된 필드

**최상위:**

| 필드 | 타입 | 설명 |
|------|------|------|
| `totalAmount` | number | 포인트 차감 후 최종 결제 금액 |
| `usedPoint` | number | 사용한 포인트 |
| `earnedPoint` | number | 적립된 포인트 (결제금액의 1%) |

**items 배열:**

| 필드 | 타입 | 설명 |
|------|------|------|
| `productId` | number | 상품 ID (상세 페이지 이동용) |
| `subtotal` | number | 상품별 소계 (price × quantity) |
| `thumbnailUrl` | string | 상품 썸네일 URL |
| `discountPrice` | number \| null | 할인가 (할인 없으면 null) |
| `discountRate` | number \| null | 할인율 (할인 없으면 null) |

### JavaScript 코드

```js
const token = localStorage.getItem("lcs-token");

async function getOrderDetail(orderId) {
  const response = await fetch(
    `https://api.fullstackfamily.com/api/loccishop/v1/members/me/orders/${orderId}`,
    {
      headers: { Authorization: "Bearer " + token },
    }
  );
  const result = await response.json();

  if (result.success) {
    const order = result.data;

    console.log("주문번호:", order.orderNumber);
    console.log("결제금액:", order.totalAmount);
    console.log("사용 포인트:", order.usedPoint);
    console.log("적립 포인트:", order.earnedPoint);

    // 주문 상품 목록
    order.items.forEach(function (item) {
      console.log("---");
      console.log("상품:", item.name);
      console.log("수량:", item.qty);
      console.log("단가:", item.price);
      console.log("할인가:", item.discountPrice); // null이면 할인 없음
      console.log("할인율:", item.discountRate);   // null이면 할인 없음
      console.log("소계:", item.subtotal);
      console.log("썸네일:", item.thumbnailUrl);
      console.log("상품ID:", item.productId);
    });
  }
}
```

### 응답 예시

```json
{
  "success": true,
  "data": {
    "orderId": 8,
    "orderNumber": "ORD-20260413-532671",
    "status": "PAID",
    "totalAmount": 53000,
    "usedPoint": 0,
    "earnedPoint": 530,
    "items": [
      {
        "productId": 1,
        "name": "시어 버터 핸드크림 30ml",
        "qty": 2,
        "price": 17000,
        "discountPrice": null,
        "discountRate": null,
        "subtotal": 34000,
        "thumbnailUrl": "https://placehold.co/400x400?text=SheaHand30ml"
      },
      {
        "productId": 5,
        "name": "체리블라썸 핸드크림 30ml",
        "qty": 1,
        "price": 19000,
        "discountPrice": null,
        "discountRate": null,
        "subtotal": 19000,
        "thumbnailUrl": "https://placehold.co/400x400?text=CherryHand30ml"
      }
    ],
    "shippingAddress": {
      "baseAddress": "서울시 강남구 테헤란로 123",
      "detailAddress": "4층 401호",
      "receiverName": "홍길동",
      "receiverPhone": "010-1234-5678",
      "shippingRequest": "부재 시 경비실에 맡겨주세요."
    },
    "payment": ["CARD"],
    "tracking": {},
    "createdAt": "2026-04-13T20:55:48.009201"
  }
}
```

> `discountPrice`와 `discountRate`는 **주문 시점의 할인 정보**입니다. 이후 상품 가격이 바뀌어도 주문 내역에는 당시 정보가 유지됩니다.

---

## 2. GET /members/me/orders — 주문 목록 (페이지네이션)

### 쿼리 파라미터

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `page` | number | 1 | 페이지 번호 |
| `limit` | number | 10 | 페이지당 개수 |
| `sort` | string | "latest" | 정렬 ("latest" = 최신순, "oldest" = 오래된순) |

### JavaScript 코드

```js
const token = localStorage.getItem("lcs-token");

async function getOrders(page = 1, limit = 10, sort = "latest") {
  const response = await fetch(
    `https://api.fullstackfamily.com/api/loccishop/v1/members/me/orders?page=${page}&limit=${limit}&sort=${sort}`,
    {
      headers: { Authorization: "Bearer " + token },
    }
  );
  const result = await response.json();

  if (result.success) {
    // 주문 목록
    result.data.orders.forEach(function (order) {
      console.log(order.orderNumber, order.status, order.totalPrice);
    });

    // 페이지네이션 정보
    const pagination = result.meta.pagination;
    console.log("현재 페이지:", pagination.page);
    console.log("전체 페이지:", pagination.totalPages);
    console.log("다음 페이지 있음:", pagination.hasNext);
  }
}

// 사용 예시
getOrders(1, 5, "latest");   // 최신순 5개
getOrders(2, 5, "latest");   // 2페이지
getOrders(1, 10, "oldest");  // 오래된순
```

### 응답 예시

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "orderId": 8,
        "orderNumber": "ORD-20260413-532671",
        "orderDate": "2026-04-13T20:55:48.009201",
        "status": "PAID",
        "totalPrice": 53000,
        "representativeProductName": "시어 버터 핸드크림 30ml 외 1건",
        "representativeThumbnail": "https://placehold.co/400x400?text=SheaHand30ml"
      }
    ]
  },
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 2,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

---

## 3. GET /members/me/cart — 장바구니 (페이지네이션)

### 쿼리 파라미터

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `page` | number | 1 | 페이지 번호 |
| `limit` | number | 20 | 페이지당 개수 |

> `total`(전체 합계)은 현재 페이지가 아니라 **장바구니 전체 금액**입니다.

### JavaScript 코드

```js
const token = localStorage.getItem("lcs-token");

async function getCart(page = 1, limit = 20) {
  const response = await fetch(
    `https://api.fullstackfamily.com/api/loccishop/v1/members/me/cart?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: "Bearer " + token },
    }
  );
  const result = await response.json();

  if (result.success) {
    // 장바구니 상품
    result.data.items.forEach(function (item) {
      console.log(item.productName, "x", item.quantity, "=", item.subtotal);
    });

    // 배송비 & 합계
    console.log("배송비:", result.data.shipping);
    console.log("전체 합계:", result.data.total);

    // 페이지네이션
    const pagination = result.meta.pagination;
    console.log("전체 상품 수:", pagination.totalItems);
  }
}
```

---

## API 문서 페이지

https://www.fullstackfamily.com/loccishop/api-docs

위 페이지에서 직접 API를 호출하고 응답을 확인할 수 있습니다.
