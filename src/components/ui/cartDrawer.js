// src/components/ui/cartDrawer.js
import { createDrawer } from "/src/components/ui/drawer.js";
import { createButton } from "/src/components/ui/button.js";
import { createImageSlider } from "/src/components/ui/imageSlider.js";
import { fetchRelatedProducts } from "/src/js/api/product/index.js";
import { addToCart } from "/src/js/api/cart/index.js";
import { updateCartBadge } from "/src/components/header/header.js";

async function createCartDrawerContent(product, drawer, titleEl, onAddRelated) {
  const wrapper = document.createElement("div");
  wrapper.className = "flex flex-col gap-6 h-full";

  const sliderItems = [
    {
      src: product.images?.[0] ?? product.images?.representative ?? "",
      alt: product.name,
      name: product.name,
      option: product.size ?? product.options?.[0]?.size ?? "",
      price: product.price,
      discountRate: product.discountRate ?? 0,
      discountPrice: product.discountPrice ?? product.price,
    },
  ];

  let currentSlider = createImageSlider(sliderItems);

  // 연관 상품
  const relatedSection = document.createElement("div");
  relatedSection.className = "flex flex-col gap-2";

  const relatedTitle = document.createElement("p");
  relatedTitle.className = "text-sm font-bold";
  relatedTitle.textContent = "관련 추천 제품";

  const relatedList = document.createElement("ul");
  relatedList.className = "flex flex-col gap-2";

  try {
    const { products: relatedProducts } = await fetchRelatedProducts(
      product.id,
      3,
    );

    relatedProducts.forEach((related) => {
      const li = document.createElement("li");
      li.className =
        "flex items-center gap-3 p-2 border border-gray-200 rounded-md";

      const relatedImg = document.createElement("img");
      relatedImg.src = related.images?.[0] ?? "";
      relatedImg.alt = related.name;
      relatedImg.className =
        "w-14 h-14 object-cover rounded-md bg-merino flex-shrink-0";

      const info = document.createElement("div");
      info.className = "flex flex-col flex-1 gap-1";

      const relatedName = document.createElement("p");
      relatedName.className = "text-xs font-medium line-clamp-1";
      relatedName.textContent = related.name;

      const relatedPrice = document.createElement("p");
      relatedPrice.className = "text-xs text-zambezi";
      relatedPrice.textContent = `${related.size ?? ""} · ₩${related.price.toLocaleString()}`;

      info.append(relatedName, relatedPrice);

      const addBtn = document.createElement("button");
      addBtn.type = "button";
      addBtn.className =
        "text-xs p-2 hover:bg-cararra rounded-md flex-shrink-0";
      addBtn.textContent = "🛒";

      addBtn.addEventListener("click", async () => {
        const result = await addToCart(related.id, 1);

        if (!result) {
          return;
        }

        await updateCartBadge();
        onAddRelated();

        // 슬라이더에 추가
        sliderItems.push({
          src: related.images?.[0] ?? "",
          alt: related.name,
          name: related.name,
          option: related.size ?? "",
          price: related.price,
          discountRate: related.discountRate ?? 0,
          discountPrice: related.discountPrice ?? related.price,
        });

        const newSlider = createImageSlider(sliderItems);
        currentSlider.replaceWith(newSlider);
        currentSlider = newSlider;
      });

      li.append(relatedImg, info, addBtn);
      relatedList.append(li);
    });
  } catch (e) {
    console.warn("연관 상품 로딩 실패", e);
  }

  relatedSection.append(relatedTitle, relatedList);

  // 하단 버튼
  const footer = document.createElement("div");
  footer.className =
    "flex flex-col gap-2 mt-auto pt-4 border-t border-gray-200";

  const cartPageBtn = createButton({
    text: "장바구니 보기",
    variant: "primary",
    size: "md",
    fullWidth: true,
  });
  cartPageBtn.addEventListener("click", () => {
    window.location.href = "/src/pages/cart/index.html";
  });

  const continueBtn = document.createElement("button");
  continueBtn.type = "button";
  continueBtn.className =
    "text-sm text-center underline hover:text-woody-brown";
  continueBtn.textContent = "쇼핑 계속하기";
  continueBtn.addEventListener("click", () => drawer.close());

  footer.append(cartPageBtn, continueBtn);
  wrapper.append(currentSlider, relatedSection, footer);

  return wrapper;
}

export async function openCartDrawer(product) {
  const result = await addToCart(product.id, 1);
  if (!result) return;

  await updateCartBadge();

  let drawerCount = 1; // ← 드로어 안에서 담은 수량 직접 관리

  const drawer = createDrawer({
    title: `장바구니에 추가 ${drawerCount}`,
    position: "right",
  });

  const content = await createCartDrawerContent(
    product,
    drawer,
    drawer.titleEl,
    () => {
      drawerCount++;
      drawer.titleEl.textContent = `장바구니에 추가 ${drawerCount}`;
    },
  );

  drawer.content.append(content);
  drawer.open();
}
