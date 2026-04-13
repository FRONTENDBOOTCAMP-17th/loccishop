# 연관상품 API `isWished` 버그 수정 안내

## 문제

`GET /api/loccishop/v1/products/{id}/related` 에서 토큰을 포함해서 요청해도 `isWished`가 항상 `false`로 반환되던 문제가 수정되었습니다.

## 수정 후 동작

| 상황 | isWished |
|------|----------|
| 토큰 없이 호출 | 항상 `false` |
| 토큰 있음 + 위시리스트에 없는 상품 | `false` |
| 토큰 있음 + 위시리스트에 있는 상품 | `true` |

메인 상품 목록(`GET /products`)과 동일하게 동작합니다.

---

## 사용법

### 토큰 없이 호출 (비로그인)

```js
const response = await fetch(
  "https://api.fullstackfamily.com/api/loccishop/v1/products/1/related"
);
const result = await response.json();

// isWished는 모두 false
result.data.products.forEach(function (product) {
  console.log(product.name, "위시:", product.isWished); // false
});
```

### 토큰과 함께 호출 (로그인 상태)

```js
const token = localStorage.getItem("lcs-token");

const response = await fetch(
  "https://api.fullstackfamily.com/api/loccishop/v1/products/1/related",
  {
    headers: {
      Authorization: "Bearer " + token,
    },
  }
);
const result = await response.json();

// 위시리스트에 담은 상품은 isWished: true
result.data.products.forEach(function (product) {
  console.log(product.name, "위시:", product.isWished); // true 또는 false
});
```

### 응답 예시

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 5,
        "name": "체리블라썸 핸드크림 30ml",
        "price": 19000,
        "discountRate": 0,
        "thumbnailUrl": "https://placehold.co/400x400?text=CherryHand30ml",
        "badge": null,
        "isWished": true
      },
      {
        "id": 3,
        "name": "라벤더 핸드크림 75ml",
        "price": 32000,
        "discountRate": 10,
        "discountPrice": 28800,
        "thumbnailUrl": "https://placehold.co/400x400?text=LavenderHand75ml",
        "badge": "SALE",
        "isWished": false
      }
    ]
  }
}
```

---

## API 문서 페이지

https://www.fullstackfamily.com/loccishop/api-docs
