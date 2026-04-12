import { fetchProducts } from "/src/js/api/product/index.js";
import { createProductCard } from "/src/components/ui/product-card.js";

// ── 베스트셀러 캐러셀 ─────────────────────────────────────────────
const VISIBLE_COUNT = 4;
let offset = 0;
let allProducts = [];

function toCardProps(product) {
  return {
    id: product._id,
    image: product.images?.[0] ?? "",
    imageAlt: product.name,
    badgeType: product.badge?.toLowerCase() ?? null,
    name: product.name,
    size: product.size,
    originalPrice: product.price,
    discountRate: product.discountRate ?? null,
    discountPrice: product.discountPrice ?? null,
    isWished: product.isWished ?? false,
  };
}

function renderBestsellerCards() {
  const track = document.getElementById("bestseller-track");
  if (!track) return;

  track.innerHTML = "";

  const visible = allProducts.slice(offset, offset + VISIBLE_COUNT);
  visible.forEach((product) => {
    const li = document.createElement("li");
    li.className = "flex-shrink-0 w-[calc(25%-12px)] min-w-[180px]";
    li.append(createProductCard(toCardProps(product)));
    track.appendChild(li);
  });

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
