async function initProductPage() {
  const container = document.querySelector("#product-detail-main");
  if (!container) return; 

  // 1. 컴포넌트 로드
  const res = await fetch("/src/pages/product/detail/components/product-detail-main.html");
  container.innerHTML = await res.text();
}

document.addEventListener("DOMContentLoaded", initProductPage);
