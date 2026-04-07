# 상품 추천/관련 상품 API 가이드

> 2026-04-07: 상품 목록에 `exclude`, `sort=rating` 파라미터가 추가되었습니다.

---

## 추천 상품 구현 방법

상품 상세 페이지에서 같은 카테고리의 추천 상품을 보여주려면 두 가지 방법이 있습니다.

### 방법 1: GET /products (추천)

```
GET /api/loccishop/v1/products?categoryId={카테고리ID}&exclude={현재상품ID}&sort=rating&limit=10
```

```javascript
// 상품 상세 페이지에서 추천 상품 로드
const productId = 5       // 현재 보고 있는 상품
const categoryId = 9      // 현재 상품의 카테고리

const res = await fetch(
  `/api/loccishop/v1/products?categoryId=${categoryId}&exclude=${productId}&sort=rating&limit=10`
)
const { data } = await res.json()
// data.products → 같은 카테고리의 추천 상품 (현재 상품 제외, 평점순)
```

### 방법 2: GET /products/{id}/related (기존 API)

```
GET /api/loccishop/v1/products/{id}/related?limit=10&sort=rating
```

```javascript
// 상품 ID만 있으면 자동으로 같은 카테고리 추천
const res = await fetch(`/api/loccishop/v1/products/${productId}/related?limit=10&sort=rating`)
const { data } = await res.json()
// data.products → 같은 카테고리, 현재 상품 자동 제외
```

### 두 방법 비교

| 항목 | GET /products + exclude | GET /products/{id}/related |
|------|:----------------------:|:-------------------------:|
| categoryId 직접 지정 | O | X (자동) |
| 현재 상품 제외 | `exclude` 파라미터 | 자동 |
| sort 옵션 | O | O |
| 페이지네이션 | O | X (limit만) |
| badge 필터 | O | X |

> 단순한 추천이면 `related` API가 간편합니다. 세밀한 제어가 필요하면 `GET /products`를 쓰세요.

---

## 파라미터 상세

### GET /products — 추가된 파라미터

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|:----:|--------|------|
| `exclude` | number | X | - | 목록에서 제외할 상품 ID |
| `sort` | string | X | `latest` | 정렬 기준 |

### sort 옵션 (전체)

| 값 | 설명 |
|----|------|
| `latest` | 최신순 (기본값) |
| `price_asc` | 낮은 가격순 |
| `price_desc` | 높은 가격순 |
| `popular` | 판매량순 |
| `rating` | **평점순** (신규) — 평점 높은 순, 동점이면 리뷰 많은 순 |

### GET /products/{id}/related — 추가된 파라미터

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|:----:|--------|------|
| `sort` | string | X | `latest` | 정렬 기준 (위 표와 동일) |
| `limit` | number | X | `10` | 반환 개수 |

---

## 호출 예시

```bash
# 카테고리 9, 상품 1 제외, 평점순, 10건
curl "https://api.fullstackfamily.com/api/loccishop/v1/products?categoryId=9&exclude=1&sort=rating&limit=10"

# related API로 동일한 결과
curl "https://api.fullstackfamily.com/api/loccishop/v1/products/1/related?sort=rating&limit=10"

# 가격 낮은순
curl "https://api.fullstackfamily.com/api/loccishop/v1/products?categoryId=9&sort=price_asc&limit=5"

# 인기순
curl "https://api.fullstackfamily.com/api/loccishop/v1/products?categoryId=9&sort=popular&limit=5"
```

프로덕션에 이미 반영되었습니다.
