import { createProductCard } from "/src/components/ui/product-card.js";

// API 응답 → createProductCard props 변환
export function toCardProps(product) {
  return {
    id: product.id,
    image: product.images?.[0] ?? "",
    imageAlt: product.name,
    badgeType: product.badge?.toLowerCase() ?? null,
    name: product.name,
    size: product.size,
    originalPrice: product.price,
    discountRate: product.discountRate ?? null,
    discountPrice: product.discountPrice ?? null,
    isWished: product.isWished ?? false,
  };
}

// 상품 카드 렌더링 (컨테이너 엘리먼트에 직접 주입)
export function renderCardList(products, containerEl) {
  containerEl.innerHTML = "";
  products.forEach((product) => {
    const li = document.createElement("li");
    li.append(createProductCard(product));
    containerEl.append(li);
  });
}

// 탭 UI 생성 + 활성 상태 관리
// navEl: <ul> 또는 <nav> 엘리먼트
// tabs: 탭 라벨 배열
// allProducts: 전체 상품 배열 (이미 toCardProps 변환된 상태)
// filterFn(products, label): 탭 라벨 기반 필터 함수
// onTabChange(filteredProducts): 탭 변경 시 호출될 콜백
export function setupProductTabs({
  navEl,
  tabs,
  allProducts,
  filterFn,
  onTabChange,
}) {
  if (!navEl) return;
  navEl.innerHTML = "";

  function setActiveTab(activeLi) {
    navEl.querySelectorAll("li").forEach((li) => {
      li.classList.remove("text-woody-brown", "underline");
      li.classList.add("text-empress");
    });
    activeLi.classList.remove("text-empress");
    activeLi.classList.add("text-woody-brown", "underline");
  }

  tabs.forEach((label, idx) => {
    const li = document.createElement("li");
    li.className =
      "list-none px-3 py-2 cursor-pointer text-empress hover:text-woody-brown hover:underline";
    li.textContent = label;

    li.addEventListener("click", () => {
      setActiveTab(li);
      const filtered =
        label === "모두보기" ? [...allProducts] : filterFn(allProducts, label);
      onTabChange(filtered);
    });

    navEl.append(li);

    if (idx === 0) {
      setActiveTab(li);
    }
  });

  // 첫 번째 탭 기준 초기 렌더링
  const initial =
    tabs[0] === "모두보기" ? [...allProducts] : filterFn(allProducts, tabs[0]);
  onTabChange(initial);
}
