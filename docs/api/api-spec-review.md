# LocciShop API 명세서 리뷰

> 리뷰어: FullStackFamily 강사
> 리뷰 일자: 2026-04-02

---

## 총평

전반적으로 잘 작성된 명세서입니다. 도메인별 파일 분리, 요청/응답 테이블, 예시 JSON이 체계적입니다. 아래는 구현 시 문제가 될 수 있는 항목들입니다.

---

## 1. 반드시 수정해야 할 문제 (Critical)

### 1.1 응답 형식 불일치

명세서 전체에서 응답 구조가 **3가지 이상** 혼재합니다.

| 파일 | 응답 형식 | 예시 |
|------|----------|------|
| README.md | `{status, message, data}` | 공통 규약 |
| auth.md (check-id) | `{status: "success", data}` | status가 문자열 |
| auth.md (signup) | `{success: true, message, data}` | success 불린 |
| members.md (조회) | `{id, username, ...}` | data 래퍼 없이 바로 |
| cart.md (조회) | `{items[], shipping, total}` | data 래퍼 없이 바로 |
| order.md (목록) | `{orders[]}` | data 래퍼 없이 바로 |

**문제**: 프론트에서 `res.data.data.xxx`인지 `res.data.xxx`인지 API마다 달라지면 혼란

**수정 제안**: README의 공통 응답 구조 하나로 통일

```json
{ "success": true, "message": "...", "data": { ... } }
```

---

### 1.2 DELETE + Body (회원 탈퇴)

```
DELETE /api/members/me
Body: { "password": "..." }
```

`fetch`로 DELETE 요청에 Body를 보내면 일부 브라우저/환경에서 무시되거나 에러가 발생합니다.

**수정 제안**: `POST /api/members/me/withdraw`로 변경

```javascript
// 문제 있는 코드 (DELETE + Body)
fetch('/api/members/me', {
  method: 'DELETE',
  body: JSON.stringify({ password: '1234' })  // 일부 환경에서 무시됨
});

// 권장하는 코드 (POST)
fetch('/api/members/me/withdraw', {
  method: 'POST',
  body: JSON.stringify({ password: '1234' })
});
```

---

### 1.3 Base URL 불일치

README에는 `Base URL: /api/v1`이라고 했지만, 실제 각 엔드포인트는 `/api/auth/...`, `/api/products/...`로 `/v1`이 없습니다.

**수정 제안**: 둘 중 하나로 통일
- `/api/v1`을 사용하려면: `/api/v1/auth/login`, `/api/v1/products` 등
- `/api`를 사용하려면: README 수정

---

### 1.4 관리자 인증 토큰(adminToken) 하드코딩

```json
{ "adminToken": "SBS_SECRET_2026" }
```

비밀 키가 명세서에 그대로 노출되어 있습니다. 교육용이라 해도 공개 레포 문서에서는 제거하고 별도 전달이 안전합니다.

---

### 1.5 로그인 에러로 아이디 존재 여부 노출

로그인 에러 코드:
- `401` — 아이디 또는 비밀번호 불일치
- `403` — 접근 권한 없는 계정

`403`이 별도로 있으면 "이 아이디는 존재하지만 권한 없음"이라는 정보가 노출됩니다.

**수정 제안**: 보안상 `401` 하나로 통일 — "아이디 또는 비밀번호가 올바르지 않습니다"

---

### 1.6 confirmPassword는 프론트 검증

비밀번호 변경에서 `confirmPassword`를 서버로 보내는 건 불필요합니다. 프론트에서 두 필드 일치 여부를 확인하고, 서버에는 `currentPassword` + `newPassword`만 보내면 됩니다.

---

## 2. 개선하면 좋은 항목 (Important)

### 2.1 상품 ID 타입 혼재

| 위치 | ID 예시 | 타입 |
|------|---------|------|
| products.md 목록 | `101` | number |
| products.md 상세 | `"01MA150K26"` | string (SKU) |
| cart.md | `101` | number |
| admin products | `"01MA150K26"` | string |

**문제**: 상품 ID가 숫자인지 문자열(SKU 코드)인지 통일하지 않으면 프론트에서 타입 에러 발생

**수정 제안**: 서버 auto-increment ID(숫자)를 사용하되, SKU 코드는 별도 필드로 분리

---

### 2.2 필드 네이밍 컨벤션 혼재

| 스타일 | 예시 | 위치 |
|--------|------|------|
| snake_case | `base_address`, `detail_address` | members, order |
| camelCase | `currentPassword`, `newPassword` | members |
| camelCase | `cartItemId`, `totalItems` | cart |

**수정 제안**: JSON은 **camelCase**로 통일 → `baseAddress`, `detailAddress`

---

### 2.3 페이지네이션 파라미터 혼재

| 파일 | 파라미터 |
|------|---------|
| products.md | `page`, `limit` |
| reviews.md | `page`, `size` |
| wishlist.md | `page`, `limit` |
| admin/orders | `page`, `limit` |

**수정 제안**: `page` + `limit`으로 통일 (reviews.md의 `size` → `limit`)

---

### 2.4 sort 파라미터가 한글

```
sort: 최신순, 인기순, 가격순
```

API 쿼리파라미터에 한글은 URL 인코딩이 필요하여 불편합니다.

**수정 제안**: 영문 키 사용
```
sort: latest, popular, price_asc, price_desc
```

---

### 2.5 주문 상태 철자 불일치

| 위치 | 값 |
|------|-----|
| order.md 주문 상태 | `CANCELLED` |
| order.md 취소 응답 | `CANCELED` |
| admin.md 상태 변경 | `CANCELLED` |

**수정 제안**: 하나로 통일 (`CANCELLED` 또는 `CANCELED`)

---

### 2.6 이미지 업로드 방식 미정의

상품 등록(admin)에서 "이미지는 이미지 업로드 API로 먼저 URL을 받아 전달합니다"라고 되어 있으나, **이미지 업로드 API 자체가 명세서에 없습니다.**

**수정 제안**: 이미지 업로드 API 명세를 추가하거나, 구현 시 별도 제공 예정임을 명시

---

## 3. 사소한 문제 (Minor)

### 3.1 장바구니 삭제 URL 불일치

| API | URL |
|-----|-----|
| 장바구니 추가 | `/api/members/me/cart/items` |
| 장바구니 수정 | `/api/members/me/cart/items/:cartItemId` |
| 장바구니 삭제 | `/api/members/me/cart/:cartItemId` |

삭제만 `/items/`가 빠져 있습니다.

**수정 제안**: `/api/members/me/cart/items/:cartItemId`로 통일

### 3.2 카테고리 등록 성공 코드

카테고리 등록 성공이 `200`으로 되어 있으나, 리소스 생성은 `201`이 REST 관례입니다.

### 3.3 리뷰 조회에 pagination 없음

상품 리뷰 조회에 `page`, `size` 파라미터가 있지만 응답에 pagination 메타 정보(totalCount, totalPages 등)가 없습니다. 프론트에서 더보기/페이지네이션 구현이 어렵습니다.

---

## 4. 수정 요약표

| # | 우선순위 | 항목 | 현재 | 수정 제안 |
|---|---------|------|------|----------|
| 1 | Critical | 응답 형식 불일치 | 3가지 이상 혼재 | `{success, message, data}` 통일 |
| 2 | Critical | DELETE + Body | `DELETE /members/me` | `POST /members/me/withdraw` |
| 3 | Critical | Base URL 불일치 | `/api/v1` vs `/api` | 하나로 통일 |
| 4 | Critical | adminToken 노출 | 문서에 하드코딩 | 별도 전달 |
| 5 | Critical | 로그인 403 | 계정 존재 노출 | 401로 통일 |
| 6 | Critical | confirmPassword | 서버로 전송 | 프론트 검증만 |
| 7 | Important | 상품 ID 타입 | number/string 혼재 | 하나로 통일 |
| 8 | Important | 필드 네이밍 | snake/camel 혼재 | camelCase 통일 |
| 9 | Important | 페이지네이션 | limit/size 혼재 | limit로 통일 |
| 10 | Important | sort 한글 | `최신순` | `latest` 영문 키 |
| 11 | Important | 주문 상태 철자 | CANCELLED/CANCELED | 하나로 통일 |
| 12 | Important | 이미지 업로드 | 미정의 | 별도 API 명세 추가 |
| 13 | Minor | 장바구니 삭제 URL | `/cart/:id` | `/cart/items/:id` 통일 |
| 14 | Minor | 카테고리 등록 코드 | 200 | 201 |
| 15 | Minor | 리뷰 pagination | 없음 | totalCount, totalPages 추가 |
