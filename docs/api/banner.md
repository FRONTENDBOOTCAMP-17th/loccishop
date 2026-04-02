# Banner API

메인 페이지 배너 관련 API입니다.

---

## 목록

| Method | URL         | 설명           |
| ------ | ----------- | -------------- |
| GET    | /api/banner | 배너 목록 조회 |

---

## 배너 목록 조회

메인 페이지 슬라이더에 표시할 배너 목록을 반환합니다. 노출 순서대로 정렬됩니다.

- **Method**: GET
- **URL**: `/api/banner`
- **사용자**: 유저, 관리자

### Request (Query parameter)

| key      | 설명      | 비고                                      |
| -------- | --------- | ----------------------------------------- |
| position | 배너 위치 | `main`, `sub`, `mobile` / default: `main` |

### Response

| key                      | 설명                   | 비고          |
| ------------------------ | ---------------------- | ------------- |
| banners[].id             | 배너 id                |               |
| banners[].imageUrl       | PC 배너 이미지 URL     |               |
| banners[].mobileImageUrl | 모바일 배너 이미지 URL |               |
| banners[].linkUrl        | 클릭 시 이동 URL       |               |
| banners[].title          | 배너 제목              | alt 텍스트용  |
| banners[].description    | 배너 설명              | 접근성용      |
| banners[].order          | 노출 순서              | 오름차순 정렬 |

### Example

```json
{
  "data": {
    "banners": [
      {
        "id": 1,
        "imageUrl": "https://cdn.../banner1.jpg",
        "mobileImageUrl": "https://cdn.../banner1_m.jpg",
        "linkUrl": "/events/spring-sale",
        "title": "봄맞이 최대 40% 할인",
        "description": "봄맞이 할인으로 핸드크림, 바디용품 최대 40% 할인행사 진행. 4월 1일 ~ 4월 30일까지",
        "order": 1
      },
      {
        "id": 2,
        "imageUrl": "https://cdn.../banner2.jpg",
        "mobileImageUrl": null,
        "linkUrl": "/products?category=gift",
        "title": null,
        "description": null,
        "order": 2
      }
    ]
  }
}
```

### Status

| status | 설명        |
| ------ | ----------- |
| 200    | 조회 성공   |
| 400    | 잘못된 요청 |
