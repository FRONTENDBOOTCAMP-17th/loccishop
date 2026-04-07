import "../styles/style.css";

import { createDrawer } from "/src/components/ui/drawer.js";

window.addEventListener("DOMContentLoaded", () => {
  const menuDrawer = createDrawer({
    title: "CATEGORY",
    position: "left",
  });

  const hamburgerBtn = document.querySelector(".hamburger-btn");
  menuDrawer.content.innerHTML = `<div class="p-4">록시땅 메뉴 내용물 테스트</div>`;
});

import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("header").append(renderHeader());
  document.getElementById("footer").append(renderFooter());
});
