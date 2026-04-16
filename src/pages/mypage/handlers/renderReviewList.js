import { getReviewTemplate } from "/src/pages/mypage/components/myReviewTemplate.js";

export function renderReviewList() {
  const container = document.querySelector("#mypage-content");
  if (!container) return;
  container.innerHTML = getReviewTemplate();
}
