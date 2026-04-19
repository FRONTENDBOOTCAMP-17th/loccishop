import { fetchAPI } from "/src/js/api/client.js";

//장바구니 추가
export async function addToCart(productId, quantity) {
  try {
    return await fetchAPI("/members/me/cart/items", {
      method: "POST",
      body: { productId, quantity },
    });
  } catch (e) {
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

//장바구니 조회
export async function cartItemList() {
  const result = await fetchAPI("/members/me/cart");
  return result;
}

//장바구니 수정
export async function editCartItem(cartItemId, quantity) {
  try {
    const result = await fetchAPI(`/members/me/cart/items/${cartItemId}`, {
      method: "PUT",
      body: { quantity },
    });
    return result;
  } catch (e) {
    if (e.message.includes(400)) {
      alert("재고가 부족합니다.");
      return null;
    }

    if (e.message.includes(404)) {
      alert("장바구니 항목을 찾을 수 없습니다.");
      return null;
    }
    throw e;
  }
}

//장바구니 삭제
export async function deleteCartItem(cartItemId) {
  const result = await fetchAPI(`/members/me/cart/items/${cartItemId}`, {
    method: "DELETE",
  });

  return result;
}
