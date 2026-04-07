import "/src/styles/style.css";
import { createDrawer } from "/src/components/ui/drawer.js";
import { renderHeader } from "/src/components/header/header.js";
import { renderFooter } from "/src/components/footer/footer.js";

window.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.getElementById("header");
  const footerContainer = document.getElementById("footer");

  if (headerContainer) headerContainer.append(renderHeader());
  if (footerContainer) footerContainer.append(renderFooter());

  const menuDrawer = createDrawer({
    title: "CATEGORY",
    position: "left",
  });
  menuDrawer.content.innerHTML = `<div class="p-4">록시땅 메뉴 내용물 테스트</div>`;

  const hamburgerBtn = document.querySelector(".hamburger-btn");
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener("click", () => {
      menuDrawer.open();
    });
  }
});
