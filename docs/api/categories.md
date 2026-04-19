# Categories API

카테고리 목록 조회 관련 API입니다.

---

## 목록

| Method | URL             | 설명                    |
| ------ | --------------- | ----------------------- |
| GET    | /api/categories | 카테고리 전체 목록 조회 |

---

## 카테고리 전체 목록 조회

대카테고리와 소카테고리를 트리 구조로 반환합니다.

- **Method**: GET
- **URL**: `/api/categories`
- **사용자**: 유저, 관리자

### Response

| key      | 설명             | 비고                |
| -------- | ---------------- | ------------------- |
| id       | 카테고리 고유 id |                     |
| name     | 카테고리 이름    |                     |
| slug     | URL 영문 식별자  |                     |
| imageUrl | 대표 이미지 URL  |                     |
| children | 소카테고리 배열  | 없으면 빈 배열 `[]` |

### Example

```json
{
  "data": [
    {
      "id": 1,
      "name": "스킨케어",
      "slug": "skincare",
      "imageUrl": "https://cdn.../skincare.jpg",
      "children": [
        {
          "id": 11,
          "name": "크림",
          "slug": "cream",
          "imageUrl": null,
          "children": []
        },
        {
          "id": 12,
          "name": "토너",
          "slug": "toner",
          "imageUrl": null,
          "children": []
        }
      ]
    },
    {
      "id": 2,
      "name": "바디케어",
      "slug": "bodycare",
      "imageUrl": "https://cdn.../bodycare.jpg",
      "children": []
    }
  ]
}
```

### Status

| status | 설명        |
| ------ | ----------- |
| 200    | 조회 성공   |
| 400    | 잘못된 요청 |
