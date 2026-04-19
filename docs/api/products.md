# Products API

상품 목록, 상세, 재고 확인, 연관 상품 조회 관련 API입니다.

---

## 목록

| Method | URL                       | 설명                                |
| ------ | ------------------------- | ----------------------------------- |
| GET    | /api/products             | 상품 목록 조회 (필터링/정렬/페이징) |
| GET    | /api/products/:id         | 상품 상세 조회                      |
| GET    | /api/products/:id/stock   | 상품 실시간 재고 확인               |
| GET    | /api/products/:id/related | 연관 상품 조회                      |

---

## 상품 목록 조회

상품 리스트 페이지에서 사용합니다. 쿼리 파라미터로 필터와 정렬을 조합할 수 있습니다.

- **Method**: GET
- **URL**: `/api/products`
- **사용자**: 유저

### Request (Query parameter)

| key        | 설명              | 비고                         |
| ---------- | ----------------- | ---------------------------- |
| page       | 페이지 번호       |                              |
| limit      | 한 페이지 상품 수 | default: `20`                |
| categoryId | 카테고리 id       |                              |
| sort       | 정렬 기준         | `최신순`, `인기순`, `가격순` |
| badge      | 상품 특징 필터    | `new`, `best`, `sale`        |

### Response

| key                      | 설명              | 비고                                                  |
| ------------------------ | ----------------- | ----------------------------------------------------- |
| products[].id            | 상품 id           |                                                       |
| products[].name          | 상품명            |                                                       |
| products[].size          | 상품 용량         |                                                       |
| products[].price         | 정상가            |                                                       |
| products[].discountPrice | 할인가            | 할인 없으면 `null`                                    |
| products[].discountRate  | 할인율            | 할인 없으면 `null`                                    |
| products[].images[]      | 썸네일 이미지 URL | `[0]` 기본, `[1]` 호버 시 이미지                      |
| products[].badge         | 상품 특징         |                                                       |
| products[].isWished      | 찜 상태           | `true`, `false`                                       |
| products[].stockStatus   | 재고 상태         | `IN_STOCK`, `LIMITED`, `OUT_OF_STOCK`, `DISCONTINUED` |
| pagination.total         | 전체 상품 수      |                                                       |
| pagination.totalPages    | 전체 페이지 수    |                                                       |
| pagination.currentPage   | 현재 페이지       |                                                       |
| pagination.sizePerPage   | 한 페이지 상품 수 |                                                       |

### Example

```json
{
  "success": true,
  "message": "상품 목록 조회가 완료되었습니다.",
  "data": {
    "products": [
      {
        "id": 101,
        "name": "시어 버터 핸드 크림",
        "size": "30 ml",
        "price": 17000,
        "discountPrice": 15300,
        "discountRate": 10,
        "images": [
          "https://cdn.../thumb_01.png",
          "https://cdn.../thumb_hover.png"
        ],
        "badge": "NEW",
        "isWished": false,
        "stockStatus": "IN_STOCK"
      }
    ],
    "pagination": {
      "total": 48,
      "totalPages": 5,
      "currentPage": 1,
      "sizePerPage": 10
    }
  }
}
```

### Status

| status | 설명           |
| ------ | -------------- |
| 200    | 조회 성공      |
| 404    | 해당 상품 없음 |

---

## 상품 상세 조회

상품 상세 페이지에 필요한 모든 정보를 반환합니다.

- **Method**: GET
- **URL**: `/api/products/:id`
- **사용자**: 유저

> 로그인 상태일 때 `isWished` 값이 정확히 반환됩니다. 비로그인 시 `false` 고정.

### Response

| key              | 설명                    | 비고                          |
| ---------------- | ----------------------- | ----------------------------- |
| id               | 상품 고유 번호 (SKU id) |                               |
| name             | 상품명                  |                               |
| badge            | 상품 특징               | `new`, `best`, `sale`         |
| shortDescription | 간단 상품 소개          |                               |
| description      | 상세 설명               |                               |
| price            | 정상가                  |                               |
| discountPrice    | 할인가                  |                               |
| discountRate     | 할인율                  |                               |
| stock            | 재고                    |                               |
| categoryId       | 카테고리 id             |                               |
| averageRating    | 평균 별점               |                               |
| reviewCount      | 전체 리뷰 수            |                               |
| isWished         | 찜 여부                 |                               |
| images           | 이미지 객체             | 아래 이미지 객체 구조 참조    |
| options          | 옵션 배열               | 아래 옵션 객체 구조 참조      |
| productInfo      | 상품 정보               | 아래 상품 정보 객체 구조 참조 |

**이미지 객체 구조**

| key                     | 설명                          |
| ----------------------- | ----------------------------- |
| images.representative   | 대표 썸네일 이미지 URL        |
| images.mainSlides[]     | 메인 슬라이드 이미지 URL 배열 |
| images.detailContents[] | 상세 이미지 URL 배열          |

**옵션 객체 구조**

| key                 | 설명                      |
| ------------------- | ------------------------- |
| options[].id        | 옵션 SKU id               |
| options[].label     | 옵션 표시 이름 (용량 등)  |
| options[].url       | 해당 옵션 상세페이지 경로 |
| options[].isCurrent | 현재 보고 있는 옵션 여부  |

**상품 정보 객체 구조**

| key                                      | 설명                                |
| ---------------------------------------- | ----------------------------------- |
| productInfo.howToUse                     | 사용 방법                           |
| productInfo.ingredients.keyIngredients[] | 주요 성분 배열 (이름, 이미지, 설명) |
| productInfo.ingredients.fullIngredients  | 전성분 텍스트                       |
| productInfo.productDisclosure            | 상품 고시 정보                      |

### Example

```json
{
  "id": "01MA150K26",
  "name": "시어 버터 핸드 크림",
  "badge": "NEW",
  "shortDescription": "2초에 하나씩 판매되는 베스트셀러",
  "description": "20% 시어 버터를 함유해 손에 깊은 영양과 보습을 선사합니다.",
  "price": 30000,
  "discountPrice": 18000,
  "discountRate": 40,
  "stock": 50,
  "categoryId": 10,
  "averageRating": 4.9,
  "reviewCount": 1245,
  "isWished": false,
  "images": {
    "representative": "https://cdn.../shea_150ml_thumb.jpg",
    "mainSlides": ["https://cdn.../main.jpg", "https://cdn.../main2.jpg"],
    "detailContents": ["https://cdn.../side1.jpg", "https://cdn.../side2.jpg"]
  },
  "options": [
    {
      "id": "01MA030K26",
      "label": "30 ml",
      "url": "/product/detail/01MA030K26",
      "isCurrent": false
    },
    {
      "id": "01MA150K26",
      "label": "150 ml",
      "url": "/product/detail/01MA150K26",
      "isCurrent": true
    }
  ],
  "productInfo": {
    "howToUse": "손이 건조할 때마다 적당량을 덜어 손에 부드럽게 펴 바릅니다.",
    "ingredients": {
      "keyIngredients": [
        {
          "id": 1,
          "name": "시어 버터",
          "imageUrl": "https://cdn.../shea.jpg",
          "description": "깊은 보습과 영양 공급"
        }
      ],
      "fullIngredients": "정제수, 시어버터..."
    },
    "productDisclosure": "1. 내용물의 용량 및 중량: 150ml"
  }
}
```

### Status

| status | 설명                             |
| ------ | -------------------------------- |
| 200    | 조회 성공                        |
| 404    | 존재하지 않거나 판매 중지된 상품 |

---

## 상품 실시간 재고 확인

장바구니 담기 전 또는 결제 버튼 클릭 시 최신 재고를 확인합니다.

- **Method**: GET
- **URL**: `/api/products/:id/stock`
- **사용자**: 유저

### Response

| key          | 설명           | 비고           |
| ------------ | -------------- | -------------- |
| productId    | 상품 id        |                |
| currentStock | 현재 재고 수량 |                |
| isAvailable  | 구매 가능 여부 | `false`면 품절 |

### Example

```json
{
  "status": "success",
  "data": {
    "productId": "01MA150K26",
    "currentStock": 5,
    "isAvailable": true
  }
}
```

### Status

| status | 설명                     |
| ------ | ------------------------ |
| 200    | 조회 성공                |
| 404    | 재고 정보 확인 불가 상품 |

---

## 연관 상품 조회

현재 상세페이지 상품과 동일한 카테고리의 상품 목록을 반환합니다. 현재 상품은 목록에서 제외됩니다.

- **Method**: GET
- **URL**: `/api/products/:id/related`
- **사용자**: 유저

### Request (Query parameter)

| key   | 설명             | 비고          |
| ----- | ---------------- | ------------- |
| limit | 노출할 상품 개수 | default: `10` |

### Response

| key                      | 설명                   | 비고               |
| ------------------------ | ---------------------- | ------------------ |
| products[].id            | 상품 id                |                    |
| products[].name          | 상품명                 |                    |
| products[].size          | 상품 용량              |                    |
| products[].price         | 정상가                 |                    |
| products[].discountPrice | 할인가                 | 할인 없으면 `null` |
| products[].images[]      | 썸네일 이미지 URL 배열 |                    |
| products[].badge         | 상품 특징              |                    |
| products[].isWished      | 찜 상태                |                    |

### Example

```json
{
  "products": [
    {
      "id": 101,
      "name": "시어 버터 핸드 크림",
      "size": "75 ml",
      "price": 29000,
      "discountPrice": 26100,
      "images": [
        "https://cdn.../hand_cream_75ml_01.jpg",
        "https://cdn.../hand_cream_75ml_02.jpg"
      ],
      "badge": "BEST",
      "isWished": false
    },
    {
      "id": 105,
      "name": "시어 버터 핸드 밤",
      "size": "150 ml",
      "price": 45000,
      "discountPrice": null,
      "images": ["https://cdn.../hand_balm_150ml_01.jpg"],
      "badge": "NEW",
      "isWished": true
    }
  ]
}
```

### Status

| status | 설명           |
| ------ | -------------- |
| 200    | 조회 성공      |
| 404    | 연관 상품 없음 |
