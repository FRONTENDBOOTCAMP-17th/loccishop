# 할인 계산 양방향 지원 수정 안내

> 2026-04-07: 상품 등록/수정 시 `discountPrice`로도 할인율을 자동 계산할 수 있습니다.

## 문제

기존에는 상품 등록/수정 시 `discountRate`(할인율)만 입력 가능했고, `discountPrice`(할인가)를 직접 입력하면 무시되었습니다.

## 수정 내용

이제 **양방향 계산**을 지원합니다:

| 입력 | 자동 계산 | 예시 |
|------|----------|------|
| `discountPrice` 입력 | → `discountRate` 자동 계산 | price=50000, discountPrice=40000 → discountRate=20 |
| `discountRate` 입력 | → `discountPrice` 자동 계산 | price=30000, discountRate=15 → discountPrice=25500 |
| 둘 다 입력 | `discountPrice` 우선 | discountPrice 기준으로 discountRate 역산 |
| 둘 다 없음 | 할인 없음 | discountRate=0, discountPrice=null |

## 사용 예시

### 등록 시 discountPrice로 할인 설정

```bash
POST /api/loccishop/v1/admin/products
Authorization: Bearer {토큰}

{
  "categoryId": 1,
  "name": "시어 핸드크림",
  "price": 50000,
  "discountPrice": 40000,
  "stock": 100
}
```

응답에서 `discountRate: 20`이 자동 계산됩니다.

### 등록 시 discountRate로 할인 설정 (기존 방식도 유지)

```bash
{
  "categoryId": 1,
  "name": "시어 핸드크림",
  "price": 30000,
  "discountRate": 15,
  "stock": 100
}
```

응답에서 `discountPrice: 25500`이 자동 계산됩니다.

### 수정 시 discountPrice 변경

```bash
PATCH /api/loccishop/v1/admin/products/{id}
Authorization: Bearer {토큰}

{ "discountPrice": 35000 }
```

`discountRate`가 자동으로 재계산됩니다.

## 적용 대상

- `POST /api/loccishop/v1/admin/products` (상품 등록)
- `PATCH /api/loccishop/v1/admin/products/{id}` (상품 수정)

프로덕션에 이미 반영되었습니다.
