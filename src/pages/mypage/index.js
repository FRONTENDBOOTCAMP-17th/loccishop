import {
  initMypageEvents,
  updateSidebarUI,
  renderSection,
} from "/src/pages/mypage/handlers/initMypageEvents.js";

async function init() {
  try {
    initMypageEvents();

    const params = new URLSearchParams(window.location.search);
    const menu = params.get("menu") || "info";

    updateSidebarUI(menu);
    await renderSection(menu);
  } catch (error) {
    console.error("마이페이지 로딩 중 오류 발생:", error);
  }
}

document.addEventListener("DOMContentLoaded", init);
