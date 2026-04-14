import { fetchAPI } from "/src/js/api/client.js";

//리뷰추천수 토글
export function toggleIsWished(productId) {
  return fetchAPI(`/members/me/wishlist/${productId}/toggle`, {
    method: "POST",
  });
}

//위시리스트 조회
export function fetchWishList() {
  return fetchAPI("/members/me/wishlist");
}
