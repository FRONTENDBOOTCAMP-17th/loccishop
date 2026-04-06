import { createButton } from "/src/components/ui/button.js";
import { createBadge } from "/src/components/ui/badge.js";
import { createDrawer } from "/src/components/ui/drawer.js";
import { createProductCard } from "/src/components/ui/product-card.js";

// HTML 파일 로드해서 컨테이너에 삽입
async function loadHTML(selector, url) {
  const container = document.querySelector(selector);
  if (!container) {
    return;
  }
  const res = await fetch(url);
  container.innerHTML = await res.text();
}

// 배지 초기화
function initBadge() {
  const badge = createBadge({ type: "NEW" });
  document.querySelector("#badge").replaceWith(badge);
}

// 장바구니 버튼 초기화
function initCartButton() {
  const cartBtn = createButton({
    text: "장바구니에 추가",
    variant: "primary",
    size: "md",
    fullWidth: true,
  });
  document.querySelector("#cart-button").append(cartBtn);
}

// 드로어 초기화
function initDrawers() {
  const drawers = [
    {
      title: "사용 방법",
      btnId: "#howToUse",
      content: "<p>사용 방법 내용</p>",
    },
    {
      title: "원료",
      btnId: "#ingredients",
      content: "<p>원료 내용</p>",
    },
    {
      title: "상품정보 제공고시",
      btnId: "#productDisclosure",
      content: "<p>상품정보 내용</p>",
    },
  ];

  drawers.forEach(({ title, btnId, content }) => {
    const drawer = createDrawer({ title, position: "right" });
    drawer.content.innerHTML = content;
    document.querySelector(btnId).addEventListener("click", () => {
      drawer.open();
    });
  });
}

// 상품 카드
function initProductCard() {
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
      name: "세번째 제품명세번째 제품명세번째 세번째 제품명세번째 제품명세번째 제품명",
      size: "75 ml",
      originalPrice: 20000,
      discountRate: 20,
      discountPrice: 16000,
      image: `/src/assets/images/product1_2.webp`,
      imageAlt: "상품설명",
    },
  ];

  const list = document.getElementById("ritual-steps-list");

  products.forEach((product, index) => {
    const li = document.createElement("li");
    li.className = "h-full";
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

// 리뷰 더보기 버튼 초기화
function initMoreReviewButton() {
  const moreReviewBtn = createButton({
    text: "리뷰 더보기",
    variant: "outline",
    size: "sm",
    fullWidth: false,
  });
  moreReviewBtn.classList.add(
    "mt-5",
    "hover:bg-woody-brown",
    "hover:text-cararra",
  );
  const container = document.querySelector("#more-reviews-btn");
  if (container) {
    container.append(moreReviewBtn);
  } else {
    console.warn("#more-reviews-btn 요소가 존재하지 않습니다.");
  }
}

// 메인 초기화 — 각 함수 호출만 담당
async function initProductPage() {
  // detail-main 로드 → 배지, 장바구니 버튼 의존
  await loadHTML(
    "#detail-main",
    "/src/pages/product/detail/components/detail-main.html",
  );
  initBadge();
  initCartButton();

  // detail-info 로드 → 드로어 의존
  await loadHTML(
    "#product-info",
    "/src/pages/product/detail/components/detail-info.html",
  );
  initDrawers();

  //ritual-steps 로드 → 장바구니 버튼 의존
  await loadHTML(
    "#detail-ritual-steps",
    "/src/pages/product/detail/components/detail-ritual-steps.html",
  );
  initProductCard();

  // 리뷰 로드 → 더보기 버튼 의존
  await loadHTML(
    "#product-best-review",
    "/src/pages/product/detail/components/detail-best-review.html",
  );
  await loadHTML(
    "#detail-reviews",
    "/src/pages/product/detail/components/detail-review.html",
  );
  initMoreReviewButton();
}

document.addEventListener("DOMContentLoaded", initProductPage);
