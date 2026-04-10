import { fetchAPI, fetchAPIWithFormData } from "/src/js/api/client.js";

// 리뷰 추천수 토글
export function toggleRecommendReview(reviewId) {
  return fetchAPI(`/reviews/${reviewId}/recommend`, { method: "POST" });
}

//내 리뷰 확인
export function checkMyReview(productId) {
  return fetchAPI(`/products/${productId}/reviews`);
}

//리뷰 수정
export function updateReview(reviewId, body) {
  return fetchAPI(`/members/me/reviews/${reviewId}`, {
    method: "PATCH",
    body,
  });
}

//리뷰 삭제
export function deleteReview(reviewId) {
  return fetchAPI(`/members/me/reviews/${reviewId}`, { method: "DELETE" });
}

// 리뷰 이미지 업로드
export async function uploadReviewImages(imageFiles) {
  const urls = [];
  for (const file of imageFiles) {
    const formData = new FormData();
    formData.append("file", file); // ← "images" → "file"
    const data = await fetchAPIWithFormData("/reviews/images", formData);
    urls.push(data.imageUrl);
  }
  return urls;
}

// 리뷰 데이터 전송
export async function submitReview(productId, reviewData, imageFiles = []) {
  let imageUrls = [];

  if (imageFiles.length > 0) {
    imageUrls = await uploadReviewImages(imageFiles);
  }

  return fetchAPI(`/products/${productId}/reviews`, {
    method: "POST",
    body: { ...reviewData, images: imageUrls },
  });
}
