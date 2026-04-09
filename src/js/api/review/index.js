import { fetchAPI } from "/src/js/api/client.js";

//리뷰추천수 토글
export function toggleRecommendReview(reviewId) {
  return fetchAPI(`/reviews/${reviewId}/recommend`, { method: "POST" });
}
