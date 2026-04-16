import { getWishTemplate } from "/src/pages/mypage/components/myWishTemplate.js";

export function renderWishList() {
  const container = document.querySelector("#mypage-content");
  if (!container) return;
  container.innerHTML = getWishTemplate();
}
