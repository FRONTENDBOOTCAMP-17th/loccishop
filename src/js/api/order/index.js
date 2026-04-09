import { fetchAPI } from "/src/js/api/client.js";

// 리뷰 작성 가능 여부 확인
export async function fetchReviewable({ productId, orderId }) {
  const params = new URLSearchParams();
  if (productId) {
    params.set("productId", productId);
  }
  if (orderId) {
    params.set("orderId", orderId);
  }

  return fetchAPI(`/members/me/orders/reviewable?${params}`);
}
