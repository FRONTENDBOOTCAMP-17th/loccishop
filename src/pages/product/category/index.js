import { fetchCategories, fetchProducts } from "/src/js/api/product/index.js";
import { createProductCard } from "/src/components/ui/product-card.js";
import { createTag } from "/src/components/ui/tag.js";

const params = new URLSearchParams(location.search);
const categorySlug = params.get("slug");

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

  const category = res.find((cat) => cat.slug === categorySlug);
  if (!category) return;

  parentCategoryId = category.id;
  currentCategoryId = category.id;
  subCategoryIds = category.children.map((sub) => sub.id);

  categoryTitle.textContent = category.name;
  renderTabs(category.children, category.name);
  await fetchProductList();
}

function renderTabs(subCategories) {
  const allTab = createTab({ id: null, name: "전체" }, true);
  subCategoryTabs.appendChild(allTab);

  subCategories.forEach((sub) => {
    subCategoryTabs.appendChild(createTab(sub, false));
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
    fetchProductList();
  });

  return li;
}

async function fetchProductList() {
  productGrid.innerHTML = "";

  let products = [];

  if (currentCategoryId === parentCategoryId) {
    const results = await Promise.all(
      subCategoryIds.map((id) =>
        fetchProducts({ categoryId: id, sort: sortSelect.value }),
      ),
    );
    products = results.flatMap((res) => res.products);
  } else {
    const res = await fetchProducts({
      categoryId: currentCategoryId,
      sort: sortSelect.value,
    });
    if (!res) return;
    products = res.products;
  }

  productCount.textContent = `총 ${products.length} 개`;

  products.forEach((product) => {
    productGrid.appendChild(
      createProductCard({
        id: product.id,
        image: product.images[0],
        name: product.name,
        originalPrice: product.price,
        discountRate: product.discountRate || null,
        badgeType: product.badge || null,
        isWished: product.isWished,
      }),
    );
  });
}

sortSelect.addEventListener("change", fetchProductList);
init();
