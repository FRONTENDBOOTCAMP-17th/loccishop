import { initMypageEvents } from "/src/pages/mypage/handlers/initMypageEvents.js";
import { renderInfo } from "/src/pages/mypage/handlers/renderInfo.js";

async function init() {
  try {
    initMypageEvents();

    await renderInfo();
  } catch (error) {
    console.error("마이페이지 로딩 중 오류 발생:", error);
  }
}

document.addEventListener("DOMContentLoaded", init);
