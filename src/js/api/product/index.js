import { fetchAPI } from "/src/js/api/client.js";

// 상품 조회
export function fetchProduct(id) {
  return fetchAPI(`/products/${id}`);
}

// 연관 상품
export function fetchRelatedProducts(id, limit = 10) {
  return fetchAPI(`/products/${id}/related?limit=${limit}`);
}

// 리뷰 조회
export function fetchProductReviews(
  productId,
  { page = 1, limit = 10, sort = "latest" } = {},
) {
  const params = new URLSearchParams({ page, limit, sort });
  return fetchAPI(`/products/${productId}/reviews?${params}`);
}
