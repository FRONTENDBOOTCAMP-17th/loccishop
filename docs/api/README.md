# 📖 API Documentation Index

이 문서는 **LocciShop** 프로젝트의 전체 API 명세를 관리합니다.  
각 카테고리를 클릭하면 해당 도메인의 상세 API 명세 페이지로 이동합니다.

---

## 📁 문서 목록

| 파일                             | 설명                        |
| -------------------------------- | --------------------------- |
| [admin.md](./admin.md)           | 관리자 인증 / 어드민 API    |
| [auth.md](./auth.md)             | 로그인, 회원가입, 토큰 관련 |
| [banner.md](./banner.md)         | 배너 조회 및 관리           |
| [cart.md](./cart.md)             | 장바구니 추가/삭제/조회     |
| [categories.md](./categories.md) | 카테고리 목록 및 구조       |
| [members.md](./members.md)       | 회원 정보 조회/수정         |
| [order.md](./order.md)           | 주문 생성/조회/취소         |
| [products.md](./products.md)     | 상품 목록/상세/검색         |
| [reviews.md](./reviews.md)       | 리뷰 작성/조회/삭제         |
| [wishlist.md](./wishlist.md)     | 위시리스트 추가/삭제        |

---

## 🚀 공통 설정 (Global Setup)

- **Base URL:** `/api/v1`
- **Content-Type:** `application/json`
- **Authentication:** `Authorization: Bearer {accessToken}`
- **공통 응답 구조:**

  성공

  ```json
  {
    "status": 200,
    "message": "success",
    "data": {}
  }
  ```

  실패

  ```json
  {
    "status": 400,
    "message": "에러 메시지",
    "data": null
  }
  ```

---

## ⚠️ 공통 에러 코드

| 코드 | 설명                           |
| ---- | ------------------------------ |
| 400  | 잘못된 요청 (파라미터 오류 등) |
| 401  | 인증 실패 (토큰 없음/만료)     |
| 403  | 권한 없음                      |
| 404  | 리소스를 찾을 수 없음          |
| 500  | 서버 내부 오류                 |

---

## 📝 작성 규칙 (문서 기여자용)

각 API 문서는 아래 형식을 따릅니다.

```md
## API 이름

- Method: GET / POST / PUT / DELETE
- URL: /api/...
- 인증 필요 여부

### Request

### Response

### Example
```

---

_최종 수정일: 2026-04-02_
