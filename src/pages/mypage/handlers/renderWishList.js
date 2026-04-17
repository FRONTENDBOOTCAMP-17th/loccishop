import { getWishTemplate } from "/src/pages/mypage/components/myWishTemplate.js";
import { fetchWishList, toggleIsWished } from "/src/js/api/wishlist/index.js";

export async function renderWishList() {
  const container = document.querySelector("#mypage-content");
  if (!container) return;

  container.innerHTML = getWishTemplate();

  const wishContainer = document.querySelector("#wish-list-container");
  const wishEmpty = document.querySelector("#wish-empty");
  const wishCount = document.querySelector("#wish-count");

  let currentPage = 1;
  const LIMIT = 10;
  let total = 0;

  // 더보기 버튼 생성
  const loadMoreBtn = document.createElement("button");
  loadMoreBtn.type = "button";
  loadMoreBtn.className =
    "mt-16 mx-auto block border border-dark-woody px-12 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-dark-woody hover:text-white transition-all";
  loadMoreBtn.textContent = "더보기";

  async function loadItems() {
    try {
      const res = await fetchWishList(currentPage, LIMIT);
      const items = res.items ?? [];
      total = res.total ?? 0;

      wishCount.textContent = `${total} items`;

      if (total === 0) {
        wishEmpty.classList.remove("hidden");
        return;
      }

      renderItems(items);

      // 더보기 버튼 표시 여부
      const loaded = wishContainer.querySelectorAll("li").length;
      if (loaded < total) {
        wishContainer.after(loadMoreBtn);
      } else {
        loadMoreBtn.remove();
      }
    } catch (e) {
      console.error("위시리스트 로딩 오류:", e);
      wishContainer.innerHTML = `<p class="text-sm text-empress">데이터를 불러오는 중 오류가 발생했습니다.</p>`;
    }
  }

  function renderItems(items) {
    const fragment = document.createDocumentFragment();

    items.forEach((item) => {
      const li = document.createElement("li");

      const article = document.createElement("article");
      article.className = "flex flex-col gap-3 group cursor-pointer";
      article.addEventListener("click", (e) => {
        if (e.target.closest(".wish-remove-btn")) return;
        window.location.href = `/product/detail/?id=${item.productId}`;
      });

      const figure = document.createElement("figure");
      figure.className = "relative overflow-hidden m-0";

      const img = document.createElement("img");
      img.src = item.thumbnailUrl;
      img.alt = item.name;
      img.className = "w-full aspect-[3/4] object-cover bg-cararra";

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className =
        "wish-remove-btn absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white transition-colors";
      removeBtn.setAttribute("aria-label", `${item.name} 위시리스트에서 삭제`);
      removeBtn.textContent = "✕";
      removeBtn.addEventListener("click", async () => {
        try {
          await toggleIsWished(item.productId);
          li.remove();

          const remaining = wishContainer.querySelectorAll("li").length;
          total--;
          wishCount.textContent = `${total} items`;

          if (remaining === 0) {
            wishEmpty.classList.remove("hidden");
            loadMoreBtn.remove();
          }
        } catch (e) {
          console.error("위시리스트 삭제 오류:", e);
        }
      });

      figure.append(img, removeBtn);

      const info = document.createElement("div");
      info.className = "flex flex-col gap-1";

      const name = document.createElement("h3");
      name.className = "text-sm font-medium text-dark-woody leading-snug";
      name.textContent = item.name;

      const price = document.createElement("p");
      price.className = "text-sm text-empress";
      price.textContent = `${item.price.toLocaleString()}원`;

      info.append(name, price);

      if (!item.isInStock) {
        const soldOut = document.createElement("p");
        soldOut.className = "text-[10px] text-ferra uppercase tracking-widest";
        soldOut.textContent = "품절";
        info.append(soldOut);
      }

      article.append(figure, info);
      li.append(article);
      fragment.appendChild(li);
    });

    wishContainer.appendChild(fragment);
  }

  loadMoreBtn.addEventListener("click", () => {
    currentPage++;
    loadItems();
  });

  loadItems();
}
