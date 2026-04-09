import "/src/styles/style.css";
import { renderHeader } from "/src/components/header/header.js";
import { renderFooter } from "/src/components/footer/footer.js";
import { fetchProducts } from "/src/js/api/product/index.js";

// ── 헤더 / 푸터 마운트 ────────────────────────────────────────────
const headerAnchor = document.getElementById("header");
const footerAnchor = document.getElementById("footer");
if (headerAnchor) headerAnchor.replaceWith(renderHeader());
if (footerAnchor) footerAnchor.replaceWith(renderFooter());

// ── 햄버거 드로어 ─────────────────────────────────────────────────
const drawer = document.getElementById("drawer");
const drawerOverlay = document.getElementById("drawer-overlay");
const hamburgerBtn = document.querySelector(".hamburger-btn");
const menuCloseBtn = document.getElementById("menu-close");

function openDrawer() {
  if (!drawer) return;
  drawer.classList.remove("translate-x-full");
  drawerOverlay?.classList.remove("opacity-0", "pointer-events-none");
  drawerOverlay?.classList.add("opacity-100");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  if (!drawer) return;
  drawer.classList.add("translate-x-full");
  drawerOverlay?.classList.add("opacity-0", "pointer-events-none");
  drawerOverlay?.classList.remove("opacity-100");
  document.body.style.overflow = "";
}

hamburgerBtn?.addEventListener("click", openDrawer);
menuCloseBtn?.addEventListener("click", closeDrawer);
drawerOverlay?.addEventListener("click", closeDrawer);

// ── 베스트셀러 캐러셀 ─────────────────────────────────────────────
const VISIBLE_COUNT = 4;
let offset = 0;
let allProducts = [];

function formatPrice(price) {
  return `₩${price.toLocaleString("ko-KR")}`;
}

function renderBestsellerCards() {
  const track = document.getElementById("bestseller-track");
  if (!track) return;

  track.innerHTML = "";

  const visible = allProducts.slice(offset, offset + VISIBLE_COUNT);
  visible.forEach((product) => {
    const li = document.createElement("li");
    li.className = "flex-shrink-0 w-[calc(25%-12px)] min-w-[180px]";
    li.innerHTML = `
      <div class="relative group">
        <div class="relative overflow-hidden bg-merino aspect-square">
          <img
            src="${product.images?.[0] ?? ""}"
            alt="${product.name}"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button
            type="button"
            class="absolute top-2 right-2 p-1"
            aria-label="위시리스트에 추가"
          >
            <img src="/src/assets/icon/heart-empty.svg" alt="" class="w-5 h-5" />
          </button>
        </div>
        <div class="pt-3 pb-4">
          <p class="text-[11px] text-empress mb-1 truncate">${product.category?.name ?? ""}</p>
          <p class="text-sm font-semibold text-woody-brown leading-snug line-clamp-2 mb-1">${product.name}</p>
          <p class="text-[11px] text-abbey mb-2">${product.size ?? ""}</p>
          <p class="text-sm font-bold text-woody-brown">${formatPrice(product.discountPrice ?? product.price)}</p>
          ${product.discountRate ? `<p class="text-[11px] text-empress line-through">${formatPrice(product.price)}</p>` : ""}
        </div>
        <button
          type="button"
          class="absolute bottom-4 right-0 flex items-center justify-center"
          aria-label="장바구니 추가"
        >
          <img src="/src/assets/icon/cart.svg" alt="" class="w-5 h-5" />
        </button>
      </div>
    `;
    track.appendChild(li);
  });

  // 화살표 표시/숨김
  const prevBtn = document.getElementById("bestseller-prev");
  const nextBtn = document.getElementById("bestseller-next");
  if (prevBtn) prevBtn.classList.toggle("hidden", offset === 0);
  if (nextBtn) nextBtn.classList.toggle("hidden", offset + VISIBLE_COUNT >= allProducts.length);
}

async function initBestseller() {
  try {
    const data = await fetchProducts({ limit: 8 });
    allProducts = data.products ?? [];
  } catch (err) {
    console.error("베스트셀러 로드 실패:", err);
    allProducts = [];
  }
  renderBestsellerCards();
}

document.getElementById("bestseller-prev")?.addEventListener("click", () => {
  offset = Math.max(0, offset - VISIBLE_COUNT);
  renderBestsellerCards();
});
document.getElementById("bestseller-next")?.addEventListener("click", () => {
  if (offset + VISIBLE_COUNT < allProducts.length) {
    offset += VISIBLE_COUNT;
    renderBestsellerCards();
  }
});

initBestseller().catch(console.error);
