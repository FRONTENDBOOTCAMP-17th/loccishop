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
  const res = await fetch(url);
  container.innerHTML = await res.text();
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

function intiOptionButtons(options) {
  const optionType = document.querySelector("#options-title");
  const container = document.querySelector("#optionsBtn");
  optionType.textContent = "용량";

  options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "px-4 py-2.5 border border-empress rounded-sm text-sm";
    button.textContent = option.size;

    if (index === 0) {
      button.classList.add("bg-ferra", "text-spring-wood");
    }

    button.addEventListener("click", () => {
      container.querySelectorAll("button").forEach((btn) => {
        btn.classList.remove("bg-ferra", "text-spring-wood");
      });
      button.classList.add("bg-ferra", "text-spring-wood");
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

  await loadHTML(
    "#detail-main",
    "/src/pages/product/detail/components/detail-main.html",
  );
  renderProductMain(product);
  initBadge();
  intiOptionButtons(product.options);
  initCartButton(product);

  await loadHTML(
    "#product-info",
    "/src/pages/product/detail/components/detail-info.html",
  );
  document.querySelector("#description").textContent = product.description;
  initDrawers(product.productInfo);

  await loadHTML(
    "#detail-ritual-steps",
    "/src/pages/product/detail/components/detail-ritual-steps.html",
  );
  initRitualSteps();

  await loadHTML(
    "#detail-recommended",
    "/src/pages/product/detail/components/detail-recommended.html",
  );
  await initRecommendedList(id);

  await loadHTML(
    "#product-best-review",
    "/src/pages/product/detail/components/detail-best-review.html",
  );
  await initBestReview(id);

  await loadHTML(
    "#detail-reviews",
    "/src/pages/product/detail/components/detail-review.html",
  );
  await initReviews(id);
  initPagination(id);
  initSortButtons(id);
  initProductEvents(id);
  initFilterButton(id);
}

document.addEventListener("DOMContentLoaded", initProductPage);
