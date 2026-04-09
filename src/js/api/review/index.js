import { fetchAPI } from "/src/js/api/client.js";

//리뷰추천수 토글
export function toggleRecommendReview(reviewId) {
  return fetchAPI(`/reviews/${reviewId}/recommend`, { method: "POST" });
}

//리뷰 데이터 전송
export function submitReview(productId, reviewData) {
  return fetchAPI(`/products/${productId}/reviews`, {
    method: "POST",
    body: reviewData,
  });
}
