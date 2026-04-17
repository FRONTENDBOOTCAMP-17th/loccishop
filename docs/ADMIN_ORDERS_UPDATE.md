# GET /admin/orders API 업데이트 안내

> 2026-04-17 적용 완료

## 변경 사항

### 1. 각 주문 항목에 `memberId` 추가

배송완료 시 포인트 적립 등에 활용할 수 있도록, 주문 목록의 각 항목에 `memberId` 필드가 추가되었습니다.

### 2. `meta.pagination` 추가

페이지네이션 처리에 필요한 메타 정보가 응답에 포함됩니다.

---

## 응답 예시

```
GET /api/loccishop/v1/admin/orders?page=1&limit=5
Authorization: Bearer {admin_token}
```

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "orderId": 100,
        "orderNumber": "ORD-20260401-001",
        "memberId": 2,
        "memberName": "테스트유저",
        "trackingNumber": null,
        "totalAmount": 56800,
        "status": "PAID",
        "itemCount": 2,
        "createdAt": "2026-04-01T11:00:00"
      }
    ],
    "meta": {
      "pagination": {
        "page": 1,
        "limit": 5,
        "totalItems": 23,
        "totalPages": 5,
        "hasNext": true,
        "hasPrev": false
      }
    }
  }
}
```

---

## 추가된 필드 설명

### 주문 항목 (`orders[]`)

| 필드 | 타입 | 설명 |
|------|------|------|
| `memberId` | number | 주문한 회원의 ID (신규) |

> 기존 필드(`orderId`, `orderNumber`, `memberName`, `trackingNumber`, `totalAmount`, `status`, `itemCount`, `createdAt`)는 변경 없음

### 페이지네이션 (`meta.pagination`)

| 필드 | 타입 | 설명 |
|------|------|------|
| `page` | number | 현재 페이지 번호 |
| `limit` | number | 페이지당 항목 수 |
| `totalItems` | number | 전체 주문 수 |
| `totalPages` | number | 전체 페이지 수 |
| `hasNext` | boolean | 다음 페이지 존재 여부 |
| `hasPrev` | boolean | 이전 페이지 존재 여부 |

---

## 사용 예시 (JavaScript)

### 주문 목록 + 페이지네이션

```js
const res = await fetch('/api/loccishop/v1/admin/orders?page=1&limit=10', {
  headers: { Authorization: `Bearer ${token}` }
});
const { data } = await res.json();

// 주문 목록
data.orders.forEach(order => {
  console.log(`주문번호: ${order.orderNumber}, 회원ID: ${order.memberId}`);
});

// 페이지네이션
const { pagination } = data.meta;
console.log(`${pagination.page} / ${pagination.totalPages} 페이지`);
console.log(`전체 ${pagination.totalItems}건`);

if (pagination.hasNext) {
  // 다음 페이지 로드
}
```

### 배송완료 후 포인트 적립 (memberId 활용)

```js
// 주문 상태를 DELIVERED로 변경
await fetch(`/api/loccishop/v1/admin/orders/${order.orderId}/status`, {
  method: 'PATCH',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ status: 'DELIVERED' })
});

// memberId로 포인트 적립
await fetch(`/api/loccishop/v1/admin/members/${order.memberId}`, {
  method: 'PATCH',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    point: earnedPoint  // 적립할 포인트
  })
});
```

---

## 카테고리 삭제 400 에러 관련

카테고리 삭제 시 "하위 카테고리가 있어 삭제할 수 없습니다" 에러가 발생하는 경우:

1. **삭제하려는 카테고리 ID를 확인**해 주세요 — `GET /api/loccishop/v1/categories`로 전체 목록을 조회하여 실제 존재하는 ID인지 확인
2. **parent_id가 해당 ID인 하위 카테고리가 있는지 확인** — 예를 들어 ID 5번(스킨케어)은 하위에 6, 7, 25번이 있어 바로 삭제할 수 없습니다
3. 하위 카테고리를 먼저 삭제한 후 상위 카테고리를 삭제하면 됩니다

서버 코드에는 이상이 없으며, 삭제 대상 카테고리 ID와 현재 카테고리 트리를 다시 확인해 주세요.
