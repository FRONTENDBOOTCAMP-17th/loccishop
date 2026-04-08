import "/src/styles/style.css";
import { createProductCard } from "/src/components/ui/product-card.js";

const almondProducts = [
  {
    image: "/src/assets/images/product1.png",
    imageAlt: "아몬드 소프트닝 샤워 오일",
    badgeType: null,
    size: "500 ml",
    name: "아몬드 소프트닝 샤워 오일",
    originalPrice: 73000,
    discountRate: 10,
    discountPrice: 66000,
    isWished: false,
  },
  {
    image: "/src/assets/images/product2.png",
    imageAlt: "아몬드 슈퍼 익스트랙트",
    badgeType: "new",
    size: "200 ml",
    name: "아몬드 슈퍼 익스트랙트",
    originalPrice: 110000,
    discountRate: 11,
    discountPrice: 98000,
    isWished: false,
  },
  {
    image: "/src/assets/images/product3.png",
    imageAlt: "아몬드 밀크 컨센트레이트",
    badgeType: null,
    size: "200 ml",
    name: "아몬드 밀크 컨센트레이트",
    originalPrice: 88000,
    discountRate: 5,
    discountPrice: 83600,
    isWished: false,
  },
  {
    image: "/src/assets/images/product4.png",
    imageAlt: "아몬드 핸드크림",
    badgeType: "best",
    size: "75 ml",
    name: "아몬드 핸드크림",
    originalPrice: 32000,
    discountRate: 0,
    discountPrice: 32000,
    isWished: true,
  },
];

const giftProducts = [
  {
    image: "/src/assets/images/gift1.png",
    imageAlt: "손 세정제 & 핸드크림 트리오 세트",
    badgeType: null,
    size: "",
    name: "손 세정제 & 핸드크림 트리오 세트",
    originalPrice: 45000,
    discountRate: 13,
    discountPrice: 39000,
    isWished: false,
  },
  {
    image: "/src/assets/images/gift2.png",
    imageAlt: "버베나 솝 트리오 세트",
    badgeType: null,
    size: "",
    name: "버베나 솝 트리오 세트",
    originalPrice: 30000,
    discountRate: 13,
    discountPrice: 26000,
    isWished: false,
  },
  {
    image: "/src/assets/images/gift3.png",
    imageAlt: "세이보리 핸드크림 트리오 세트",
    badgeType: "best",
    size: "",
    name: "세이보리 핸드크림 트리오 세트",
    originalPrice: 50000,
    discountRate: 10,
    discountPrice: 45000,
    isWished: false,
  },
  {
    image: "/src/assets/images/gift4.png",
    imageAlt: "로즈 ET 리엔 기프트 세트",
    badgeType: null,
    size: "",
    name: "로즈 ET 리엔 기프트 세트",
    originalPrice: 60000,
    discountRate: 13,
    discountPrice: 52000,
    isWished: false,
  },
  {
    image: "/src/assets/images/gift5.png",
    imageAlt: "아몬드 미니어처 기프트 세트",
    badgeType: "new",
    size: "",
    name: "아몬드 미니어처 기프트 세트",
    originalPrice: 42000,
    discountRate: 10,
    discountPrice: 38000,
    isWished: false,
  },
];

// 렌더링 함수를 하나로 깔끔하게 정리 (재사용성)
function renderProducts(products, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // 기존에 들어있을지 모르는 중복 요소들을 비우고 시작
  container.innerHTML = "";

  products.forEach((product) => {
    const li = document.createElement("li");
    li.append(createProductCard(product));
    container.append(li);
  });
}

// 실행
renderProducts(almondProducts, "almond-grid");
renderProducts(giftProducts, "gift-grid");
