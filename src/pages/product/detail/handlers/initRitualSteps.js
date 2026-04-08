import { createProductCard } from "/src/components/ui/product-card.js";

// TODO: 리추얼 스텝 API 연동 후 하드코딩 제거
export function initRitualSteps() {
  const title = document.querySelector("#ritual-title");
  const description = document.querySelector("#ritual-description");

  title.textContent = "부드러운 손, 윤기나는 손톱";
  description.textContent = "이제 3단계 핸드 & 네일 리추얼을 경험해 보세요.";

  // TODO: API 연동 후 제거
  const products = [
    {
      name: "첫번째 제품명",
      size: "30 ml",
      originalPrice: 20000,
      discountRate: 20,
      discountPrice: 16000,
      image: `/src/assets/images/product1_0.webp`,
      imageAlt: "상품설명",
      isSelected: true,
    },
    {
      name: "두번째 제품명",
      size: "50 ml",
      originalPrice: 20000,
      discountRate: 20,
      discountPrice: 16000,
      image: `/src/assets/images/product1_1.webp`,
      imageAlt: "상품설명",
    },
    {
      name: "세번째 제품명",
      size: "75 ml",
      originalPrice: 20000,
      discountRate: 20,
      discountPrice: 16000,
      image: `/src/assets/images/product1_2.webp`,
      imageAlt: "상품설명",
    },
  ];

  const list = document.querySelector("#ritual-steps-list");
  products.forEach((product, index) => {
    const li = document.createElement("li");
    li.className = "flex-1 h-full";
    li.append(
      createProductCard({
        layout: "horizontal",
        badgeText: `${index + 1} 단계`,
        ...product,
      }),
    );
    list.append(li);
  });
}
