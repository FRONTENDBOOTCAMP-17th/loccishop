import { renderInfo } from "/src/pages/mypage/handlers/renderInfo.js";
import { renderOrder } from "/src/pages/mypage/handlers/renderOrder.js";
import { renderWish } from "/src/pages/mypage/handlers/renderWish.js";
import { renderReview } from "/src/pages/mypage/handlers/renderReview.js";

export function initMypageEvents() {
  const nav = document.querySelector("#mypage-nav");
  if (!nav) return;

  nav.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-menu]");
    if (!btn) return;

    const menu = btn.dataset.menu;

    // 1. UI 활성화 상태 변경
    updateSidebarUI(btn);

    // 2. 메뉴 데이터에 따른 핸들러 분기 처리
    switch (menu) {
      case "info":
        await renderInfo();
        break;
      case "order":
        await renderOrder();
        break;
      case "wish":
        await renderWish();
        break;
      case "review":
        await renderReview();
        break;
    }
  });
}

function updateSidebarUI(activeBtn) {
  const allBtns = document.querySelectorAll("#mypage-nav button");
  allBtns.forEach((btn) => {
    // 테일윈드 클래스 토글 (기존 속성 제거 후 비활성 스타일 추가)
    btn.classList.remove("bg-merino", "text-ferra", "font-semibold");
    btn.classList.add("text-empress");
  });

  // 클릭된 버튼 활성화 스타일 추가
  activeBtn.classList.add("bg-merino", "text-ferra", "font-semibold");
  activeBtn.classList.remove("text-empress");
}
