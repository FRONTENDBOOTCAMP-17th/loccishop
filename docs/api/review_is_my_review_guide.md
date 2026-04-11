# `isMyReview` 필드 사용 가이드

리뷰 수정/삭제 버튼을 본인 리뷰에만 노출하기 위한 `isMyReview` 필드 사용법입니다.

> **API**: `GET /api/loccishop/v1/products/{id}/reviews`
> **추가된 필드**: `reviews[].isMyReview` (boolean)

---

## 필드 동작 규칙

| 상황                                     | `isMyReview` |
| ---------------------------------------- | ------------ |
| 비로그인 사용자가 호출                    | `false`      |
| 로그인 사용자가 본인이 작성한 리뷰를 조회 | `true`       |
| 로그인 사용자가 다른 사람의 리뷰를 조회   | `false`      |

- 인증 토큰(`Authorization: Bearer {token}`)을 함께 보내야 `isMyReview`가 올바르게 계산됩니다.
- 토큰 없이 호출하면 모든 리뷰의 `isMyReview`는 `false`로 내려옵니다.

---

## 응답 예시

### 로그인 사용자가 본인 + 타인 리뷰 목록을 조회

```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": 15,
        "isMyReview": true,
        "title": "내가 쓴 리뷰",
        "content": "...",
        "author": "테스터",
        "rating": 5,
        "reviewImages": [],
        "recommendCount": 0,
        "isRecommended": false
      },
      {
        "id": 14,
        "isMyReview": false,
        "title": "다른 사람이 쓴 리뷰",
        "content": "...",
        "author": "Jay",
        "rating": 4,
        "reviewImages": [],
        "recommendCount": 3,
        "isRecommended": true
      }
    ]
  }
}
```

---

## 프런트엔드 사용 예시

### 1. 리뷰 카드 렌더링

```js
function renderReviewCard(review) {
  const actions = review.isMyReview
    ? `
      <div class="review-actions">
        <button class="btn-edit" data-review-id="${review.id}">수정</button>
        <button class="btn-delete" data-review-id="${review.id}">삭제</button>
      </div>
    `
    : '';

  return `
    <article class="review-card">
      <header>
        <h3>${review.title}</h3>
        <span class="rating">⭐ ${review.rating}</span>
      </header>
      <p class="author">${review.author}</p>
      <p class="content">${review.content}</p>
      ${actions}
    </article>
  `;
}
```

### 2. 리뷰 목록 조회 (토큰 포함)

```js
async function fetchReviews(productId, page = 1) {
  const token = localStorage.getItem('accessToken');
  const headers = {};

  // 로그인한 경우에만 토큰 전송 — isMyReview가 정확하게 계산됨
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(
    `/api/loccishop/v1/products/${productId}/reviews?page=${page}&limit=10`,
    { headers }
  );

  const result = await res.json();
  return result.data.reviews;
}
```

### 3. 수정/삭제 버튼 이벤트 연결

```js
async function renderReviewList(productId) {
  const reviews = await fetchReviews(productId);
  const container = document.querySelector('.review-list');

  container.innerHTML = reviews.map(renderReviewCard).join('');

  // 본인 리뷰에만 버튼이 있으므로 이벤트가 본인 리뷰에만 붙음
  container.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const reviewId = e.target.dataset.reviewId;
      openEditModal(reviewId);
    });
  });

  container.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const reviewId = e.target.dataset.reviewId;
      if (confirm('리뷰를 삭제하시겠습니까?')) {
        await deleteReview(reviewId);
        await renderReviewList(productId); // 재조회
      }
    });
  });
}
```

### 4. 리뷰 삭제 호출

```js
async function deleteReview(reviewId) {
  const token = localStorage.getItem('accessToken');
  const res = await fetch(`/api/loccishop/v1/members/me/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}
```

---

## 테스트 절차 (curl)

### 1. 비로그인 상태 테스트

```bash
curl -s "https://api.fullstackfamily.com/api/loccishop/v1/products/5/reviews?limit=5" \
  | python3 -m json.tool
```

**기대 결과**: 모든 리뷰의 `isMyReview`가 `false`

### 2. 본인 리뷰 조회 테스트

```bash
# 1) 로그인
TOKEN=$(curl -s -X POST https://api.fullstackfamily.com/api/loccishop/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test1234!"}' \
  | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['accessToken'])")

# 2) testuser가 작성한 리뷰가 있는 상품 조회
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://api.fullstackfamily.com/api/loccishop/v1/products/5/reviews" \
  | python3 -m json.tool
```

**기대 결과**: testuser가 작성한 리뷰만 `isMyReview: true`, 나머지는 `false`

### 3. 다른 사용자 리뷰 조회 테스트

```bash
# 신규 유저 가입
SUFFIX=$(date +%s)
curl -s -X POST https://api.fullstackfamily.com/api/loccishop/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d "{
    \"username\":\"revtest$SUFFIX\",
    \"password\":\"Test1234!\",
    \"name\":\"리뷰테스터\",
    \"email\":\"revtest$SUFFIX@example.com\"
  }"

# 신규 유저로 로그인
OTHER_TOKEN=$(curl -s -X POST https://api.fullstackfamily.com/api/loccishop/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"revtest$SUFFIX\",\"password\":\"Test1234!\"}" \
  | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['accessToken'])")

# testuser가 쓴 리뷰 조회 — isMyReview는 false여야 함
curl -s -H "Authorization: Bearer $OTHER_TOKEN" \
  "https://api.fullstackfamily.com/api/loccishop/v1/products/5/reviews" \
  | python3 -m json.tool
```

**기대 결과**: 모든 리뷰의 `isMyReview`가 `false`

---

## 실서버 테스트 결과

| 시나리오 | 기대값 | 실제값 |
| -------- | ------ | ------ |
| 비로그인 호출 | `false` | `false` |
| testuser가 본인 리뷰 조회 | `true` | `true` |
| 다른 유저(revtest)가 testuser 리뷰 조회 | `false` | `false` |

---

## 주의사항

- **비로그인 상태에서는 수정/삭제 버튼을 노출하지 말 것**
  `isMyReview`가 `false`이므로 자연스럽게 숨겨지지만, 프런트엔드에서 토큰 전달을 빠뜨리면 본인 리뷰도 `false`로 내려옵니다.
- **삭제/수정 API는 서버에서 다시 본인 확인**
  `isMyReview`는 UI 노출용이고, 실제 수정/삭제 API(`PATCH/DELETE /members/me/reviews/:id`)에서도 본인 확인을 다시 합니다. 악의적인 클라이언트가 `isMyReview`를 위조해도 타인의 리뷰는 수정/삭제되지 않습니다.
- **권장 패턴: 옵셔널 토큰**
  조회 API 호출 시 토큰이 있으면 넣고, 없으면 생략하는 옵셔널 방식으로 구현하세요. 비로그인 사용자에게도 리뷰 목록은 보여야 하지만, 로그인한 사용자에게는 `isMyReview`가 정확히 계산되어야 합니다.
