import {
  openLoginModal,
  renderLoginModal,
} from "/src/components/login-modal/loginModal.js";

export async function renderHeader() {
  const res = await fetch("/src/components/header/header.html");
  const html = await res.text();

  const temp = document.createElement("div");
  temp.innerHTML = html;
  const nav = temp.querySelector("nav");

  nav.querySelector("#loginBtn").addEventListener("click", () => {
    if (localStorage.getItem("token")) {
      window.location.href = "/src/pages/mypage/index.html";
    } else {
      openLoginModal();
    }
  });

  return nav;
}
