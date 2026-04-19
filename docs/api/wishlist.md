# Wishlist API

위시리스트(찜) 조회 및 추가/취소 관련 API입니다.

> 모든 요청에 `Authorization: Bearer {token}` 헤더가 필요합니다.

---

## 목록

| Method | URL                                        | 설명                 |
| ------ | ------------------------------------------ | -------------------- |
| GET    | /api/members/me/wishlist                   | 위시리스트 조회      |
| POST   | /api/members/me/wishlist/:productId/toggle | 위시리스트 추가/취소 |

---

## 위시리스트 조회

로그인 회원이 찜한 전체 상품 목록을 반환합니다.

- **Method**: GET
- **URL**: `/api/members/me/wishlist`
- **사용자**: 유저

### Request (Query parameter)

| key   | 설명             | 비고          |
| ----- | ---------------- | ------------- |
| page  | 페이지 번호      |               |
| limit | 페이지당 상품 수 | default: `10` |

### Response

| key                   | 설명              | 비고 |
| --------------------- | ----------------- | ---- |
| items[].productId     | 상품 id           |      |
| items[].name          | 상품명            |      |
| items[].price         | 정상가            |      |
| items[].discountPrice | 할인가            |      |
| items[].thumbnailUrl  | 썸네일 URL        |      |
| items[].isInStock     | 재고 여부         |      |
| items[].wishedAt      | 찜한 일시         |      |
| total                 | 전체 찜한 상품 수 |      |

### Example

```json
{
  "data": {
    "items": [
      {
        "productId": 301,
        "name": "시어 버터 핸드크림 75ml",
        "price": 28000,
        "discountPrice": 22400,
        "thumbnailUrl": "https://cdn.../301.jpg",
        "isInStock": true,
        "wishedAt": "2025-03-01T10:00:00Z"
      }
    ],
    "total": 5
  }
}
```

### Status

| status | 설명      |
| ------ | --------- |
| 200    | 조회 성공 |
| 401    | 인증 실패 |

---

## 위시리스트 추가/취소

찜 상태를 자동으로 전환합니다. 이미 찜한 상품이면 취소, 아니면 추가됩니다.

- **Method**: POST
- **URL**: `/api/members/me/wishlist/:productId/toggle`
- **사용자**: 유저

> 하트 버튼 클릭 시 사용합니다. `isWished` 값으로 현재 상태를 확인할 수 있습니다.

### Response

| key       | 설명                   | 비고                          |
| --------- | ---------------------- | ----------------------------- |
| isWished  | 토글 후 찜 상태        | `true`면 추가, `false`면 취소 |
| wishCount | 해당 상품의 전체 찜 수 |                               |

### Example

```json
{
  "success": true,
  "data": {
    "isWished": true,
    "wishCount": 3421
  }
}
```

### Status

| status | 설명                                    |
| ------ | --------------------------------------- |
| 200    | 추가 또는 취소 성공 (`isWished`로 구분) |
| 401    | 인증 실패                               |
| 404    | 해당 상품 없음                          |
