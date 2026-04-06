import "../styles/style.css";

import { createDrawer } from "../components/ui/drawer.js";

window.addEventListener("DOMContentLoaded", () => {
  const menuDrawer = createDrawer({
    title: "CATEGORY",
    position: "left",
  });

  const hamburgerBtn = document.querySelector(".hamburger-btn");
  menuDrawer.content.innerHTML = `<div class="p-4">록시땅 메뉴 내용물 테스트</div>`;
});
