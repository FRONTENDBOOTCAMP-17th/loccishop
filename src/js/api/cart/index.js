import { fetchAPI } from "/src/js/api/client.js";

//장바구니 추가
export async function addToCart(productId, quantity) {
  try {
    return await fetchAPI("/members/me/cart/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { productId, quantity },
    });
  } catch (e) {
    if (e.message.includes(401)) {
      alert("로그인이 필요한 서비스입니다.");
      // window.location.href = "/src/pages/login/index.html";
      return null;
    }
    if (e.message.includes(400)) {
      alert("재고가 부족합니다.");
      return null;
    }
    if (e.message.includes(404)) {
      alert("상품을 찾을 수 없습니다.");
      return null;
    }
    throw e;
  }
}

export async function fetchCart() {
  const result = await fetchAPI("/members/me/cart");
  return result;
}
