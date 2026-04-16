import { createDrawer } from "/src/components/ui/drawer.js";
import { fetchCategories } from "/src/js/api/product/index.js";

export function createNavDrawer() {
  const {
    open: openDrawer,
    close,
    content,
  } = createDrawer({ width: "w-fit", position: "left" });

  content.className = "flex flex-1 overflow-hidden";

  // 1패널
  const panel1 = document.createElement("div");
  panel1.className = "w-80 h-full flex flex-col flex-shrink-0";

  // 2패널
  const panel2 = document.createElement("div");
  panel2.className =
    "w-80 h-full bg-white border-l border-empress/20 flex flex-col flex-shrink-0 translate-x-full transition-transform duration-300";

  content.append(panel1);

  async function open() {
    openDrawer();
    const categories = await fetchCategories();
    renderPanel1(categories);
  }

  function renderPanel1(categories) {
    panel1.innerHTML = "";

    const ul = document.createElement("ul");
    ul.className = "flex-1 overflow-y-auto";

    categories.forEach((cat) => {
      const li = document.createElement("li");
      li.className =
        "flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-empress/10 transition-colors duration-200";
      li.innerHTML = `
        <span class="text-base tracking-wide font-medium text-woody-brown">${cat.name}</span>
        ${cat.children?.length ? '<span class="text-empress">›</span>' : ""}
      `;

      li.addEventListener("click", () => {
        if (cat.children?.length) {
          renderPanel2(cat);
        } else {
          window.location.href = `/src/pages/product/category/index.html?slug=${cat.slug}`;
          close();
        }
      });

      ul.append(li);
    });

    const logoWrap = document.createElement("div");
    logoWrap.className = "p-6 border-t border-empress/20 flex justify-center";

    const logo = document.createElement("img");
    logo.src = "/src/assets/logo/Loccitane.svg";
    logo.alt = "L'Occitane";
    logo.className = "w-32 opacity-50";

    logoWrap.append(logo);
    panel1.append(ul, logoWrap);
  }

  function renderPanel2(cat) {
    panel2.innerHTML = "";

    if (!content.contains(panel2)) {
      content.append(panel2);
    }

    // 헤더
    const header = document.createElement("div");
    header.className =
      "flex items-center justify-between px-4 py-3 border-b border-empress/30";

    const backBtn = document.createElement("button");
    backBtn.className =
      "flex items-center gap-1 text-sm text-empress cursor-pointer hover:text-woody-brown transition-colors duration-200";
    backBtn.textContent = `← ${cat.name}`;
    backBtn.addEventListener("click", () => {
      panel2.classList.replace("translate-x-0", "translate-x-full");
      setTimeout(() => panel2.remove(), 300);
    });

    const LIST_PAGE_SLUGS = ['hand-care', 'body-care'];

    const viewAll = document.createElement("a");
    viewAll.href = LIST_PAGE_SLUGS.includes(cat.slug)
      ? `/src/pages/product/list/index.html?slug=${cat.slug}`
      : `/src/pages/product/category/index.html?slug=${cat.slug}`;
    viewAll.textContent = `${cat.name} 보기 ›`;
    viewAll.className = "text-sm text-empress hover:text-woody-brown";

    header.append(backBtn, viewAll);

    // 스크롤 영역
    const scrollArea = document.createElement("div");
    scrollArea.className = "flex-1 overflow-y-auto";

    // 이미지
    const img = document.createElement("img");
    img.src = cat.imageUrl;
    img.alt = cat.name;
    img.className = "w-full h-40 object-cover p-5";

    // 전체보기 링크
    const viewAllWrap = document.createElement("div");
    viewAllWrap.className = "px-4 py-3 border-b border-empress/20";

    const viewAllLink = document.createElement("a");
    viewAllLink.href = `/src/pages/product/category/index.html?slug=${cat.slug}`;
    viewAllLink.textContent = `${cat.name} 전체 보기`;
    viewAllLink.className =
      "text-base tracking-wide text-woody-brown hover:text-ferra";
    viewAllWrap.append(viewAllLink);

    // 제품 타입 섹션
    const typeSection = document.createElement("div");
    typeSection.className = "px-4 py-4";

    const typeLabel = document.createElement("p");
    typeLabel.textContent = "제품 타입";
    typeLabel.className = "text-xs text-empress mb-3";

    const ul = document.createElement("ul");
    ul.className = "grid grid-cols-1 gap-x-4 gap-y-2";

    cat.children.forEach((sub) => {
      const li = document.createElement("li");
      li.className = "border-b border-empress/10 py-2";
      const a = document.createElement("a");
      a.href = `/src/pages/product/category/index.html?slug=${sub.slug}`;
      a.textContent = sub.name;
      a.className =
        "text-sm text-woody-brown hover:text-ferra transition-colors duration-200 ";
      li.append(a);
      ul.append(li);
    });

    typeSection.append(typeLabel, ul);
    scrollArea.append(img, viewAllWrap, typeSection);
    panel2.append(header, scrollArea);

    requestAnimationFrame(() => {
      panel2.classList.replace("translate-x-full", "translate-x-0");
    });
  }

  return { open };
}
