import { getInfoTemplate } from "/src/pages/mypage/components/myInfoTemplate.js";

export function renderInfo() {
  const container = document.querySelector("#mypage-content");
  if (!container) {
    return;
  }

  container.innerHTML = getInfoTemplate();
}
