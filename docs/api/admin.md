# Admin API

관리자 전용 API입니다. 모든 요청에 관리자 권한 토큰이 필요합니다.

> 모든 요청에 `Authorization: Bearer {admin_token}` 헤더가 필요합니다.

---

## 목록

### 인증

| Method | URL                    | 설명            |
| ------ | ---------------------- | --------------- |
| POST   | /api/auth/admin/signup | 관리자 회원가입 |

### 회원 관리

| Method | URL                          | 설명                |
| ------ | ---------------------------- | ------------------- |
| GET    | /api/admin/members           | 전체 회원 목록 조회 |
| GET    | /api/admin/members/:memberId | 회원 상세 정보 조회 |
| PATCH  | /api/admin/members/:memberId | 회원 정보 수정      |
| DELETE | /api/admin/members/:memberId | 회원 삭제           |

### 상품 관리

| Method | URL                     | 설명           |
| ------ | ----------------------- | -------------- |
| GET    | /api/admin/products     | 상품 목록 조회 |
| POST   | /api/admin/products     | 상품 등록      |
| PATCH  | /api/admin/products/:id | 상품 수정      |
| DELETE | /api/admin/products/:id | 상품 삭제      |

### 주문 관리

| Method | URL                          | 설명           |
| ------ | ---------------------------- | -------------- |
| GET    | /api/admin/orders            | 주문 목록 조회 |
| PATCH  | /api/admin/orders/:id/status | 주문 상태 변경 |

### 카테고리 관리

| Method | URL                       | 설명          |
| ------ | ------------------------- | ------------- |
| POST   | /api/admin/categories     | 카테고리 등록 |
| PATCH  | /api/admin/categories/:id | 카테고리 수정 |
| DELETE | /api/admin/categories/:id | 카테고리 삭제 |

### 배너 관리

| Method | URL                    | 설명      |
| ------ | ---------------------- | --------- |
| POST   | /api/admin/banners     | 배너 등록 |
| PATCH  | /api/admin/banners/:id | 배너 수정 |
| DELETE | /api/admin/banners/:id | 배너 삭제 |

---

## 인증

### 관리자 회원가입

새 관리자 계정을 생성합니다.

- **Method**: POST
- **URL**: `/api/auth/admin/signup`
- **사용자**: 관리자

### Request

| key        | 설명           | 비고                                    |
| ---------- | -------------- | --------------------------------------- |
| username   | 관리자 아이디  |                                         |
| password   | 비밀번호       | 영문+숫자+특수문자 포함 8자 이상        |
| name       | 관리자 이름    |                                         |
| email      | 이메일         |                                         |
| adminToken | 관리자 인증 키 | `SBS_SECRET_2026` 일치할 때만 가입 가능 |

### Response

| key       | 설명          | 비고         |
| --------- | ------------- | ------------ |
| username  | 관리자 아이디 |              |
| createdAt | 가입 일시     |              |
| role      | 권한          | `admin` 고정 |

### Example

```json
{
  "success": true,
  "message": "관리자 계정이 생성되었습니다.",
  "data": {
    "username": "hong123",
    "createdAt": "2025-03-15T09:30:00Z",
    "role": "admin"
  }
}
```

### Status

| status | 설명                               |
| ------ | ---------------------------------- |
| 201    | 회원가입 완료                      |
| 400    | 필수 입력 항목 오류                |
| 403    | 가입 권한 없음 (adminToken 불일치) |

---

## 회원 관리

### 전체 회원 목록 조회

가입일순, 이름순 정렬 및 페이징을 지원합니다.

- **Method**: GET
- **URL**: `/api/admin/members`
- **사용자**: 관리자

### Request (Query parameter)

| key       | 설명        | 비고 |
| --------- | ----------- | ---- |
| keyword   | 검색 키워드 |      |
| status    | 회원 상태   |      |
| createdAt | 가입일      |      |
| page      | 페이지 번호 |      |

### Response

| key                 | 설명         | 비고            |
| ------------------- | ------------ | --------------- |
| totalMembers        | 전체 회원 수 |                 |
| members[].memberId  | 회원 id      |                 |
| members[].name      | 회원 이름    |                 |
| members[].createdAt | 가입일       |                 |
| members[].status    | 회원 상태    |                 |
| members[].grade     | 회원 등급    |                 |
| members[].point     | 보유 포인트  |                 |
| members[].role      | 회원 구분    | `user`, `admin` |

### Example

```json
{
  "status": "success",
  "data": {
    "totalMembers": 150,
    "members": [
      {
        "memberId": 12,
        "name": "홍길동",
        "createdAt": "2026-03-20",
        "status": "ACTIVE",
        "grade": "SILVER",
        "point": 5300,
        "role": "admin"
      }
    ]
  }
}
```

### Status

| status | 설명           |
| ------ | -------------- |
| 200    | 조회 성공      |
| 404    | 회원 목록 없음 |

---

### 회원 상세 정보 조회

특정 회원의 주문 내역, 가입 정보 등을 반환합니다.

- **Method**: GET
- **URL**: `/api/admin/members/:memberId`
- **사용자**: 관리자

### Response

| key            | 설명           | 비고            |
| -------------- | -------------- | --------------- |
| id             | 회원 고유 번호 |                 |
| username       | 회원 아이디    |                 |
| name           | 회원 이름      |                 |
| email          | 이메일         |                 |
| base_address   | 기본주소       |                 |
| detail_address | 상세주소       |                 |
| grade          | 회원 등급      |                 |
| point          | 보유 포인트    |                 |
| role           | 회원 구분      | `user`, `admin` |
| status         | 회원 상태      |                 |
| createdAt      | 가입일         |                 |

### Example

```json
{
  "status": "success",
  "data": {
    "id": 1042,
    "username": "hong123",
    "name": "홍길동",
    "email": "user@example.com",
    "address": {
      "base": "서울시 00로 123",
      "detail": "00아파트 111동 111호"
    },
    "grade": "SILVER",
    "point": 3200,
    "role": "admin",
    "status": "ACTIVE",
    "createdAt": "2025-01-10T08:00:00Z"
  }
}
```

### Status

| status | 설명           |
| ------ | -------------- |
| 200    | 조회 성공      |
| 404    | 해당 회원 없음 |

---

### 회원 정보 수정

포인트, 등급, 상태 등을 수정합니다.

- **Method**: PATCH
- **URL**: `/api/admin/members/:memberId`
- **사용자**: 관리자

### Request

| key            | 설명        | 비고      |
| -------------- | ----------- | --------- |
| name           | 이름        |           |
| base_address   | 기본주소    |           |
| detail_address | 상세주소    |           |
| grade          | 등급        |           |
| point          | 보유 포인트 | 증감/차감 |
| status         | 회원 상태   |           |

### Response

| key           | 설명             | 비고 |
| ------------- | ---------------- | ---- |
| id            | 회원 고유 번호   |      |
| username      | 회원 아이디      |      |
| updatedFields | 수정된 항목 목록 |      |
| updatedAt     | 수정일시         |      |

### Example

```json
{
  "status": "success",
  "message": "회원 정보가 성공적으로 업데이트되었습니다.",
  "data": {
    "id": 1042,
    "username": "hong123",
    "updatedFields": ["grade", "point", "status"],
    "updatedAt": "2026-04-01T23:15:00Z"
  }
}
```

### Status

| status | 설명             |
| ------ | ---------------- |
| 200    | 수정 성공        |
| 400    | 요청 값 오류     |
| 403    | 관리자 권한 없음 |
| 404    | 해당 회원 없음   |

---

### 회원 삭제

관리자 권한으로 계정을 삭제합니다.

- **Method**: DELETE
- **URL**: `/api/admin/members/:memberId`
- **사용자**: 관리자

### Response

| key       | 설명           | 비고 |
| --------- | -------------- | ---- |
| id        | 회원 고유 번호 |      |
| username  | 회원 아이디    |      |
| deletedAt | 삭제 일시      |      |

### Example

```json
{
  "status": "success",
  "message": "해당 회원이 성공적으로 탈퇴 처리되었습니다.",
  "data": {
    "id": 1042,
    "username": "hong123",
    "deletedAt": "2026-04-01T23:30:00Z"
  }
}
```

### Status

| status | 설명           |
| ------ | -------------- |
| 200    | 삭제 성공      |
| 403    | 권한 없음      |
| 404    | 해당 회원 없음 |

---

## 상품 관리

### 상품 목록 조회

관리자 페이지용 상품 목록입니다. 숨김 처리된 상품도 포함하여 반환합니다.

- **Method**: GET
- **URL**: `/api/admin/products`
- **사용자**: 관리자

### Request (Query parameter)

| key        | 설명             | 비고 |
| ---------- | ---------------- | ---- |
| page       | 페이지 번호      |      |
| limit      | 페이지당 상품 수 |      |
| categoryId | 카테고리         |      |
| isVisible  | 노출 여부        |      |
| keyword    | 상품명 검색어    |      |
| stock      | 재고             |      |

### Response

| key                      | 설명           | 비고 |
| ------------------------ | -------------- | ---- |
| products[].id            | 상품 id        |      |
| products[].name          | 상품명         |      |
| products[].price         | 정상가         |      |
| products[].discountPrice | 할인가         |      |
| products[].discountRate  | 할인율         |      |
| products[].stock         | 총 재고 수량   |      |
| products[].isVisible     | 노출 여부      |      |
| products[].salesCount    | 누적 판매수    |      |
| products[].createdAt     | 등록일         |      |
| pagination.total         | 전체 상품 수   |      |
| pagination.totalPages    | 전체 페이지 수 |      |
| pagination.currentPage   | 현재 페이지    |      |

### Example

```json
{
  "data": {
    "products": [
      {
        "id": 301,
        "name": "시어 버터 핸드크림 75ml",
        "price": 28000,
        "discountPrice": 25200,
        "discountRate": 10,
        "stock": 150,
        "isVisible": true,
        "salesCount": 3400,
        "createdAt": "2024-06-01T09:00:00Z"
      }
    ],
    "pagination": {
      "total": 340,
      "totalPages": 12,
      "currentPage": 1
    }
  }
}
```

### Status

| status | 설명             |
| ------ | ---------------- |
| 200    | 조회 성공        |
| 404    | 등록된 상품 없음 |

---

### 상품 등록

새 상품을 등록합니다. 이미지는 이미지 업로드 API로 먼저 URL을 받아 전달합니다.

- **Method**: POST
- **URL**: `/api/admin/products`
- **사용자**: 관리자

### Request

| key              | 설명             | 비고                                                                |
| ---------------- | ---------------- | ------------------------------------------------------------------- |
| groupId          | 그룹 id          | 옵션 상품 묶기용                                                    |
| categoryId       | 카테고리 id      |                                                                     |
| name             | 상품명           |                                                                     |
| label            | 개별 옵션 명칭   |                                                                     |
| badge            | 상품 특징        | `new`, `best` 등                                                    |
| shortDescription | 간단 설명        |                                                                     |
| description      | 상세 설명        |                                                                     |
| price            | 정상가           |                                                                     |
| discountRate     | 할인율           | 입력 시 `discountPrice` 자동 계산                                   |
| stock            | 재고 수량        |                                                                     |
| images           | 이미지 객체 배열 | `representative`, `mainSlides[]`, `detailContents[]`                |
| productInfo      | 상품 정보        | `howToUse`, `ingredients`, `productDisclosure`                      |
| status           | 판매 상태        | `READY`(default), `ON_SALE`, `OUT_OF_STOCK`, `DISCONTINUED`, `HIDE` |

### Response

| key           | 설명            | 비고                             |
| ------------- | --------------- | -------------------------------- |
| id            | 상품 고유 번호  | 서버 자동 생성                   |
| groupId       | 그룹 식별 id    |                                  |
| name          | 상품명          |                                  |
| label         | 개별 옵션 명칭  |                                  |
| url           | 상세페이지 경로 |                                  |
| discountPrice | 할인가          | `price * (1 - discountRate/100)` |
| createdAt     | 생성 일시       |                                  |

### Example

```json
{
  "status": "success",
  "message": "상품이 성공적으로 등록되었습니다.",
  "data": {
    "id": "01MA150K26",
    "groupId": "SHEA-HAND-LINE",
    "name": "시어 버터 핸드 크림",
    "label": "150 ml",
    "url": "/product/detail/01MA150K26",
    "discountPrice": 18000,
    "createdAt": "2026-04-01T12:00:00Z"
  }
}
```

### Status

| status | 설명           |
| ------ | -------------- |
| 201    | 등록 성공      |
| 400    | 필수 정보 누락 |
| 401    | 인증 실패      |
| 403    | 권한 없음      |

---

### 상품 수정

상품 정보를 수정합니다.

- **Method**: PATCH
- **URL**: `/api/admin/products/:id`
- **사용자**: 관리자

### Request

| key          | 설명        | 비고                                                       |
| ------------ | ----------- | ---------------------------------------------------------- |
| name         | 상품명      |                                                            |
| label        | 옵션 명칭   |                                                            |
| price        | 정상가      |                                                            |
| discountRate | 할인율      |                                                            |
| stock        | 재고        |                                                            |
| images       | 이미지 객체 |                                                            |
| status       | 판매 상태   | `READY`, `ON_SALE`, `OUT_OF_STOCK`, `DISCONTINUED`, `HIDE` |

### Status

| status | 설명           |
| ------ | -------------- |
| 200    | 수정 성공      |
| 400    | 입력 값 오류   |
| 403    | 권한 없음      |
| 404    | 해당 상품 없음 |

---

### 상품 삭제

상품을 삭제합니다.

- **Method**: DELETE
- **URL**: `/api/admin/products/:id`
- **사용자**: 관리자

### Response

| key       | 설명     | 비고 |
| --------- | -------- | ---- |
| id        | 상품 id  |      |
| deletedAt | 삭제일시 |      |

### Example

```json
{
  "status": "success",
  "message": "해당 상품이 삭제되었습니다.",
  "data": {
    "id": "01MA150K26",
    "deletedAt": "2026-04-01T15:30:00Z"
  }
}
```

### Status

| status | 설명           |
| ------ | -------------- |
| 200    | 삭제 성공      |
| 403    | 권한 없음      |
| 404    | 해당 상품 없음 |

---

## 주문 관리

### 주문 목록 조회

전체 주문을 상태, 날짜, 검색어로 필터링하여 조회합니다.

- **Method**: GET
- **URL**: `/api/admin/orders`
- **사용자**: 관리자

### Request (Query parameter)

| key       | 설명        | 비고                                         |
| --------- | ----------- | -------------------------------------------- |
| status    | 주문 상태   | `PAID`, `SHIPPING`, `DELIVERED`, `CANCELLED` |
| startDate | 조회 시작일 | `yyyy-mm-dd`                                 |
| endDate   | 조회 종료일 | `yyyy-mm-dd`                                 |
| keyword   | 검색 키워드 | 주문번호 / 회원 이름 / 송장번호              |
| page      | 페이지 번호 |                                              |
| limit     | 페이지당 수 | default: `20`                                |

### Response

| key                     | 설명              | 비고 |
| ----------------------- | ----------------- | ---- |
| orders[].orderId        | 주문 id           |      |
| orders[].orderNumber    | 주문 번호         |      |
| orders[].memberName     | 주문 회원 이름    |      |
| orders[].trackingNumber | 송장 번호         |      |
| orders[].totalAmount    | 결제 금액         |      |
| orders[].status         | 주문 상태         |      |
| orders[].itemCount      | 주문 상품 종류 수 |      |
| orders[].createdAt      | 주문 일시         |      |
| pagination.total        | 전체 주문 수      |      |
| pagination.totalPages   | 전체 페이지 수    |      |
| pagination.currentPage  | 현재 페이지       |      |

### Example

```json
{
  "data": {
    "orders": [
      {
        "orderId": 8801,
        "orderNumber": "ORD-20250315-001042",
        "memberName": "홍길동",
        "trackingNumber": "155425869",
        "totalAmount": 55800,
        "status": "SHIPPING",
        "itemCount": 2,
        "createdAt": "2025-03-15T09:30:00Z"
      }
    ],
    "pagination": {
      "total": 1520,
      "totalPages": 51,
      "currentPage": 1
    }
  }
}
```

### Status

| status | 설명        |
| ------ | ----------- |
| 200    | 조회 성공   |
| 400    | 잘못된 요청 |

---

### 주문 상태 변경

주문 상태를 수동으로 변경합니다.

- **Method**: PATCH
- **URL**: `/api/admin/orders/:id/status`
- **사용자**: 관리자

### Request

| key    | 설명             | 비고                                         |
| ------ | ---------------- | -------------------------------------------- |
| status | 변경할 주문 상태 | `PAID`, `PREPARING`, `SHIPPING`, `DELIVERED` |

### Response

| key       | 설명             | 비고 |
| --------- | ---------------- | ---- |
| orderId   | 주문 id          |      |
| status    | 변경된 주문 상태 |      |
| updatedAt | 수정 일시        |      |

### Example

```json
{
  "success": true,
  "data": {
    "orderId": 8801,
    "status": "SHIPPING",
    "updatedAt": "2025-03-16T10:00:00Z"
  }
}
```

### Status

| status | 설명        |
| ------ | ----------- |
| 200    | 변경 성공   |
| 400    | 잘못된 요청 |

---

## 카테고리 관리

### 카테고리 등록

새 카테고리를 등록합니다.

- **Method**: POST
- **URL**: `/api/admin/categories`
- **사용자**: 관리자

### Request

| key      | 설명             | 비고                 |
| -------- | ---------------- | -------------------- |
| name     | 카테고리 명칭    |                      |
| slug     | URL 영문 식별자  |                      |
| imageUrl | 대표 이미지 URL  |                      |
| parentId | 상위 카테고리 id | 대분류일 경우 `null` |

### Response

| key       | 설명            | 비고 |
| --------- | --------------- | ---- |
| id        | 카테고리 id     |      |
| name      | 카테고리 이름   |      |
| slug      | URL 영문 식별자 |      |
| createdAt | 생성 일자       |      |

### Example

```json
{
  "status": "success",
  "data": {
    "id": 3,
    "name": "스킨케어",
    "slug": "skincare",
    "createdAt": "2026-04-01T23:58:00Z"
  }
}
```

### Status

| status | 설명        |
| ------ | ----------- |
| 200    | 등록 성공   |
| 400    | 잘못된 요청 |

---

### 카테고리 수정

카테고리 정보를 수정합니다.

- **Method**: PATCH
- **URL**: `/api/admin/categories/:id`
- **사용자**: 관리자

### Request

| key      | 설명             | 비고                 |
| -------- | ---------------- | -------------------- |
| name     | 카테고리 명칭    |                      |
| slug     | URL 영문 식별자  |                      |
| imageUrl | 대표 이미지 URL  |                      |
| parentId | 상위 카테고리 id | 대분류일 경우 `null` |

### Response

| key           | 설명             | 비고 |
| ------------- | ---------------- | ---- |
| id            | 카테고리 id      |      |
| updatedFields | 수정된 항목 목록 |      |
| updatedAt     | 수정 일자        |      |

### Example

```json
{
  "status": "success",
  "message": "카테고리 정보가 수정되었습니다.",
  "data": {
    "id": 1,
    "updatedFields": ["name", "slug"],
    "updatedAt": "2026-04-02T00:05:00Z"
  }
}
```

### Status

| status | 설명        |
| ------ | ----------- |
| 200    | 수정 성공   |
| 400    | 잘못된 요청 |

---

### 카테고리 삭제

카테고리를 삭제합니다.

- **Method**: DELETE
- **URL**: `/api/admin/categories/:id`
- **사용자**: 관리자

### Response

| key | 설명        | 비고 |
| --- | ----------- | ---- |
| id  | 카테고리 id |      |

### Example

```json
{
  "status": "success",
  "message": "카테고리가 삭제되었습니다.",
  "data": {
    "id": 1
  }
}
```

### Status

| status | 설명        |
| ------ | ----------- |
| 200    | 삭제 성공   |
| 400    | 잘못된 요청 |

---

## 배너 관리

### 배너 등록

이미지, 연결 링크, 노출 순서 등을 설정하여 배너를 등록합니다.

- **Method**: POST
- **URL**: `/api/admin/banners`
- **사용자**: 관리자

### Request

| key            | 설명                    | 비고 |
| -------------- | ----------------------- | ---- |
| title          | 배너 제목               |      |
| description    | 배너 설명               |      |
| imageUrl       | PC 배너 이미지 경로     |      |
| mobileImageUrl | 모바일 배너 이미지 경로 |      |
| linkUrl        | 이동 URL                |      |
| order          | 노출 순서               |      |
| isActive       | 활성화 여부             |      |

### Response

| key       | 설명      | 비고 |
| --------- | --------- | ---- |
| id        | 배너 id   |      |
| title     | 배너 제목 |      |
| createdAt | 생성일    |      |

### Example

```json
{
  "status": "success",
  "message": "새로운 배너가 성공적으로 등록되었습니다.",
  "data": {
    "id": 5,
    "title": "4월 봄 맞이 에디션",
    "createdAt": "2026-04-01T23:45:00Z"
  }
}
```

### Status

| status | 설명        |
| ------ | ----------- |
| 200    | 등록 성공   |
| 400    | 잘못된 요청 |

---

### 배너 수정

활성화 여부, 이미지 교체 등을 수정합니다.

- **Method**: PATCH
- **URL**: `/api/admin/banners/:id`
- **사용자**: 관리자

### Request

| key            | 설명                    | 비고 |
| -------------- | ----------------------- | ---- |
| title          | 배너 제목               |      |
| description    | 배너 설명               |      |
| imageUrl       | PC 배너 이미지 경로     |      |
| mobileImageUrl | 모바일 배너 이미지 경로 |      |
| linkUrl        | 이동 URL                |      |
| order          | 노출 순서               |      |
| isActive       | 활성화 여부             |      |

### Response

| key           | 설명             | 비고 |
| ------------- | ---------------- | ---- |
| id            | 배너 id          |      |
| updatedFields | 수정된 항목 목록 |      |
| updatedAt     | 수정 일시        |      |

### Example

```json
{
  "status": "success",
  "message": "배너 정보가 성공적으로 수정되었습니다.",
  "data": {
    "id": 5,
    "updatedFields": ["order", "isActive", "mobileImageUrl"],
    "updatedAt": "2026-04-01T23:50:12Z"
  }
}
```

### Status

| status | 설명        |
| ------ | ----------- |
| 200    | 수정 성공   |
| 400    | 잘못된 요청 |

---

### 배너 삭제

배너를 삭제합니다.

- **Method**: DELETE
- **URL**: `/api/admin/banners/:id`
- **사용자**: 관리자

### Response

| key | 설명    | 비고 |
| --- | ------- | ---- |
| id  | 배너 id |      |

### Example

```json
{
  "status": "success",
  "message": "해당 배너(ID: 5)가 영구적으로 삭제되었습니다.",
  "data": {
    "id": 5
  }
}
```

### Status

| status | 설명        |
| ------ | ----------- |
| 200    | 삭제 성공   |
| 400    | 잘못된 요청 |
