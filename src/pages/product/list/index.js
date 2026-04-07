import { createProductCard } from "/src/components/ui/product-card.js";

const productDataList = [
  {
    image: "/src/assets/images/product1_0.webp",
    imageAlt: "시어 버터 핸드 크림 30ml",
    badgeType: "NEW",
    size: "30 ml",
    name: "시어 버터 핸드 크림 (카리테 콩포르)",
    originalPrice: 17000,
    discountRate: 50,
    isWished: false,
  },
  {
    image: "/src/assets/images/product1_0.webp",
    imageAlt: "시어 버터 핸드 크림 75ml",
    badgeType: "NEW",
    size: "75 ml",
    name: "시어 버터 핸드 크림 (카리테 콩포르)",
    originalPrice: 29000,
    discountRate: 0,
    discountPrice: 29000,
    isWished: false,
  },
  {
    image: "/src/assets/images/product1_0.webp",
    imageAlt: "시어 버터 핸드 크림 150ml",
    badgeType: "NEW",
    size: "150 ml",
    name: "시어 버터 핸드 크림 (카리테 콩포르)",
    originalPrice: 42000,
    discountRate: 0,
    discountPrice: 42000,
    isWished: false,
  },
  {
    image: "/src/assets/images/product1_0.webp",
    imageAlt: "시어 버터 핸드 크림 150ml",
    badgeType: "NEW",
    size: "150 ml",
    name: "시어 버터 핸드 크림 (카리테 콩포르)",
    originalPrice: 42000,
    discountRate: 0,
    discountPrice: 42000,
    isWished: false,
  },
  {
    image: "/src/assets/images/product1_0.webp",
    imageAlt: "시어 버터 핸드 크림 150ml",
    badgeType: "NEW",
    size: "150 ml",
    name: "시어 버터 핸드 크림 (카리테 콩포르)",
    originalPrice: 42000,
    discountRate: 0,
    discountPrice: 42000,
    isWished: false,
  },
  {
    image: "/src/assets/images/product1_0.webp",
    imageAlt: "시어 버터 핸드 크림 150ml",
    badgeType: "NEW",
    size: "150 ml",
    name: "시어 버터 핸드 크림 (카리테 콩포르)",
    originalPrice: 42000,
    discountRate: 0,
    discountPrice: 42000,
    isWished: false,
  },
];

const container = document.querySelector("#product-list-container");

function renderProductCards(products) {
  if (!container) return;

  container.innerHTML = "";

  products.forEach((product) => {
    const cardElement = createProductCard(product);

    container.appendChild(cardElement);
  });
}

renderProductCards(productDataList);
