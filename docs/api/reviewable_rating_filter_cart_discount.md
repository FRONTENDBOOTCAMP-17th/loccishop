# API 추가/수정 안내: 리뷰 작성 가능 여부, 별점 필터, 장바구니 할인

> 2026-04-09

---

## 1. 리뷰 작성 가능 여부 확인 (신규)

```
GET /api/loccishop/v1/members/me/orders/reviewable
Authorization: Bearer {토큰}
```

### 사용법

**상품 상세 페이지에서:**
```
?productId=5
```

**마이페이지 주문 내역에서:**
```
?orderId=9
```

### 응답

```json
{
  "success": true,
  "data": {
    "orderId": 9,
    "isReviewable": true
  }
}
```

| 상황 | isReviewable | orderId |
|------|:----------:|---------|
| 구매 O + 리뷰 미작성 | `true` | 주문 ID |
| 구매 O + 리뷰 작성됨 | `false` | 주문 ID |
| 구매 X | `false` | `null` |

### 프론트엔드 예시

```javascript
// 상품 상세 페이지에서 리뷰 버튼 표시 여부 결정
const res = await fetchJsonWithAuth(
  `/api/loccishop/v1/members/me/orders/reviewable?productId=${productId}`
)
if (res.data.isReviewable) {
  // "리뷰 작성" 버튼 표시
  // res.data.orderId를 리뷰 작성 시 전달
}
```

---

## 2. 별점별 리뷰 필터링

```
GET /api/loccishop/v1/products/{id}/reviews?rating=5
```

### 파라미터

| 이름 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `rating` | number | X | 별점 필터 (1~5). 생략 시 전체 반환 |
| `sort` | string | X | 정렬 (latest, rating_high, rating_low, photo) |
| `page` | number | X | 페이지 (기본 1) |
| `limit` | number | X | 개수 (기본 10) |

### 예시

```bash
# 5점 리뷰만
GET /products/5/reviews?rating=5&page=1&limit=10

# 3점 리뷰, 최신순
GET /products/5/reviews?rating=3&sort=latest

# 전체 (기존과 동일)
GET /products/5/reviews?page=1&limit=10
```

> `meta.ratingAverage`와 `meta.ratingCounts`는 항상 해당 상품 전체 기준으로 반환됩니다 (rating 필터와 무관).

---

## 3. 장바구니 할인 필드 추가

```
GET /api/loccishop/v1/members/me/cart
Authorization: Bearer {토큰}
```

### 응답 (변경 후)

```json
{
  "items": [
    {
      "cartItemId": 3,
      "productId": 12,
      "productName": "시어 바디 로션 250ml",
      "optionLabel": "250ml",
      "quantity": 1,
      "price": 38000,
      "discountRate": 20,
      "discountPrice": 30400,
      "thumbnailUrl": "...",
      "stock": 98,
      "subtotal": 30400,
      "isGift": false
    }
  ]
}
```

### 변경된 필드

| 필드 | 변경 | 설명 |
|------|------|------|
| `price` | **원가로 변경** | 이전: 할인 적용 후 가격 → 현재: 원래 가격 |
| `discountRate` | **추가** | 할인율 (0이면 할인 없음) |
| `discountPrice` | **추가** | 할인가 (할인 없으면 필드 자체 생략) |
| `subtotal` | 변경 없음 | 할인 적용 후 가격 × 수량 |

### 프론트엔드 처리

```javascript
const item = cartItems[0]

if (item.discountPrice) {
  // 할인 있음
  console.log(`원가: ${item.price}원`)
  console.log(`${item.discountRate}% 할인 → ${item.discountPrice}원`)
} else {
  // 할인 없음
  console.log(`${item.price}원`)
}
```

프로덕션에 이미 반영되었습니다.
