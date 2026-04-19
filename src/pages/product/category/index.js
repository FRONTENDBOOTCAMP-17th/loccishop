import { checkTokenValidity } from "/src/js/utils/checkTokenValidity.js";
import { fetchCategories, fetchProducts } from "/src/js/api/product/index.js";

checkTokenValidity();
import { createProductCard } from "/src/components/ui/product-card.js";
import { createTag } from "/src/components/ui/tag.js";
import { createButton } from "/src/components/ui/button.js";

const params = new URLSearchParams(location.search);
const categorySlug = params.get("slug");

let currentPage = 1;
let hasMore = true;
const limit = 10;

let currentCategoryId = null;
let parentCategoryId = null;
let subCategoryIds = [];

const categoryTitle = document.getElementById("category-title");
const subCategoryTabs = document.getElementById("sub-category-tabs");
const productGrid = document.getElementById("product-grid");
const productCount = document.getElementById("product-count");
const sortSelect = document.getElementById("sort-select");

async function init() {
  const res = await fetchCategories();
  if (!res) return;

  let category = res.find((cat) => cat.slug === categorySlug);
  let isChild = false;

  if (!category) {
    for (const parent of res) {
      const child = parent.children?.find((sub) => sub.slug === categorySlug);
      if (child) {
        category = child;
        isChild = true;
        parentCategoryId = parent.id;
        break;
      }
    }
  }

  if (!category) return;

  if (isChild) {
    currentCategoryId = category.id;
    const parentCategory = res.find((cat) => cat.id === parentCategoryId);
    subCategoryIds = parentCategory.children.map((sub) => sub.id);

    categoryTitle.textContent = category.name;

    renderTabs(parentCategory.children, parentCategory.name, category.id);
  } else {
    parentCategoryId = category.id;
    currentCategoryId = category.id;
    subCategoryIds = category.children.map((sub) => sub.id);
    categoryTitle.textContent = category.name;
    renderTabs(category.children, category.name, null);
  }

  await fetchProductList();
}

function renderTabs(subCategories, parentName, activeId = null) {
  const allTab = createTab(
    { id: null, name: "전체" },
    activeId === null,
    parentName,
  );
  subCategoryTabs.appendChild(allTab);

  subCategories.forEach((sub) => {
    subCategoryTabs.appendChild(
      createTab(sub, sub.id === activeId, parentName),
    );
  });
}

function createTab(sub, isActive, parentName) {
  const li = document.createElement("li");
  const tag = createTag({
    text: sub.name,
    state: isActive ? "active" : "default",
  });
  li.appendChild(tag);

  li.addEventListener("click", () => {
    subCategoryTabs
      .querySelectorAll("button")
      .forEach((btn) => btn.setState("default"));
    li.querySelector("button").setState("active");

    currentCategoryId = sub.id ?? parentCategoryId;
    categoryTitle.textContent = sub.name ?? parentName;
    currentPage = 1;
    fetchProductList(1);
  });

  return li;
}

let allProductsCache = [];

async function fetchProductList(page = 1) {
  if (page === 1) {
    productGrid.innerHTML = "";

    if (currentCategoryId === parentCategoryId) {
      // 첫 페이지 먼저 가져와서 totalPages 확인
      const firstResults = await Promise.all(
        subCategoryIds.map((id) =>
          fetchProducts({
            categoryId: id,
            sort: sortSelect.value,
            page: 1,
            limit,
          }),
        ),
      );

      // 각 카테고리의 남은 페이지 다 가져오기
      const remainingResults = await Promise.all(
        subCategoryIds.flatMap((id, i) => {
          const totalPages = firstResults[i].meta?.pagination?.totalPages ?? 1;
          return Array.from({ length: totalPages - 1 }, (_, j) =>
            fetchProducts({
              categoryId: id,
              sort: sortSelect.value,
              page: j + 2,
              limit,
            }),
          );
        }),
      );

      allProductsCache = [
        ...firstResults.flatMap((r) => r.products),
        ...remainingResults.flatMap((r) => r.products),
      ];
    }
  }

  let products = [];
  let total = 0;

  if (currentCategoryId === parentCategoryId) {
    const start = (page - 1) * limit;
    products = allProductsCache.slice(start, start + limit);
    total = allProductsCache.length;
    hasMore = start + limit < total;
  } else {
    const res = await fetchProducts({
      categoryId: currentCategoryId,
      sort: sortSelect.value,
      page,
      limit,
    });
    if (!res) return;
    products = res.products;
    total = res.meta?.pagination?.total ?? products.length;
    hasMore =
      res.meta?.pagination?.currentPage < res.meta?.pagination?.totalPages;
  }

  productCount.textContent = `총 ${total} 개`;

  products.forEach((product) => {
    const card = createProductCard({
      id: product.id,
      image: product.images[0],
      name: product.name,
      originalPrice: product.price,
      discountRate: product.discountRate || null,
      discountPrice: product.discountPrice ?? null,
      badgeType: product.badge || null,
      isWished: product.isWished,
    });
    card.addEventListener("click", () => {
      window.location.href = `/product/detail?id=${product.id}`;
    });
    card.classList.add("cursor-pointer");
    productGrid.appendChild(card);
  });

  renderMoreBtn();
}

function renderMoreBtn() {
  document.getElementById("more-btn-wrap")?.remove();
  if (!hasMore) return;

  const wrap = document.createElement("div");
  wrap.id = "more-btn-wrap";
  wrap.className = "flex justify-center mt-8";

  const btn = createButton({ text: "더보기", variant: "outline", size: "sm" });
  btn.addEventListener("click", () => {
    currentPage++;
    fetchProductList(currentPage);
  });

  wrap.append(btn);
  productGrid.parentElement.append(wrap);
}

sortSelect.addEventListener("change", () => {
  currentPage = 1;
  fetchProductList(1);
});

init();
