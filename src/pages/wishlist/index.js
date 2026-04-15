import { fetchWishList, toggleIsWished } from "/src/js/api/wishlist/index.js";

async function init() {
  const main = document.querySelector("main");

  main.innerHTML = `
    <section class="border-t border-gray-200">
      <div class="max-w-360 mx-auto px-4 md:px-10">
        <h1 class="text-[22px] font-semibold text-center text-woody-brown py-6 border-b border-gray-200">
          위시리스트
        </h1>
        <div id="wishlist-container" class="py-8"></div>
      </div>
    </section>
  `;

  renderWishlist();
}

async function renderWishlist() {
  const container = document.getElementById("wishlist-container");

  const data = await fetchWishList();
  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  if (items.length === 0) {
    container.innerHTML = `
      <p class="text-center text-empress text-sm py-20">위시리스트에 담긴 상품이 없습니다.</p>
    `;
    return;
  }

  container.innerHTML = `
    <p class="text-sm text-empress mb-6">${total}개의 상품</p>
    <ul class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      ${items.map((item) => createWishlistItem(item)).join("")}
    </ul>
  `;

  container.querySelectorAll(".btn-remove-wish").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const productId = btn.dataset.id;
      if (confirm("위시리스트에서 삭제하시겠습니까?")) {
        await toggleIsWished(productId);
      }

      renderWishlist();
    });
  });
}

function createWishlistItem(item) {
  const discountRate = item.discountPrice
    ? Math.round(((item.price - item.discountPrice) / item.price) * 100)
    : 0;

  return `
    <li class="relative flex flex-col">
      <a href="/src/pages/product/detail/?id=${item.productId}" class="block">
        <div class="relative aspect-[4/5] overflow-hidden bg-gray-50">
          <img
            src="${item.thumbnailUrl}"
            alt="${item.name}"
            class="w-full h-full object-cover"
          />
          ${!item.isInStock ? `<div class="absolute inset-0 bg-black/40 flex items-center justify-center"><span class="text-white text-xs">품절</span></div>` : ""}
        </div>
        <div class="mt-3 space-y-1">
          <p class="text-sm text-woody-brown line-clamp-2">${item.name}</p>
          <div class="flex items-center gap-2">
            ${
              discountRate > 0
                ? `<span class="text-xs text-empress line-through">${item.price.toLocaleString()}원</span>
                <span class="text-sm font-semibold text-woody-brown">${item.discountPrice.toLocaleString()}원</span>
                `
                : `<span class="text-sm font-semibold text-woody-brown">${item.price.toLocaleString()}원</span>`
            }
          </div>
        </div>
      </a>
      <button
        type="button"
        class="btn-remove-wish absolute top-2 right-2"
        data-id="${item.productId}"
        aria-label="위시리스트 삭제"
      >
        <img src="/src/assets/icon/heart.svg" alt="찜 취소" class="w-6 h-6" />
      </button>
    </li>
  `;
}

init();
