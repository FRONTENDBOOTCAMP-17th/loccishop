# 관리자 회원 관리 API 500 에러 트러블슈팅

## 문제 현상

아래 엔드포인트 호출 시 `500 Internal Server Error`가 반환되어 조회/수정/삭제가 동작하지 않는다는 문의가 있었습니다.

- `GET /api/loccishop/v1/admin/members/:id`
- `PATCH /api/loccishop/v1/admin/members/:id`
- `DELETE /api/loccishop/v1/admin/members/:id`

**받았던 응답:**

```json
{
  "success": false,
  "message": "서버 내부 오류가 발생했습니다.",
  "error": { "code": "INTERNAL_ERROR" }
}
```

---

## 원인 분석

서버 로그의 스택 트레이스에서 다음 예외를 발견했습니다.

```
org.springframework.web.method.annotation.MethodArgumentTypeMismatchException:
  Failed to convert value of type 'java.lang.String' to required type 'java.lang.Long';
  For input string: "testuser"
```

즉, **URL 경로 파라미터(`:id`) 자리에 숫자 ID가 아닌 username 문자열(`"testuser"`, `"yuna"` 등)이 들어왔습니다.**

컨트롤러의 시그니처는 다음과 같습니다.

```java
@GetMapping("/api/loccishop/v1/admin/members/{id}")
public ... getMemberDetail(@PathVariable Long id, ...) { ... }
```

`@PathVariable Long id`는 숫자 타입만 허용합니다. 호출 URL이 `/admin/members/testuser`이면 Spring MVC가 "testuser"를 `Long`으로 변환하려다 실패하면서 위 예외를 던집니다.

### 왜 500이 나왔는가 (서버 측 결함)

본래 이 예외는 클라이언트 요청 형식 오류이므로 **400 Bad Request**로 내려와야 합니다. 그런데 `LcsExceptionHandler`가 `MethodArgumentTypeMismatchException`을 명시적으로 처리하지 않고 있어서, catch-all인 `@ExceptionHandler(Exception.class)`에 걸려 **500 INTERNAL_ERROR**로 응답되었습니다.

결과적으로:
- **클라이언트 측**: 문자열을 숫자 path에 넣은 요청 실수
- **서버 측**: 그 실수를 400이 아닌 500으로 돌려준 결함

두 가지가 겹쳐 혼란을 증폭시켰습니다.

---

## 해결 내용 (백엔드 수정)

`LcsExceptionHandler`에 전용 핸들러를 추가하여 타입 불일치 시 **400 Bad Request + 명확한 메시지**를 반환하도록 수정했습니다.

```java
@ExceptionHandler(MethodArgumentTypeMismatchException.class)
public ResponseEntity<LcsErrorResponse> handleTypeMismatch(
        MethodArgumentTypeMismatchException e) {
    String message = String.format(
        "경로/요청 파라미터 '%s'는 %s 타입이어야 합니다. 입력값: '%s'",
        e.getName(),
        e.getRequiredType() != null ? e.getRequiredType().getSimpleName() : "올바른 타입",
        e.getValue());
    return ResponseEntity.badRequest()
        .body(LcsErrorResponse.of(message, "VALIDATION_ERROR"));
}
```

---

## 수정 후 응답 (실서버 검증)

### GET /admin/members/testuser (잘못된 호출)

```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "https://api.fullstackfamily.com/api/loccishop/v1/admin/members/testuser"
```

```
HTTP 400
{
  "success": false,
  "message": "경로/요청 파라미터 'id'는 Long 타입이어야 합니다. 입력값: 'testuser'",
  "error": { "code": "VALIDATION_ERROR" }
}
```

### GET /admin/members/1 (올바른 호출)

```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "https://api.fullstackfamily.com/api/loccishop/v1/admin/members/1"
```

```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "testuser",
    "name": "테스트유저",
    "email": "test@loccishop.com",
    "grade": "GOLD",
    "point": 5400,
    "role": "USER",
    "status": "ACTIVE",
    "createdAt": "2026-04-02T15:26:36.777327"
  }
}
```

| 엔드포인트 | 수정 전 | 수정 후 |
| ---------- | ------- | ------- |
| `GET /admin/members/testuser` | 500 INTERNAL_ERROR | 400 VALIDATION_ERROR |
| `PATCH /admin/members/yuna` | 500 INTERNAL_ERROR | 400 VALIDATION_ERROR |
| `DELETE /admin/members/shopfan` | 500 INTERNAL_ERROR | 400 VALIDATION_ERROR |
| `GET /admin/members/1` | 200 (정상) | 200 (정상) |
| `PATCH /admin/members/15` | 200 (정상) | 200 (정상) |
| `DELETE /admin/members/15` | 200 (정상) | 200 (정상) |

---

## 올바른 사용법

### `:id`는 반드시 숫자 memberId

URL 경로의 `:id`는 **Long 타입 숫자**입니다. 회원의 `memberId`를 그대로 사용하세요. `username`(아이디 문자열)은 넣을 수 없습니다.

```
# ❌ 잘못된 예
GET /api/loccishop/v1/admin/members/testuser
GET /api/loccishop/v1/admin/members/yuna

# ✅ 올바른 예
GET /api/loccishop/v1/admin/members/1
GET /api/loccishop/v1/admin/members/15
```

### memberId는 어디서 얻나요?

1. **회원가입/로그인 응답**: `data.memberId` 또는 `data.member.id`
2. **회원 목록 조회**: `GET /api/loccishop/v1/admin/members` 응답의 `members[].memberId`
3. **회원 상세 조회 결과의 id 재활용**

### 예시 — 회원 목록에서 ID를 가져와 단건 조회

```js
// 1) 목록 조회 → memberId 획득
const list = await fetch('/api/loccishop/v1/admin/members?limit=10', {
  headers: { 'Authorization': `Bearer ${adminToken}` }
}).then(r => r.json());

const firstMember = list.data.members[0]; // { memberId: 15, username: ... }

// 2) 상세 조회
const detail = await fetch(
  `/api/loccishop/v1/admin/members/${firstMember.memberId}`,
  { headers: { 'Authorization': `Bearer ${adminToken}` } }
).then(r => r.json());

console.log(detail.data); // { id: 15, username: '...', grade: 'BRONZE', ... }
```

### 예시 — 회원 수정

```js
await fetch(`/api/loccishop/v1/admin/members/${memberId}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: '수정된 이름',
    grade: 'GOLD',
    point: 3000
  })
});
```

### 예시 — 회원 삭제

```js
await fetch(`/api/loccishop/v1/admin/members/${memberId}`, {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${adminToken}` }
});
```

> **주의**: `testuser`, `shopfan`, `admin`은 시드 계정으로 보호되어 있어 삭제 시 403 FORBIDDEN이 반환됩니다.

---

## 에러 코드 치트시트

| HTTP | code | 상황 |
| ---- | ---- | ---- |
| 400 | `VALIDATION_ERROR` | 경로 파라미터 타입 불일치 / 잘못된 grade 값 / 필수 필드 누락 |
| 401 | `UNAUTHORIZED` | 토큰 누락 또는 만료 |
| 403 | `FORBIDDEN` | 관리자 권한 없음 / 시드 계정 삭제 시도 |
| 404 | `NOT_FOUND` | 해당 memberId 없음 |
| 500 | `INTERNAL_ERROR` | 실제 서버 오류 (이번 건 수정 후에는 발생하지 않음) |

---

## 관련 수정사항

이번 배포에 포함된 다른 수정:

- **리뷰 삭제 시 포인트 차감 (이슈 1)**: `DELETE /members/me/reviews/:reviewId`가 리뷰 작성 보상 200포인트를 차감하도록 수정. 응답에 `deductedPoint` 필드 추가. 상세는 [reviews.md](./reviews.md) 참고.
