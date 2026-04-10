import { renderProductCards } from "/src/components/ui/product-card-list.js";
import { createTag } from "/src/components/ui/tag.js";

const categories = [
  '핸드 케어 전체 보기',
  '핸드 크림',
  '핸드 워시 & 솝',
  '핸드 & 네일 케어',
  '핸드 케어 리필',
  '핸드 케어 기프트 세트',
];

const categoryTagList = document.querySelector('#category-tag-list');

categories.forEach((category) => {
  const li = document.createElement('li');
  const tag = createTag({ text: category });
  tag.className =
    'min-w-16 rounded px-2.5 py-1.5 text-sm text-center font-normal leading-5 cursor-pointer border border-empress text-woody-brown bg-spring-wood hover:bg-grey-96 transition-colors duration-200 whitespace-nowrap';

  li.appendChild(tag);
  categoryTagList.appendChild(li);
});

const productDataList = [
  {
    image: "/src/assets/images/product1_0.webp",
    imageAlt: "시어 버터 핸드 크림 30ml",
    badgeType: "NEW",
    size: "30 ml",
    name: "시어 버터 핸드 크림 (카리테 콩포르)",
    originalPrice: 17000,
    discountRate: 50,
    discountPrice: 8500,
    isWished: true,
  },
  {
    image: "/src/assets/images/product1_0.webp",
    imageAlt: "시어 버터 핸드 크림 75ml",
    badgeType: "NEW",
    size: "75 ml",
    name: "시어 버터 핸드 크림 (카리테 콩포르)",
    originalPrice: 29000,
    discountRate: null,
    discountPrice: null,
    isWished: false,
  },
  {
    image: "/src/assets/images/product1_0.webp",
    imageAlt: "시어 버터 핸드 크림 150ml",
    badgeType: "NEW",
    size: "150 ml",
    name: "시어 버터 핸드 크림 (카리테 콩포르)",
    originalPrice: 42000,
    discountRate: null,
    discountPrice: null,
    isWished: false,
  },
  {
    image: "/src/assets/images/product1_0.webp",
    imageAlt: "시어 버터 핸드 크림 150ml",
    badgeType: "NEW",
    size: "150 ml",
    name: "시어 버터 핸드 크림 (카리테 콩포르)",
    originalPrice: 42000,
    discountRate: null,
    discountPrice: null,
    isWished: false,
  },
  {
    image: "/src/assets/images/product1_0.webp",
    imageAlt: "시어 버터 핸드 크림 150ml",
    badgeType: "NEW",
    size: "150 ml",
    name: "시어 버터 핸드 크림 (카리테 콩포르)",
    originalPrice: 42000,
    discountRate: null,
    discountPrice: null,
    isWished: false,
  },
  {
    image: "/src/assets/images/product1_0.webp",
    imageAlt: "시어 버터 핸드 크림 150ml",
    badgeType: "NEW",
    size: "150 ml",
    name: "시어 버터 핸드 크림 (카리테 콩포르)",
    originalPrice: 42000,
    discountRate: null,
    discountPrice: null,
    isWished: false,
  },
];

const productDataByCategory = {
  shea: productDataList,
  almond: productDataList,
  fragrance: productDataList,
};

const tabs = document.querySelectorAll("#category-tabs li");

function setActiveTab(activeTab) {
  tabs.forEach((tab) => {
    tab.classList.remove("text-woody-brown", "underline");
    tab.classList.add("text-empress");
  });
  activeTab.classList.remove("text-empress");
  activeTab.classList.add("text-woody-brown", "underline");
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setActiveTab(tab);
    renderProductCards(productDataByCategory[tab.dataset.category]);
  });
});

// 초기 상태: 시어 버터 탭 활성화
setActiveTab(tabs[0]);
renderProductCards(productDataByCategory.shea);
