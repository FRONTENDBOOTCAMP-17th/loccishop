# Members API

회원 프로필 조회, 수정, 비밀번호 변경, 탈퇴 관련 API입니다.

> 모든 요청에 `Authorization: Bearer {token}` 헤더가 필요합니다.

---

## 목록

| Method | URL                      | 설명          |
| ------ | ------------------------ | ------------- |
| GET    | /api/members/me          | 내 정보 조회  |
| PUT    | /api/members/me          | 내 정보 수정  |
| PATCH  | /api/members/me/password | 비밀번호 변경 |
| DELETE | /api/members/me          | 회원 탈퇴     |

---

## 내 정보 조회

현재 로그인한 회원의 프로필 정보를 반환합니다.

- **Method**: GET
- **URL**: `/api/members/me`
- **사용자**: 유저

### Response

| key            | 설명           | 비고 |
| -------------- | -------------- | ---- |
| id             | 회원 고유 번호 |      |
| username       | 회원 아이디    |      |
| name           | 회원 이름      |      |
| email          | 이메일         |      |
| base_address   | 기본주소       |      |
| detail_address | 상세주소       |      |
| grade          | 회원 등급      |      |
| point          | 보유 포인트    |      |
| createdAt      | 가입일         |      |

### Example

```json
{
  "id": 1042,
  "username": "hong123",
  "name": "홍길동",
  "email": "user@example.com",
  "base_address": "서울시 00로 123",
  "detail_address": "00아파트 111동 111호",
  "grade": "SILVER",
  "point": 3200,
  "createdAt": "2025-01-10T08:00:00Z"
}
```

### Status

| status | 설명      |
| ------ | --------- |
| 200    | 조회 성공 |
| 401    | 인증 실패 |

---

## 내 정보 수정

이름, 이메일, 주소 등 기본 프로필 정보를 수정합니다.

- **Method**: PUT
- **URL**: `/api/members/me`
- **사용자**: 유저

### Request

| key            | 설명            | 비고 |
| -------------- | --------------- | ---- |
| name           | 변경할 이름     |      |
| email          | 변경할 이메일   |      |
| base_address   | 변경할 기본주소 |      |
| detail_address | 변경할 상세주소 |      |

### Response

| key | 설명           | 비고 |
| --- | -------------- | ---- |
| id  | 회원 고유 번호 |      |

### Example

```json
{
  "success": true,
  "message": "회원 정보가 성공적으로 수정되었습니다.",
  "data": {
    "userId": 1024
  }
}
```

### Status

| status | 설명        |
| ------ | ----------- |
| 200    | 수정 성공   |
| 400    | 잘못된 요청 |
| 401    | 인증 실패   |

---

## 비밀번호 변경

현재 비밀번호 확인 후, 새로운 비밀번호로 변경합니다.

- **Method**: PATCH
- **URL**: `/api/members/me/password`
- **사용자**: 유저

### Request

| key             | 설명             | 비고        |
| --------------- | ---------------- | ----------- |
| currentPassword | 기존 비밀번호    | 본인 확인용 |
| newPassword     | 새 비밀번호      |             |
| confirmPassword | 새 비밀번호 확인 |             |

### Example

```json
{
  "success": true,
  "message": "비밀번호가 변경되었습니다. 다시 로그인해주세요."
}
```

### Status

| status | 설명                 |
| ------ | -------------------- |
| 200    | 변경 성공            |
| 400    | 현재 비밀번호 불일치 |
| 401    | 인증 실패            |

---

## 회원 탈퇴

본인 확인 후, 회원 정보를 삭제합니다.

- **Method**: DELETE
- **URL**: `/api/members/me`
- **사용자**: 유저

### Request

| key      | 설명     | 비고        |
| -------- | -------- | ----------- |
| password | 비밀번호 | 본인 확인용 |

### Example

```json
{
  "success": true,
  "message": "회원 탈퇴가 정상적으로 처리되었습니다. 그동안 이용해 주셔서 감사합니다."
}
```

### Status

| status | 설명            |
| ------ | --------------- |
| 200    | 탈퇴 성공       |
| 400    | 비밀번호 불일치 |
| 401    | 인증 실패       |
