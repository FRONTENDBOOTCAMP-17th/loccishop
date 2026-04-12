# Addresses API (배송지 관리)

회원별 배송지를 관리하는 API입니다. 최대 10개까지 등록 가능합니다.

> 모든 엔드포인트에 `Authorization: Bearer {token}` 헤더가 필요합니다.

---

## 목록

| Method | URL                                      | 설명        |
| ------ | ---------------------------------------- | ----------- |
| GET    | /api/members/me/addresses                | 배송지 목록 |
| POST   | /api/members/me/addresses                | 배송지 추가 |
| PUT    | /api/members/me/addresses/:addressId     | 배송지 수정 |
| DELETE | /api/members/me/addresses/:addressId     | 배송지 삭제 |

---

## 배송지 목록 조회

- **Method**: GET
- **URL**: `/api/members/me/addresses`

### Response

| key                    | 타입    | 설명           |
| ---------------------- | ------- | -------------- |
| data[].addressId       | number  | 배송지 ID      |
| data[].name            | string  | 수령인 이름    |
| data[].phone           | string  | 연락처         |
| data[].zipCode         | string  | 우편번호       |
| data[].address         | string  | 기본 주소      |
| data[].detailAddress   | string  | 상세 주소      |
| data[].isDefault       | boolean | 기본 배송지 여부 |

> 기본 배송지(`isDefault: true`)가 목록 최상단에 정렬됩니다.

### Example

```json
{
  "success": true,
  "data": [
    {
      "addressId": 5,
      "name": "홍길동",
      "phone": "010-1234-5678",
      "zipCode": "06232",
      "address": "서울 강남구 테헤란로 2길 11",
      "detailAddress": "101호",
      "isDefault": true
    },
    {
      "addressId": 6,
      "name": "홍길동",
      "phone": "010-9876-5432",
      "zipCode": "03722",
      "address": "서울 서대문구 연세로 50",
      "detailAddress": "연구관 302호",
      "isDefault": false
    }
  ]
}
```

### Status

| status | 설명      |
| ------ | --------- |
| 200    | 조회 성공 |
| 401    | 인증 실패 |

---

## 배송지 추가

- **Method**: POST
- **URL**: `/api/members/me/addresses`

### Request

| key           | 타입    | 필수 | 설명                            |
| ------------- | ------- | ---- | ------------------------------- |
| name          | string  | O    | 수령인 이름 (최대 50자)         |
| phone         | string  | O    | 연락처 (최대 20자)              |
| zipCode       | string  | O    | 우편번호 (최대 10자)            |
| address       | string  | O    | 기본 주소 (최대 300자)          |
| detailAddress | string  |      | 상세 주소 (최대 300자)          |
| isDefault     | boolean |      | 기본 배송지 설정 (기본값 false) |

### 동작 규칙

- **첫 번째 배송지**: `isDefault`를 `false`로 보내도 **자동으로 기본 배송지**가 됩니다.
- **기본 배송지 설정**: `isDefault: true`로 보내면 기존 기본 배송지는 자동 해제됩니다.
- **최대 개수**: 10개 초과 시 `400` 에러가 반환됩니다.

### Example

**Request:**

```json
{
  "name": "홍길동",
  "phone": "010-1234-5678",
  "zipCode": "06232",
  "address": "서울 강남구 테헤란로 2길 11",
  "detailAddress": "101호",
  "isDefault": false
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "addressId": 5,
    "name": "홍길동",
    "phone": "010-1234-5678",
    "zipCode": "06232",
    "address": "서울 강남구 테헤란로 2길 11",
    "detailAddress": "101호",
    "isDefault": true
  }
}
```

### Status

| status | 설명                           |
| ------ | ------------------------------ |
| 201    | 추가 성공                      |
| 400    | 필수값 누락 / 10개 초과        |
| 401    | 인증 실패                      |

---

## 배송지 수정

- **Method**: PUT
- **URL**: `/api/members/me/addresses/:addressId`

### Request

추가(POST)와 동일한 필드를 모두 보내야 합니다.

- `isDefault: true`로 보내면 기존 기본 배송지는 자동 해제됩니다.

### Example

```json
{
  "name": "홍길동",
  "phone": "010-9876-5432",
  "zipCode": "03722",
  "address": "서울 서대문구 연세로 50",
  "detailAddress": "연구관 302호",
  "isDefault": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "addressId": 6,
    "name": "홍길동",
    "phone": "010-9876-5432",
    "zipCode": "03722",
    "address": "서울 서대문구 연세로 50",
    "detailAddress": "연구관 302호",
    "isDefault": true
  }
}
```

### Status

| status | 설명              |
| ------ | ----------------- |
| 200    | 수정 성공         |
| 400    | 필수값 누락       |
| 401    | 인증 실패         |
| 404    | 배송지 없음       |

---

## 배송지 삭제

- **Method**: DELETE
- **URL**: `/api/members/me/addresses/:addressId`

### 동작 규칙

- **기본 배송지를 삭제**하면, 남은 배송지 중 첫 번째가 자동으로 기본 배송지가 됩니다.
- 마지막 배송지를 삭제하면 목록이 비어집니다.

### Example

```json
{
  "success": true
}
```

### Status

| status | 설명        |
| ------ | ----------- |
| 200    | 삭제 성공   |
| 401    | 인증 실패   |
| 404    | 배송지 없음 |

---

## JavaScript 사용 예시

```js
const API_URL = '/api/loccishop/v1';

// 배송지 목록 조회
async function getAddresses(token) {
  const res = await fetch(`${API_URL}/members/me/addresses`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

// 배송지 추가
async function addAddress(token, data) {
  const res = await fetch(`${API_URL}/members/me/addresses`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

// 배송지 수정
async function updateAddress(token, addressId, data) {
  const res = await fetch(`${API_URL}/members/me/addresses/${addressId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

// 배송지 삭제
async function deleteAddress(token, addressId) {
  const res = await fetch(`${API_URL}/members/me/addresses/${addressId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}
```

### 주문 페이지에서 활용

```js
// 기본 배송지 자동 선택
async function loadDefaultAddress(token) {
  const { data } = await getAddresses(token);
  const defaultAddr = data.find(a => a.isDefault);
  if (defaultAddr) {
    fillShippingForm(defaultAddr);
  }
}
```

---

## 실서버 테스트 결과

| 테스트 | 기대 | 실제 |
| ------ | ---- | ---- |
| 빈 목록 조회 | `[]` | ✓ |
| 첫 배송지 추가 (isDefault=false) | 자동 `isDefault: true` | ✓ |
| 두 번째 추가 (isDefault=false) | `isDefault: false` | ✓ |
| 두 번째를 기본으로 수정 | 첫 번째 기본 자동 해제 | ✓ |
| 기본 배송지 삭제 | 남은 배송지 자동 기본 승격 | ✓ |
| 인증 없이 조회 | 401 | ✓ |
