# Auth API

회원가입, 로그인, 로그아웃 등 인증 관련 API입니다.

---

## 목록

| Method | URL                | 설명             |
| ------ | ------------------ | ---------------- |
| GET    | /api/auth/check-id | 아이디 중복 체크 |
| POST   | /api/auth/signup   | 회원가입         |
| POST   | /api/auth/login    | 로그인           |
| POST   | /api/auth/logout   | 로그아웃         |

---

## 아이디 중복 체크

회원가입 시 아이디 입력 직후 또는 중복확인 버튼 클릭 시 실시간으로 확인합니다.

- **Method**: GET
- **URL**: `/api/auth/check-id`
- **사용자**: 유저

### Request (Query parameter)

| key      | 설명          | 비고               |
| -------- | ------------- | ------------------ |
| username | 확인할 아이디 | `?username=testId` |

### Response

| key         | 설명           | 비고            |
| ----------- | -------------- | --------------- |
| isAvailable | 사용 가능 여부 | `true`, `false` |
| message     | 안내 메시지    |                 |

### Example

```json
{
  "status": "success",
  "data": {
    "id": "test",
    "isAvailable": true,
    "message": "사용 가능한 아이디입니다."
  }
}
```

### Status

| status | 설명                                        |
| ------ | ------------------------------------------- |
| 200    | 사용 가능한 아이디                          |
| 200    | 이미 사용중인 아이디 (`isAvailable: false`) |
| 400    | 잘못된 요청                                 |

---

## 회원가입

새 계정을 생성합니다.

- **Method**: POST
- **URL**: `/api/auth/signup`
- **사용자**: 유저

### Request

| key            | 설명        | 비고                             |
| -------------- | ----------- | -------------------------------- |
| username       | 회원 아이디 |                                  |
| password       | 비밀번호    | 영문+숫자+특수문자 포함 8자 이상 |
| name           | 회원 이름   |                                  |
| email          | 이메일      |                                  |
| base_address   | 기본주소    |                                  |
| detail_address | 상세주소    |                                  |

### Response

| key       | 설명           | 비고        |
| --------- | -------------- | ----------- |
| id        | 회원 고유 번호 |             |
| username  | 회원 아이디    |             |
| name      | 회원 이름      |             |
| createdAt | 가입 일시      |             |
| role      | 권한           | `user` 고정 |

### Example

```json
{
  "success": true,
  "message": "회원가입이 완료되었습니다.",
  "data": {
    "memberId": 1042,
    "username": "hong123",
    "name": "홍길동",
    "createdAt": "2025-03-15T09:30:00Z",
    "role": "user"
  }
}
```

### Status

| status | 설명                |
| ------ | ------------------- |
| 201    | 회원가입 완료       |
| 400    | 필수 입력 항목 오류 |

---

## 로그인

아이디와 비밀번호로 인증합니다. 성공 시 `accessToken`을 반환합니다.

- **Method**: POST
- **URL**: `/api/auth/login`
- **사용자**: 유저

### Request

| key      | 설명          | 비고 |
| -------- | ------------- | ---- |
| username | 가입한 아이디 |      |
| password | 비밀번호      |      |

### Response

| key          | 설명         | 비고                              |
| ------------ | ------------ | --------------------------------- |
| accessToken  | JWT 토큰     |                                   |
| member.id    | 회원 고유 id |                                   |
| member.name  | 회원 이름    |                                   |
| member.grade | 회원 등급    | `bronze`, `silver`, `gold`, `vip` |
| member.point | 보유 포인트  |                                   |

### Example

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "member": {
      "id": 1042,
      "name": "홍길동",
      "grade": "SILVER",
      "point": 3200
    }
  }
}
```

### Status

| status | 설명                        |
| ------ | --------------------------- |
| 200    | 로그인 성공                 |
| 401    | 아이디 또는 비밀번호 불일치 |
| 403    | 접근 권한 없는 계정         |

---

## 로그아웃

서버 측에서 세션 만료 또는 토큰을 무효화합니다.

- **Method**: POST
- **URL**: `/api/auth/logout`
- **사용자**: 유저
- **인증**: 필요 (`Authorization: Bearer {token}`)

### Response

| key     | 설명        | 비고 |
| ------- | ----------- | ---- |
| status  | 성공 여부   |      |
| message | 안내 메시지 |      |

### Example

```json
{
  "status": "success",
  "message": "로그아웃 되었습니다.",
  "data": null
}
```

### Status

| status | 설명                       |
| ------ | -------------------------- |
| 200    | 로그아웃 성공              |
| 401    | 인증 실패 (토큰 없음/만료) |
