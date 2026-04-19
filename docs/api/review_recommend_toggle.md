# 리뷰 추천 토글 API 안내

> 2026-04-09: 리뷰 추천/취소 토글 API가 추가되었습니다.

---

## 추천 토글 API

```
POST /api/loccishop/v1/reviews/{reviewId}/recommend
Authorization: Bearer {토큰}
```

- 처음 호출 → **추천** (recommendCount +1)
- 다시 호출 → **취소** (recommendCount -1)
- 한 사용자가 같은 리뷰에 중복 추천 불가

### 응답

```json
{
  "success": true,
  "data": {
    "reviewId": 9,
    "recommendCount": 1,
    "isRecommended": true
  }
}
```

| 필드 | 설명 |
|------|------|
| `recommendCount` | 현재 총 추천 수 |
| `isRecommended` | 내가 추천했는지 (true=추천됨, false=취소됨) |

### 에러

| 상태 | 메시지 |
|:----:|--------|
| 401 | 인증이 필요합니다 |
| 404 | 리뷰를 찾을 수 없습니다 |

---

## 리뷰 목록에 isRecommended 추가

`GET /products/{id}/reviews` 응답의 각 리뷰에 `isRecommended` 필드가 추가되었습니다.

```json
{
  "reviews": [
    {
      "id": 4,
      "rating": 5,
      "title": "좋아요!",
      "content": "...",
      "recommendCount": 3,
      "isRecommended": true
    }
  ]
}
```

- **로그인 상태**: `Authorization` 헤더를 보내면 내가 추천한 리뷰에 `isRecommended: true`
- **비로그인**: 모든 리뷰가 `isRecommended: false`
- 기존 `recommendCount`는 항상 표시됨

> 리뷰 조회 API(`GET /products/{id}/reviews`)는 여전히 공개(인증 불필요)이지만, 로그인 토큰을 보내면 `isRecommended`가 정확하게 반영됩니다.

---

## 프론트엔드 사용 예시

```javascript
// 추천 토글
const toggleRecommend = async (reviewId) => {
  const res = await fetch(`/api/loccishop/v1/reviews/${reviewId}/recommend`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  })
  const { data } = await res.json()
  // data.isRecommended → 버튼 상태 업데이트
  // data.recommendCount → 추천 수 업데이트
}

// 리뷰 목록에서 추천 상태 표시 (로그인 시 토큰 전달)
const fetchReviews = async (productId) => {
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
  const res = await fetch(`/api/loccishop/v1/products/${productId}/reviews`, { headers })
  const { data } = await res.json()
  data.reviews.forEach(review => {
    console.log(`${review.recommendCount}명 추천, 내가 추천: ${review.isRecommended}`)
  })
}
```

프로덕션에 이미 반영되었습니다.
