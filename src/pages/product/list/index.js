import { renderProductCards } from "/src/components/ui/product-card-list.js";
import { createTag } from "/src/components/ui/tag.js";
import { fetchProducts } from "/src/js/api/product/index.js";
import {
  setupProductTabs,
  toCardProps,
} from "/src/components/ui/productTabs.js";
import { createCategoryCard } from "/src/components/ui/categoryCard.js";

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

const TAB_KEYWORDS = {
  "시어 버터": ["시어"],
  아몬드: ["아몬드"],
  프래그런스: ["퍼퓸"],
};

function tabFilter(products, label) {
  const keywords = TAB_KEYWORDS[label];
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
    badgeType: product.badge ?? null,
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

  setupProductTabs({
    navEl: document.querySelector("#category-tabs"),
    tabs: ["시어 버터", "아몬드", "프래그런스"],
    allProducts,
    filterFn: tabFilter,
    onTabChange: renderProductCards,
  });
  setupProductTabs({
    navEl: document.querySelector("#category-tabs"),
    tabs: ["시어 버터", "아몬드", "프래그런스"],
    allProducts,
    filterFn: tabFilter,
    onTabChange: renderProductCards,
  });
}

init().catch((err) => console.error("초기화 실패:", err));

// ── 카테고리 별 만나보기 ──────────────────────────────────────────
const LIST_CATEGORIES = [
  {
    image: "/src/assets/images/list_handcream.webp",
    alt: "핸드 크림",
    label: "핸드 크림",
    liClass: "md:col-span-2 odd:pt-9 md:odd:pt-0",
  },
  {
    image: "/src/assets/images/list_handwash&soap.webp",
    alt: "핸드 워시 & 솝",
    label: "핸드 워시 & 솝",
    liClass: "md:col-span-2 odd:pt-9 md:odd:pt-0",
  },
  {
    image: "/src/assets/images/list_hand&nailcare.webp",
    alt: "핸드 & 네일 케어",
    label: "핸드 & 네일 케어",
    liClass: "md:col-span-2 odd:pt-9 md:odd:pt-0",
  },
  {
    image: "/src/assets/images/list_handcarerefill.webp",
    alt: "핸드 케어 리필",
    label: "핸드 케어 리필",
    liClass: "md:col-span-2 md:col-start-2 odd:pt-9 md:odd:pt-0",
  },
  {
    image: "/src/assets/images/list_handcaregift.webp",
    alt: "핸드 케어 기프트",
    label: "핸드 케어 기프트",
    liClass: "md:col-span-2 md:col-start-4 odd:pt-9 md:odd:pt-0",
  },
];

const listCategoryList = document.getElementById("list-category-list");
if (listCategoryList) {
  LIST_CATEGORIES.forEach((item) => {
    listCategoryList.append(createCategoryCard(item));
  });
}
