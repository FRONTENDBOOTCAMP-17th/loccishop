# LocciShop API 사용 가이드

> FullStackFamily에서 제공하는 LocciShop 프론트엔드 프로젝트용 백엔드 API
> 명세서 리뷰를 반영하여 구현 완료 (2026-04-02)

---

## Base URL

```
https://api.fullstackfamily.com/api/loccishop/v1
```

## 공통 응답 형식

```json
{
  "success": true,
  "message": "성공 메시지",
  "data": { ... },
  "meta": { ... }
}
```

## 인증

JWT 토큰을 `Authorization` 헤더에 포함합니다.

```
Authorization: Bearer {accessToken}
```

---

## API 목록 (47개)

### Auth (4개)

| Method | URL | 인증 | 설명 |
|--------|-----|------|------|
| GET | `/auth/check-id?username=` | X | 아이디 중복 확인 |
| POST | `/auth/signup` | X | 회원가입 |
| POST | `/auth/login` | X | 로그인 |
| POST | `/auth/logout` | O | 로그아웃 |

### Members (4개)

| Method | URL | 인증 | 설명 |
|--------|-----|------|------|
| GET | `/members/me` | O | 내 정보 조회 |
| PUT | `/members/me` | O | 내 정보 수정 |
| PATCH | `/members/me/password` | O | 비밀번호 변경 |
| POST | `/members/me/withdraw` | O | 회원 탈퇴 |

### Categories (1개)

| Method | URL | 인증 | 설명 |
|--------|-----|------|------|
| GET | `/categories` | X | 카테고리 트리 |

### Products (4개)

| Method | URL | 인증 | 설명 |
|--------|-----|------|------|
| GET | `/products?categoryId=&sort=&badge=&page=&limit=` | X | 상품 목록 |
| GET | `/products/{id}` | X | 상품 상세 |
| GET | `/products/{id}/stock` | X | 재고 확인 |
| GET | `/products/{id}/related?limit=` | X | 연관 상품 |

### Cart (4개)

| Method | URL | 인증 | 설명 |
|--------|-----|------|------|
| GET | `/members/me/cart` | O | 장바구니 조회 |
| POST | `/members/me/cart/items` | O | 상품 추가 |
| PUT | `/members/me/cart/items/{cartItemId}` | O | 수량 변경 |
| DELETE | `/members/me/cart/items/{cartItemId}` | O | 상품 삭제 |

### Wishlist (2개)

| Method | URL | 인증 | 설명 |
|--------|-----|------|------|
| GET | `/members/me/wishlist?page=&limit=` | O | 위시리스트 조회 |
| POST | `/members/me/wishlist/{productId}/toggle` | O | 찜 토글 |

### Orders (5개)

| Method | URL | 인증 | 설명 |
|--------|-----|------|------|
| GET | `/members/me/orders` | O | 주문 목록 |
| GET | `/members/me/orders/{orderId}` | O | 주문 상세 |
| POST | `/members/me/orders` | O | 주문 생성 |
| PATCH | `/members/me/orders/{orderId}` | O | 배송지 수정 |
| POST | `/members/me/orders/{orderId}/cancel` | O | 주문 취소 |

### Reviews (4개)

| Method | URL | 인증 | 설명 |
|--------|-----|------|------|
| GET | `/products/{id}/reviews?page=&limit=&sort=` | X | 리뷰 조회 |
| POST | `/products/{id}/reviews` | O | 리뷰 작성 |
| PATCH | `/members/me/reviews/{reviewId}` | O | 리뷰 수정 |
| DELETE | `/members/me/reviews/{reviewId}` | O | 리뷰 삭제 |

### Banners (1개)

| Method | URL | 인증 | 설명 |
|--------|-----|------|------|
| GET | `/banners` | X | 활성 배너 |

### Admin (18개, ADMIN 권한 필요)

| Method | URL | 설명 |
|--------|-----|------|
| POST | `/auth/admin/signup` | 관리자 가입 |
| POST | `/admin/images` | 이미지 업로드 |
| GET | `/admin/members` | 회원 목록 |
| GET | `/admin/members/{id}` | 회원 상세 |
| PATCH | `/admin/members/{id}` | 회원 수정 |
| DELETE | `/admin/members/{id}` | 회원 삭제 |
| GET | `/admin/products` | 상품 목록 |
| POST | `/admin/products` | 상품 등록 |
| PATCH | `/admin/products/{id}` | 상품 수정 |
| DELETE | `/admin/products/{id}` | 상품 삭제 |
| GET | `/admin/orders` | 주문 목록 |
| PATCH | `/admin/orders/{id}/status` | 주문 상태 변경 |
| POST | `/admin/categories` | 카테고리 등록 |
| PATCH | `/admin/categories/{id}` | 카테고리 수정 |
| DELETE | `/admin/categories/{id}` | 카테고리 삭제 |
| POST | `/admin/banners` | 배너 등록 |
| PATCH | `/admin/banners/{id}` | 배너 수정 |
| DELETE | `/admin/banners/{id}` | 배너 삭제 |

---

## 테스트 계정

| username | password | 역할 |
|----------|----------|------|
| testuser | Test1234! | 일반 사용자 |
| shopfan | Shop1234! | 일반 사용자 |
| admin | Admin1234! | 관리자 |

---

## 명세서 리뷰 반영 사항

| # | 원본 문제 | 반영 결과 |
|---|----------|----------|
| 1 | 응답 형식 불일치 | `{success, message, data}` 통일 |
| 2 | DELETE+Body 탈퇴 | `POST /members/me/withdraw` |
| 3 | Base URL 없음 | `/api/loccishop/v1` |
| 4 | confirmPassword | 서버 미수신 (currentPassword + newPassword만) |
| 5 | 로그인 403 | 401로 통일 |
| 6 | 필드명 혼재 | camelCase 통일 (baseAddress, detailAddress) |
| 7 | 페이지네이션 혼재 | page + limit 통일 |
| 8 | sort 한글 | 영문 키 (latest, popular, price_asc, price_desc) |
| 9 | 주문 상태 철자 | CANCELLED 통일 |
| 10 | 상품 ID 타입 | Long auto-increment |
| 11 | 이미지 업로드 미정의 | `POST /admin/images` 추가 |

---

## 주요 API 사용 예시

### 회원가입 + 로그인

```javascript
// 회원가입
const signupRes = await fetch("https://api.fullstackfamily.com/api/loccishop/v1/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: "myuser",
    password: "MyPass1234!",
    name: "홍길동",
    email: "hong@example.com",
    baseAddress: "서울시 강남구",
    detailAddress: "101동 202호"
  })
});

// 로그인
const loginRes = await fetch("https://api.fullstackfamily.com/api/loccishop/v1/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "myuser", password: "MyPass1234!" })
});
const { data } = await loginRes.json();
const token = data.accessToken;
```

### 상품 목록 조회

```javascript
// 전체 상품 (최신순)
const res = await fetch("https://api.fullstackfamily.com/api/loccishop/v1/products?page=1&limit=20");

// 카테고리 필터 + 가격 낮은순
const res = await fetch("https://api.fullstackfamily.com/api/loccishop/v1/products?categoryId=3&sort=price_asc&page=1&limit=20");

// 배지 필터 (NEW 상품만)
const res = await fetch("https://api.fullstackfamily.com/api/loccishop/v1/products?badge=new&page=1&limit=20");
```

### 장바구니

```javascript
// 장바구니 추가
await fetch("https://api.fullstackfamily.com/api/loccishop/v1/members/me/cart/items", {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  body: JSON.stringify({ productId: 1, quantity: 2 })
});

// 장바구니 조회
const cartRes = await fetch("https://api.fullstackfamily.com/api/loccishop/v1/members/me/cart", {
  headers: { Authorization: `Bearer ${token}` }
});
```

### 주문

```javascript
await fetch("https://api.fullstackfamily.com/api/loccishop/v1/members/me/orders", {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  body: JSON.stringify({
    items: [{ productId: 1, quantity: 2 }],
    usedPoint: 0,
    paymentMethod: "card",
    shippingInfo: {
      receiverName: "홍길동",
      phone: "010-1234-5678",
      baseAddress: "서울시 강남구",
      detailAddress: "101동 202호",
      request: "문 앞에 놓아주세요"
    }
  })
});
```

### 관리자 이미지 업로드 + 상품 등록

```javascript
// 1. 이미지 업로드
const formData = new FormData();
formData.append("file", imageFile);
const uploadRes = await fetch("https://api.fullstackfamily.com/api/loccishop/v1/admin/images", {
  method: "POST",
  headers: { Authorization: `Bearer ${adminToken}` },
  body: formData
});
const { data: { imageUrl } } = await uploadRes.json();

// 2. 상품 등록
await fetch("https://api.fullstackfamily.com/api/loccishop/v1/admin/products", {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
  body: JSON.stringify({
    categoryId: 1,
    name: "시어 버터 핸드크림",
    label: "150ml",
    price: 45000,
    discountRate: 10,
    stock: 100,
    badge: "NEW",
    images: { representative: imageUrl, mainSlides: [imageUrl], detailContents: [] }
  })
});
```

---

## API 테스트 결과 (2026-04-02)

| # | API | 결과 |
|---|-----|------|
| 1 | 아이디 중복확인 | PASS (200) |
| 2 | 회원가입 | PASS (201) |
| 3 | 중복 아이디 확인 | PASS (200) |
| 4 | 로그인 | PASS (200) |
| 5 | 로그인 실패 | PASS (401) |
| 6 | 로그아웃 | PASS (200) |
| 7 | 내 정보 조회 | PASS (200) |
| 8 | 내 정보 수정 | PASS (200) |
| 9 | 비밀번호 변경 | PASS (200) |
| 10 | 카테고리 트리 | PASS (200) |
| 11 | 상품 목록 | PASS (200) |
| 12 | 상품 상세 | PASS (200) |
| 13 | 재고 확인 | PASS (200) |
| 14 | 연관 상품 | PASS (200) |
| 15 | 장바구니 추가 | PASS (201) |
| 16 | 장바구니 조회 | PASS (200) |
| 17 | 수량 변경 | PASS (200) |
| 18 | 장바구니 삭제 | PASS (200) |
| 19 | 찜 토글 (추가) | PASS (200) |
| 20 | 위시리스트 조회 | PASS (200) |
| 21 | 찜 토글 (취소) | PASS (200) |
| 22 | 주문 생성 | PASS (201) |
| 23 | 주문 목록 | PASS (200) |
| 24 | 주문 상세 | PASS (200) |
| 25 | 배송지 수정 | PASS (200) |
| 26 | 주문 취소 | PASS (200) |
| 27 | 리뷰 조회 | PASS (200) |
| 28 | 배너 목록 | PASS (200) |
| 29 | 관리자 가입 | PASS (201) |
| 30 | 관리자-회원목록 | PASS (200) |
| 31 | 관리자-상품목록 | PASS (200) |
| 32 | 관리자-주문목록 | PASS (200) |
| 33 | 이미지 업로드 | PASS (201) |
| 34 | 배너 등록 | PASS (201) |
| 35 | 카테고리 등록 | PASS (201) |
| 36 | 회원 탈퇴 | PASS (200) |

**결과: 36/36 PASS**
