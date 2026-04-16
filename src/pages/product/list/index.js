import { checkTokenValidity } from "/src/js/utils/checkTokenValidity.js";
import { renderProductCards } from "/src/components/ui/product-card-list.js";

checkTokenValidity();
import { createTag } from "/src/components/ui/tag.js";
import { fetchProducts, fetchCategories } from "/src/js/api/product/index.js";
import {
  setupProductTabs,
  toCardProps,
} from "/src/components/ui/productTabs.js";
import { createCategoryCard } from "/src/components/ui/categoryCard.js";
import handCareConfig from "./config/hand-care.js";
import bodyCareConfig from "./config/body-care.js";

const CONFIGS = {
  "hand-care": handCareConfig,
  "body-care": bodyCareConfig,
};

const slug = new URLSearchParams(location.search).get("slug") ?? "hand-care";
const config = CONFIGS[slug] ?? handCareConfig;

// 슬러그 맵
async function buildSlugMap() {
  try {
    const res = await fetchCategories();
    const cat = res?.find((c) => c.id === config.parentCategoryId);
    const parentSlug = config.parentSlug ?? cat?.slug;
    const map = parentSlug ? { [config.categoryTagLabels[0]]: parentSlug } : {};
    (cat?.children ?? []).forEach((child) => {
      map[child.name] = child.slug;
    });
    return map;
  } catch {
    return {};
  }
}

const slugMapPromise = buildSlugMap();

// 히어로
function initHero() {
  const hero = document.getElementById("list-hero");
  hero.style.backgroundImage = `url('${config.hero.image}')`;
  document.getElementById("list-hero-title").textContent = config.hero.title;
}

// 설명
function initDescription() {
  document.getElementById("list-desc-text").textContent = config.description;
}

// 카테고리 태그
async function initCategoryTags() {
  const slugMap = await slugMapPromise;
  const list = document.querySelector("#category-tag-list");

  config.categoryTagLabels.forEach((label) => {
    const li = document.createElement("li");
    const tag = createTag({ text: label });
    tag.className =
      "min-w-16 rounded px-2.5 py-1.5 text-sm text-center font-normal leading-5 cursor-pointer border border-empress text-woody-brown bg-spring-wood hover:bg-grey-96 transition-colors duration-200 whitespace-nowrap";

    const tagSlug = slugMap[label];
    if (tagSlug) {
      li.addEventListener("click", () => {
        location.href = `/src/pages/product/category/index.html?slug=${tagSlug}`;
      });
    }

    li.appendChild(tag);
    list.appendChild(li);
  });
}

// 컬렉션 제목
function initCollectionTitle() {
  document.getElementById("collection-title").textContent =
    config.collection.title;
}

// 상품 탭 & 목록
function tabFilter(products, label) {
  const keywords = config.collection.tabKeywords[label];
  if (!keywords) return products;
  const filtered = products.filter((p) =>
    keywords.some((kw) => p.name.toLowerCase().includes(kw.toLowerCase())),
  );
  return filtered.length ? filtered : products;
}

async function initProducts() {
  const ids = config.productCategoryIds ?? [config.productCategoryId];
  const results = await Promise.all(
    ids.map((id) => fetchProducts({ limit: 30, categoryId: id })),
  );
  const allProducts = results
    .flatMap((data) => data.products ?? [])
    .map(toCardProps);
  setupProductTabs({
    navEl: document.querySelector("#category-tabs"),
    tabs: config.collection.tabs,
    allProducts,
    filterFn: tabFilter,
    onTabChange: renderProductCards,
  });
}

// 대표 제품
function initFeatured() {
  const { featured } = config;
  const img = document.getElementById("featured-img");
  img.src = featured.image;
  img.alt = featured.alt;

  const title = document.getElementById("featured-title");
  title.textContent = featured.title;
  title.href = featured.href;

  document.getElementById("featured-desc").innerHTML = featured.descriptions
    .map((p) => `<p class="text-center">${p}</p>`)
    .join("<br />");

  document.getElementById("featured-link").href = featured.href;
}

// 리추얼 스텝─
function initRitual() {
  document.getElementById("ritual-title").textContent = config.ritual.title;

  config.ritual.steps.forEach((step, i) => {
    const n = i + 1;
    const img = document.getElementById(`step${n}-img`);
    img.src = step.image;
    img.alt = step.alt;
    document.getElementById(`step${n}-title`).textContent = step.title;
    document.getElementById(`step${n}-desc`).textContent = step.description;
  });
}

// 카테고리 카드
async function initCategoryCards() {
  const slugMap = await slugMapPromise;
  const list = document.getElementById("list-category-list");
  if (!list) return;

  config.categoryCards.forEach((item) => {
    const cardSlug = slugMap[item.label];
    const href = cardSlug
      ? `/src/pages/product/category/index.html?slug=${cardSlug}`
      : "/";
    list.append(createCategoryCard({ ...item, href }));
  });
}

// 초기화
initHero();
initDescription();
initCollectionTitle();
initFeatured();
initRitual();
initCategoryTags();
initProducts().catch((err) => console.error("상품 로드 실패:", err));
initCategoryCards();
