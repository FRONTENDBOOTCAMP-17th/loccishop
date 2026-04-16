import { getOrderTemplate } from "/src/pages/mypage/components/myOrderTemplate.js";

export function renderOrder() {
  const container = document.querySelector("#mypage-content");
  if (!container) return;

  container.innerHTML = getOrderTemplate();
}
