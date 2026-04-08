# 리뷰 평균 별점 + 별점별 개수 추가 안내

> 2026-04-09: 리뷰 조회 API의 meta에 `ratingAverage`와 `ratingCounts`가 추가되었습니다.

---

## 변경된 API

### GET /api/loccishop/v1/products/{id}/reviews

기존 `meta.pagination`에 더해 `ratingAverage`와 `ratingCounts`가 추가됩니다.

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "reviews": [ ... ],
    "meta": {
      "pagination": {
        "total": 23,
        "totalPages": 3,
        "currentPage": 1,
        "sizePerPage": 10
      },
      "ratingAverage": 4.3,
      "ratingCounts": {
        "5": 15,
        "4": 3,
        "3": 2,
        "2": 1,
        "1": 0
      }
    }
  }
}
```

### 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `ratingAverage` | number | 평균 별점 (소수점 1자리, 리뷰 없으면 0.0) |
| `ratingCounts` | object | 별점별 리뷰 개수 (5점→1점 순서) |
| `ratingCounts.5` | number | 5점 리뷰 수 |
| `ratingCounts.4` | number | 4점 리뷰 수 |
| `ratingCounts.3` | number | 3점 리뷰 수 |
| `ratingCounts.2` | number | 2점 리뷰 수 |
| `ratingCounts.1` | number | 1점 리뷰 수 |

### 프론트엔드 사용 예시

```javascript
const res = await fetch(`/api/loccishop/v1/products/${productId}/reviews?page=1&limit=10`)
const { data } = await res.json()

const { ratingAverage, ratingCounts } = data.meta

// 평균 별점 표시
console.log(`평균: ${ratingAverage}점`)

// 별점 분포 막대그래프
Object.entries(ratingCounts).forEach(([star, count]) => {
  const percentage = data.meta.pagination.total > 0
    ? Math.round((count / data.meta.pagination.total) * 100)
    : 0
  console.log(`${star}점: ${'█'.repeat(percentage / 5)} ${count}개 (${percentage}%)`)
})
```

프로덕션에 이미 반영되었습니다.
