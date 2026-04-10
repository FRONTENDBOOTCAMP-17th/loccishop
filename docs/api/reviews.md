# Reviews API

상품 리뷰 조회, 작성, 수정, 삭제 관련 API입니다.

> 리뷰 작성/수정/삭제는 `Authorization: Bearer {token}` 헤더가 필요합니다.

---

## 목록

| Method | URL                               | 설명                |
| ------ | --------------------------------- | ------------------- |
| POST   | /api/reviews/images               | 리뷰 이미지 업로드  |
| GET    | /api/products/:id/reviews         | 상품 리뷰 조회      |
| POST   | /api/products/:id/reviews         | 상품 리뷰 작성      |
| PATCH  | /api/members/me/reviews/:reviewId | 상품 리뷰 수정      |
| DELETE | /api/members/me/reviews/:reviewId | 상품 리뷰 삭제      |

---

## 리뷰 이미지 업로드

리뷰에 첨부할 이미지를 업로드합니다. 업로드된 이미지 URL을 리뷰 작성/수정 시 `images[]`에 넣어 사용합니다.

- **Method**: POST
- **URL**: `/api/reviews/images`
- **Content-Type**: `multipart/form-data`
- **사용자**: 유저 (로그인 필수)

### Request

| key  | 타입 | 설명       | 비고                             |
| ---- | ---- | ---------- | -------------------------------- |
| file | File | 이미지 파일 | JPEG, PNG, WebP, GIF / 최대 5MB |

### Response

| key      | 설명              | 비고 |
| -------- | ----------------- | ---- |
| imageUrl | 업로드된 이미지 URL | CDN URL |

### Example

**요청 (JavaScript)**:

```js
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/api/reviews/images', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  },
  body: formData  // Content-Type은 자동 설정됨 (multipart/form-data)
});

const result = await response.json();
console.log(result.data.imageUrl);
// "https://storage.fullstackfamily.com/content/loccishop/reviews/abc123.webp"
```

**응답**:

```json
{
  "success": true,
  "data": {
    "imageUrl": "https://storage.fullstackfamily.com/content/loccishop/reviews/abc123.webp"
  }
}
```

### Status

| status | 설명                                          |
| ------ | --------------------------------------------- |
| 201    | 업로드 성공                                   |
| 400    | 파일이 비어있음 / 허용되지 않는 형식          |
| 401    | 인증 실패                                     |
| 413    | 파일 크기 5MB 초과                            |

### 사용 흐름

리뷰에 이미지를 첨부하려면 **2단계**로 진행합니다:

```
1단계: POST /api/reviews/images   → 이미지 업로드 → imageUrl 받기
2단계: POST /api/products/:id/reviews  → images 배열에 URL 넣어서 리뷰 작성
```

---

## 상품 리뷰 조회

해당 상품의 리뷰 목록을 반환합니다.

- **Method**: GET
- **URL**: `/api/products/:id/reviews`
- **사용자**: 유저

### Request (Query parameter)

| key  | 설명                | 비고                                                                                        |
| ---- | ------------------- | ------------------------------------------------------------------------------------------- |
| page | 페이지 번호         |                                                                                             |
| size | 한 페이지당 리뷰 수 |                                                                                             |
| sort | 정렬 기준           | `latest`(최신순), `photo`(사진 첨부), `rating_high`(별점 높은순), `rating_low`(별점 낮은순) |

### Response

| key                      | 설명                 | 비고                                                                |
| ------------------------ | -------------------- | ------------------------------------------------------------------- |
| reviews[].id             | 리뷰 고유 번호       |                                                                     |
| reviews[].isMyReview     | 본인 리뷰 여부       | 로그인한 사용자가 작성한 리뷰면 `true`, 그 외(비로그인/타인)는 `false` |
| reviews[].title          | 리뷰 제목            |                                                                     |
| reviews[].content        | 리뷰 본문            |                                                                     |
| reviews[].rating         | 별점                 |                                                                     |
| reviews[].author         | 작성자 이름          |                                                                     |
| reviews[].createdAt      | 작성일               |                                                                     |
| reviews[].reviewImages[] | 리뷰 이미지 URL 배열 | 텍스트 리뷰면 빈 배열 `[]`                                          |
| reviews[].recommendCount | 추천 수              |                                                                     |
| reviews[].isRecommended  | 추천 여부 (본인 기준) | 로그인 사용자가 이 리뷰에 추천했으면 `true`                         |

> `isMyReview` 필드는 본인 리뷰에만 수정/삭제 버튼을 노출하는 데 사용합니다. 비로그인 상태에서는 항상 `false`입니다.

### Example

```json
{
  "reviews": [
    {
      "id": 101,
      "isMyReview": true,
      "title": "핸드크림계 국밥",
      "content": "코코넛 향에 하드한 핸드크림. 보습력이 매우 우수함...",
      "rating": 5,
      "author": "Jay",
      "createdAt": "2025-06-01",
      "reviewImages": ["https://cdn.../thumb.jpg"],
      "recommendCount": 12,
      "isRecommended": false
    }
  ]
}
```

### Status

| status | 설명        |
| ------ | ----------- |
| 200    | 조회 성공   |
| 400    | 잘못된 요청 |

---

## 상품 리뷰 작성

실제 구매한 회원만 작성 가능합니다. 이미지는 최대 5장까지 첨부할 수 있습니다.

- **Method**: POST
- **URL**: `/api/products/:id/reviews`
- **사용자**: 유저 (구매자)

### Request

| key         | 설명                | 비고      |
| ----------- | ------------------- | --------- |
| orderId     | 구매 확인용 주문 id |           |
| rating      | 평점                |           |
| isRecommend | 추천 여부           |           |
| title       | 리뷰 제목           |           |
| content     | 리뷰 내용           | 최소 10자 |
| images[]    | 이미지 URL 배열     | 최대 5장  |
| nickname    | 닉네임              |           |

### Response

| key         | 설명             | 비고        |
| ----------- | ---------------- | ----------- |
| reviewId    | 리뷰 id          |             |
| reviewPoint | 리뷰 적립 포인트 | `200p` 적립 |

### Example

```json
{
  "success": true,
  "message": "리뷰가 등록되었습니다. 200포인트가 적립되었습니다.",
  "data": {
    "reviewId": 202,
    "reviewPoint": 200
  }
}
```

### Status

| status | 설명                                             |
| ------ | ------------------------------------------------ |
| 201    | 작성 성공                                        |
| 400    | 잘못된 요청 (내용 10자 미만, 이미지 5장 초과 등) |
| 401    | 인증 실패                                        |
| 403    | 구매 이력 없음                                   |

---

## 상품 리뷰 수정

본인이 작성한 리뷰를 수정합니다.

- **Method**: PATCH
- **URL**: `/api/members/me/reviews/:reviewId`
- **사용자**: 유저

### Request

| key         | 설명            | 비고 |
| ----------- | --------------- | ---- |
| rating      | 평점            |      |
| isRecommend | 추천 여부       |      |
| title       | 리뷰 제목       |      |
| content     | 리뷰 내용       |      |
| images[]    | 이미지 URL 배열 |      |
| nickname    | 닉네임          |      |

### Response

| key       | 설명         | 비고 |
| --------- | ------------ | ---- |
| reviewId  | 리뷰 고유 id |      |
| updatedAt | 수정 일시    |      |

### Example

```json
{
  "message": "리뷰가 성공적으로 수정되었습니다.",
  "reviewId": 501,
  "updatedAt": "2026-04-01T21:00:00Z"
}
```

### Status

| status | 설명           |
| ------ | -------------- |
| 200    | 수정 성공      |
| 400    | 잘못된 요청    |
| 401    | 인증 실패      |
| 403    | 본인 리뷰 아님 |

---

## 상품 리뷰 삭제

본인이 작성한 리뷰를 삭제합니다.

- **Method**: DELETE
- **URL**: `/api/members/me/reviews/:reviewId`
- **사용자**: 유저

### Response

| key      | 설명                | 비고 |
| -------- | ------------------- | ---- |
| reviewId | 삭제된 리뷰 고유 id |      |

### Example

```json
{
  "reviewId": 501,
  "message": "리뷰가 삭제되었습니다."
}
```

### Status

| status | 설명           |
| ------ | -------------- |
| 200    | 삭제 성공      |
| 401    | 인증 실패      |
| 403    | 본인 리뷰 아님 |
| 404    | 해당 리뷰 없음 |
