import { renderInfo } from "/src/pages/mypage/handlers/renderInfo.js";
import { renderOrderList } from "/src/pages/mypage/handlers/renderOrderList.js";
import { renderWishList } from "/src/pages/mypage/handlers/renderWishList.js";
import { renderReviewList } from "/src/pages/mypage/handlers/renderReviewList.js";

const BASE_MENU_CLASS =
  "group w-full flex items-center justify-between py-3 text-sm border-b transition-colors";
const ACTIVE_MENU_CLASS = "text-ferra font-semibold border-cararra";
const INACTIVE_MENU_CLASS =
  "text-empress border-cararra/30 hover:text-dark-woody";

const RENDER_MAP = {
  info: renderInfo,
  order: renderOrderList,
  wish: renderWishList,
  review: renderReviewList,
};

export function updateSidebarUI(activeMenu) {
  const buttons = document.querySelectorAll("#mypage-nav button[data-menu]");
  buttons.forEach((button) => {
    const isActive = button.dataset.menu === activeMenu;
    button.className = `${BASE_MENU_CLASS} ${isActive ? ACTIVE_MENU_CLASS : INACTIVE_MENU_CLASS}`;
    button.setAttribute("aria-current", isActive ? "page" : "false");
  });
}

export async function renderSection(menu) {
  const container = document.querySelector("#mypage-content");
  const handler = RENDER_MAP[menu];
  if (!container || !handler) return;
  try {
    await handler();
  } catch (error) {
    container.innerHTML = `<p class="p-10 text-center text-error-red">화면을 불러오는 중 오류가 발생했습니다.</p>`;
    console.error(error);
  }
}

export function initMypageEvents() {
  const nav = document.querySelector("#mypage-nav");
  if (!nav) return;

  nav.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-menu]");
    if (!btn) return;

    const menu = btn.dataset.menu;
    updateSidebarUI(menu);
    await renderSection(menu);
  });
}
