# 리뷰 이미지 업로드 API 테스트 가이드

리뷰 작성 시 이미지 첨부 기능을 테스트하는 방법입니다.

> **API 기본 URL**: `https://api.fullstackfamily.com/api/loccishop/v1`

---

## 사전 준비

### 1. 로그인하여 토큰 발급

```bash
curl -s -X POST https://api.fullstackfamily.com/api/loccishop/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test1234!"
  }'
```

응답에서 `accessToken`을 복사하여 아래 테스트에 사용합니다.

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzUxMiJ9..."
  }
}
```

### 2. 토큰을 변수로 저장 (터미널)

```bash
TOKEN="eyJhbGciOiJIUzUxMiJ9..."
```

---

## 테스트 1: 이미지 업로드 (정상)

```bash
curl -X POST https://api.fullstackfamily.com/api/loccishop/v1/reviews/images \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@./my-review-photo.jpg"
```

**예상 응답** (201 Created):

```json
{
  "success": true,
  "data": {
    "imageUrl": "https://storage.fullstackfamily.com/content/loccishop/reviews/efdac5b2-7484-42e2-b180-656434e62aed.webp"
  }
}
```

---

## 테스트 2: 업로드한 이미지로 리뷰 작성

테스트 1에서 받은 `imageUrl`을 `images` 배열에 넣습니다.

```bash
IMAGE_URL="https://storage.fullstackfamily.com/content/loccishop/reviews/efdac5b2-xxxx.webp"

curl -X POST https://api.fullstackfamily.com/api/loccishop/v1/products/1/reviews \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"orderId\": 1,
    \"rating\": 5,
    \"isRecommend\": true,
    \"title\": \"이미지 테스트 리뷰\",
    \"content\": \"이미지 업로드가 잘 되는지 테스트하는 리뷰입니다.\",
    \"images\": [\"$IMAGE_URL\"],
    \"nickname\": \"테스터\"
  }"
```

**예상 응답** (201 Created):

```json
{
  "success": true,
  "data": {
    "reviewId": 1,
    "reviewPoint": 200
  }
}
```

---

## 테스트 3: 리뷰 목록에서 이미지 확인

```bash
curl -s "https://api.fullstackfamily.com/api/loccishop/v1/products/1/reviews" | python3 -m json.tool
```

`reviewImages` 배열에 업로드한 이미지 URL이 포함되어 있는지 확인합니다.

```json
{
  "reviews": [
    {
      "id": 1,
      "title": "이미지 테스트 리뷰",
      "reviewImages": [
        "https://storage.fullstackfamily.com/content/loccishop/reviews/efdac5b2-xxxx.webp"
      ]
    }
  ]
}
```

---

## 에러 케이스 테스트

### 인증 없이 업로드 (401)

```bash
curl -X POST https://api.fullstackfamily.com/api/loccishop/v1/reviews/images \
  -F "file=@./my-review-photo.jpg"
```

### 빈 파일 업로드 (400)

```bash
touch empty.png
curl -X POST https://api.fullstackfamily.com/api/loccishop/v1/reviews/images \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@./empty.png"
```

```json
{
  "success": false,
  "message": "파일이 비어있습니다.",
  "error": { "code": "VALIDATION_ERROR" }
}
```

### 5MB 초과 파일 (413)

```bash
# 6MB 더미 파일 생성
dd if=/dev/zero of=big.jpg bs=1048576 count=6 2>/dev/null
curl -X POST https://api.fullstackfamily.com/api/loccishop/v1/reviews/images \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@./big.jpg"
```

### 허용되지 않는 형식 (400)

```bash
echo "not an image" > test.txt
curl -X POST https://api.fullstackfamily.com/api/loccishop/v1/reviews/images \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@./test.txt"
```

```json
{
  "success": false,
  "message": "허용되지 않는 이미지 형식입니다. (JPEG, PNG, WebP, GIF만 가능)"
}
```

---

## JavaScript 코드 예제

프론트엔드에서 이미지를 업로드하고 리뷰를 작성하는 전체 흐름입니다.

```js
// 1단계: 이미지 업로드
async function uploadReviewImage(file, token) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/loccishop/v1/reviews/images', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });

  const result = await res.json();
  return result.data.imageUrl;
}

// 2단계: 리뷰 작성 (이미지 URL 포함)
async function createReview(productId, reviewData, token) {
  const res = await fetch(`/api/loccishop/v1/products/${productId}/reviews`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reviewData)
  });

  return await res.json();
}

// 전체 흐름
async function submitReviewWithImages(productId, formData, files, token) {
  // 이미지들을 먼저 업로드
  const imageUrls = [];
  for (const file of files) {
    const url = await uploadReviewImage(file, token);
    imageUrls.push(url);
  }

  // 리뷰 작성 (업로드된 이미지 URL 포함)
  const reviewData = {
    orderId: formData.orderId,
    rating: formData.rating,
    isRecommend: formData.isRecommend,
    title: formData.title,
    content: formData.content,
    images: imageUrls,
    nickname: formData.nickname
  };

  return await createReview(productId, reviewData, token);
}
```

---

## 주의사항

- `Content-Type`을 `multipart/form-data`로 직접 지정하지 마세요. `FormData` 사용 시 브라우저가 자동으로 boundary를 포함하여 설정합니다.
- 이미지는 업로드 시 자동으로 WebP 형식으로 변환됩니다.
- 리뷰당 이미지는 최대 5장까지 가능합니다.
- 허용 형식: JPEG, PNG, WebP, GIF (최대 5MB)
