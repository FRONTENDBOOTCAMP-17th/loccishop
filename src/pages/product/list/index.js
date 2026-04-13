import { renderProductCards } from "/src/components/ui/product-card-list.js";
import { createTag } from "/src/components/ui/tag.js";
import { fetchProducts } from "/src/js/api/product/index.js";

const categories = [
  "핸드 케어 전체 보기",
  "핸드 크림",
  "핸드 워시 & 솝",
  "핸드 & 네일 케어",
  "핸드 케어 리필",
  "핸드 케어 기프트 세트",
];

const categoryTagList = document.querySelector("#category-tag-list");

categories.forEach((category) => {
  const li = document.createElement("li");
  const tag = createTag({ text: category });
  tag.className =
    "min-w-16 rounded px-2.5 py-1.5 text-sm text-center font-normal leading-5 cursor-pointer border border-empress text-woody-brown bg-spring-wood hover:bg-grey-96 transition-colors duration-200 whitespace-nowrap";
  li.appendChild(tag);
  categoryTagList.appendChild(li);
});

const tabs = document.querySelectorAll("#category-tabs li");

function setActiveTab(activeTab) {
  tabs.forEach((tab) => {
    tab.classList.remove("text-woody-brown", "underline");
    tab.classList.add("text-empress");
  });
  activeTab.classList.remove("text-empress");
  activeTab.classList.add("text-woody-brown", "underline");
}

const TAB_KEYWORDS = {
  shea: ["시어"],
  almond: ["아몬드"],
  fragrance: ["퍼퓸"],
};

function filterByTab(products, category) {
  const keywords = TAB_KEYWORDS[category];
  if (!keywords) {
    return products;
  }
  const filtered = products.filter((p) =>
    keywords.some((kw) => p.name.toLowerCase().includes(kw.toLowerCase())),
  );
  return filtered.length ? filtered : products;
}

function toCardProps(product) {
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

async function init() {
  const data = await fetchProducts({ limit: 30 });
  const allProducts = (data.products ?? []).map(toCardProps);

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setActiveTab(tab);
      renderProductCards(filterByTab(allProducts, tab.dataset.category));
    });
  });

  setActiveTab(tabs[0]);
  renderProductCards(filterByTab(allProducts, "shea"));
}

init().catch((err) => console.error("초기화 실패:", err));
