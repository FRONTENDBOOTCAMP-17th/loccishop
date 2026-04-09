import { fetchProduct } from "/src/js/api/product/index.js";
import { createButton } from "/src/components/ui/button.js";
import { createBadge } from "/src/components/ui/badge.js";
import { createDrawer } from "/src/components/ui/drawer.js";
import { renderProductMain } from "./handlers/renderProductMain.js";
import { initBestReview } from "./handlers/initBestReview.js";
import {
  initReviews,
  initSortButtons,
  initPagination,
  initFilterButton,
} from "./handlers/initReviews.js";
import { initRecommendedList } from "./handlers/initRecommendedList.js";
import { initRitualSteps } from "./handlers/initRitualSteps.js";
import { initProductEvents } from "./handlers/initProductEvents.js";
import { openCartDrawer } from "/src/components/ui/cartDrawer.js";

async function loadHTML(selector, url) {
  const container = document.querySelector(selector);
  if (!container) {
    return;
  }

  try {
    const res = await fetch(url);

    // 서버가 에러를 응답한 경우
    if (!res.ok) {
      throw new Error(`${url} 로드 실패 (${res.status})`);
    }

    container.innerHTML = await res.text();
  } catch (error) {
    // 네트워크 에러 또는 서버 에러
    console.error("HTML 로드 실패:", error);
    container.innerHTML = `
      <p class="text-sm text-zambezi text-center py-10">
        콘텐츠를 불러올 수 없습니다.
      </p>
    `;
  }
}

function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function initBadge() {
  const badge = createBadge({ type: "NEW" });
  document.querySelector("#badge").replaceWith(badge);
}

function initCartButton(product) {
  const cartBtn = createButton({
    text: "장바구니에 추가",
    variant: "primary",
    size: "md",
    fullWidth: true,
  });
  document.querySelector("#cart-button").append(cartBtn);

  cartBtn.addEventListener("click", () => openCartDrawer(product));
}

function initOptionButtons(options) {
  const optionType = document.querySelector("#options-title");
  const container = document.querySelector("#optionsBtn");

  if (!options || options.length === 0) {
    optionType.closest("section").classList.add("hidden");
    return;
  }

  optionType.textContent = "용량";

  options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "px-4 py-2.5 border border-empress rounded-sm text-sm";
    button.textContent = option.label;

    if (option.isCurrent) {
      button.classList.add("bg-ferra", "text-spring-wood");
    }

    button.addEventListener("click", () => {
      const baseURL = `/src/pages/product/detail/?id=`;
      window.location.href = baseURL + option.id;
    });

    container.append(button);
  });
}

function initDrawers(productInfo) {
  const drawers = [
    {
      title: "사용 방법",
      btnId: "#howToUse",
      content: `<p>${productInfo.howToUse}</p>`,
    },
    {
      title: "원료",
      btnId: "#ingredients",
      content: `<p>${productInfo.ingredients.fullIngredients}</p>`,
    },
    {
      title: "상품정보 제공고시",
      btnId: "#productDisclosure",
      content: `<p>${productInfo.productDisclosure}</p>`,
    },
  ];

  drawers.forEach(({ title, btnId, content }) => {
    const drawer = createDrawer({ title, position: "right" });
    drawer.content.innerHTML = content;
    document
      .querySelector(btnId)
      .addEventListener("click", () => drawer.open());
  });
}

async function initProductPage() {
  const id = getProductId();
  const product = await fetchProduct(id);

  await loadHTML("#detail-main", "components/detail-main.html");

  await Promise.all([
    loadHTML("#product-info", "components/detail-info.html"),
    loadHTML("#detail-ritual-steps", "components/detail-ritual-steps.html"),
    loadHTML("#detail-recommended", "components/detail-recommended.html"),
    loadHTML("#product-best-review", "components/detail-best-review.html"),
    loadHTML("#detail-reviews", "components/detail-review.html"),
  ]);

  renderProductMain(product);
  initBadge();
  initOptionButtons(product.options);
  initCartButton(product);

  document.querySelector("#description").textContent = product.description;

  initDrawers(product.productInfo);
  initRitualSteps(id);
  await initRecommendedList(id);
  await initBestReview(id);
  await initReviews(id);
  initPagination(id);
  initSortButtons(id);
  initProductEvents(id);
  initFilterButton(id);

  const scrollTo = sessionStorage.getItem("scrollTo");
  if (scrollTo) {
    sessionStorage.removeItem("scrollTo");
    document
      .querySelector(`#${scrollTo}`)
      ?.scrollIntoView({ behavior: "smooth" });
  }
}

document.addEventListener("DOMContentLoaded", initProductPage);
