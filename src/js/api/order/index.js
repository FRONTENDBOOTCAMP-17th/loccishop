// 리뷰 작성 가능 여부 확인
export async function fetchReviewable({ productId, orderId }) {
  const params = new URLSearchParams();
  if (productId) {
    params.set("productId", productId);
  }
  if (orderId) {
    params.set("orderId", orderId);
  }

  const res = await fetch(
    `/api/loccishop/v1/members/me/orders/reviewable?${params}`,
  );
  const json = await res.json();
  return json.data; // { orderId, isReviewable }
}
