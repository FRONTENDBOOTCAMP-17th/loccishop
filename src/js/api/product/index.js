import { fetchAPI } from "/src/js/api/client.js";

// 상품 목록 조회
export function fetchProducts({ page = 1, limit = 20, categoryId, sort, badge } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (categoryId) params.set("categoryId", categoryId);
  if (sort) params.set("sort", sort);
  if (badge) params.set("badge", badge);
  return fetchAPI(`/products?${params}`);
}

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
  { page = 1, limit = 10, sort = "latest", rating = null } = {},
) {
  const params = new URLSearchParams({ page, limit, sort });
  if (rating) {
    params.set("rating", rating);
  }
  return fetchAPI(`/products/${productId}/reviews?${params}`);
}

// 리추얼 단계 조회
export function fetchRitualSteps(id) {
  return fetchAPI(`/products/${id}/ritual-steps`);
}
