# Reviews API

상품 리뷰 조회, 작성, 수정, 삭제 관련 API입니다.

> 리뷰 작성/수정/삭제는 `Authorization: Bearer {token}` 헤더가 필요합니다.

---

## 목록

| Method | URL                               | 설명           |
| ------ | --------------------------------- | -------------- |
| GET    | /api/products/:id/reviews         | 상품 리뷰 조회 |
| POST   | /api/products/:id/reviews         | 상품 리뷰 작성 |
| PATCH  | /api/members/me/reviews/:reviewId | 상품 리뷰 수정 |
| DELETE | /api/members/me/reviews/:reviewId | 상품 리뷰 삭제 |

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

| key                      | 설명                 | 비고                       |
| ------------------------ | -------------------- | -------------------------- |
| reviews[].id             | 리뷰 고유 번호       |                            |
| reviews[].title          | 리뷰 제목            |                            |
| reviews[].content        | 리뷰 본문            |                            |
| reviews[].rating         | 별점                 |                            |
| reviews[].author         | 작성자 이름          |                            |
| reviews[].createdAt      | 작성일               |                            |
| reviews[].reviewImages[] | 리뷰 이미지 URL 배열 | 텍스트 리뷰면 빈 배열 `[]` |
| reviews[].recommendCount | 추천 수              |                            |

### Example

```json
{
  "reviews": [
    {
      "id": 101,
      "title": "핸드크림계 국밥",
      "content": "코코넛 향에 하드한 핸드크림. 보습력이 매우 우수함...",
      "rating": 5,
      "author": "Jay",
      "createdAt": "2025-06-01",
      "reviewImages": ["https://cdn.../thumb.jpg"],
      "recommendCount": 12
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
