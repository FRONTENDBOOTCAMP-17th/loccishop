import { fetchWishList, toggleIsWished } from "/src/js/api/wishlist/index.js";

const LIMIT = 10;
let currentPage = 1;
let total = 0;

const loadMoreBtn = document.createElement("button");
loadMoreBtn.type = "button";
loadMoreBtn.className =
  "mt-16 mx-auto block border border-dark-woody px-12 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-dark-woody hover:text-white transition-all";
loadMoreBtn.textContent = "더보기";

async function loadItems() {
  const wishContainer = document.getElementById("wishlist-container");
  if (!wishContainer) return;
  try {
    const res = await fetchWishList(currentPage, LIMIT);
    const items = res.items ?? [];
    total = res.total ?? 0;

    if (total === 0 && currentPage === 1) {
      wishContainer.innerHTML = `
        <p class="text-center text-empress text-sm py-20">위시리스트에 담긴 상품이 없습니다.</p>
      `;
      return;
    }

    renderItems(items);

    const loaded = wishContainer.querySelectorAll("li").length;
    if (loaded < total) {
      wishContainer.after(loadMoreBtn);
    } else {
      loadMoreBtn.remove();
    }
  } catch (e) {
    console.error("위시리스트 로딩 오류:", e);
    wishContainer.innerHTML = `
      <p class="text-center text-empress text-sm py-20">데이터를 불러오는 중 오류가 발생했습니다.</p>
    `;
  }
}

function renderItems(items) {
  const wishContainer = document.getElementById("wishlist-container"); // 여기도
  if (!wishContainer) return;

  if (currentPage === 1) {
    wishContainer.innerHTML = `
      <p class="text-sm text-empress mb-6" id="wish-count">${total}개의 상품</p>
      <ul class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4" id="wish-list"></ul>
    `;
  }

  const ul = wishContainer.querySelector("#wish-list");
  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const discountRate = item.discountPrice
      ? Math.round(((item.price - item.discountPrice) / item.price) * 100)
      : 0;

    const li = document.createElement("li");
    li.className = "relative flex flex-col";

    li.innerHTML = `
      <a href="/product/detail/?id=${item.productId}" class="block">
        <div class="relative aspect-[4/5] overflow-hidden bg-gray-50">
          <img src="${item.thumbnailUrl}" alt="${item.name}" class="w-full h-full object-cover" />
          ${!item.isInStock ? `<div class="absolute inset-0 bg-black/40 flex items-center justify-center"><span class="text-white text-xs">품절</span></div>` : ""}
        </div>
        <div class="mt-3 space-y-1">
          <p class="text-sm text-woody-brown line-clamp-2">${item.name}</p>
          <div class="flex items-center gap-2">
            ${
              discountRate > 0
                ? `<span class="text-xs text-empress line-through">${item.price.toLocaleString()}원</span>
                  <span class="text-sm font-semibold text-woody-brown">${item.discountPrice.toLocaleString()}원</span>`
                : `<span class="text-sm font-semibold text-woody-brown">${item.price.toLocaleString()}원</span>`
            }
          </div>
        </div>
      </a>
      <button type="button" class="btn-remove-wish absolute top-2 right-2" data-id="${item.productId}" aria-label="위시리스트 삭제">
        <img src="/src/assets/icon/heart.svg" alt="찜 취소" class="w-6 h-6" />
      </button>
    `;

    li.querySelector(".btn-remove-wish").addEventListener("click", async () => {
      if (confirm("위시리스트에서 삭제하시겠습니까?")) {
        await toggleIsWished(item.productId);
        li.remove();
        total--;
        const countEl = document.getElementById("wish-count");
        if (countEl) countEl.textContent = `${total}개의 상품`;
        if (wishContainer.querySelectorAll("li").length === 0) {
          wishContainer.innerHTML = `<p class="text-center text-empress text-sm py-20">위시리스트에 담긴 상품이 없습니다.</p>`;
          loadMoreBtn.remove();
        }
      }
    });

    fragment.appendChild(li);
  });

  ul.appendChild(fragment);
}

loadMoreBtn.addEventListener("click", () => {
  currentPage++;
  loadItems();
});

loadItems();
