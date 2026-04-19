import { fetchAPI, fetchAPIWithMeta } from "/src/js/api/client.js";

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

//주문 생성
export async function createOrder(orderData) {
  const result = await fetchAPI("/members/me/orders", {
    method: "POST",
    body: orderData,
  });

  return result;
}

//주문 조회
export async function fetchOrder(page = 1, limit = 10) {
  return await fetchAPIWithMeta(
    `/members/me/orders?page=${page}&limit=${limit}`,
  );
}

//주문 상세 조회
export async function fetchOrderDetail(orderId) {
  return await fetchAPI(`/members/me/orders/${orderId}`);
}

//주문 취소
export async function cancelOrder(orderId, cancelReason) {
  return await fetchAPI(`/members/me/orders/${orderId}/cancel`, {
    method: "POST",
    body: cancelReason,
  });
}

// 배송지 수정
export async function updateOrderShipping(orderId, data) {
  return await fetchAPI(`/members/me/orders/${orderId}`, {
    method: "PATCH",
    body: data,
  });
}
