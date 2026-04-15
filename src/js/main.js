import "/src/styles/style.css";
import { fetchMe } from "/src/js/api/auth/index.js";
import { initMainPage } from "/src/pages/main/index.js";

// 토큰이 있으면 /members/me 호출로 만료 여부 확인
// 만료됐을 경우 fetchAPI 내부에서 token/role/member를 자동 제거
if (localStorage.getItem("token")) {
  fetchMe().catch(() => {});
}

initMainPage().catch((err) => console.error("초기화 실패:", err));
