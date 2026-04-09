import { renderProductCards } from "/src/components/ui/product-card-list.js";

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
