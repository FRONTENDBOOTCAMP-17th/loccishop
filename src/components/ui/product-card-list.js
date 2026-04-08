import { createProductCard } from "/src/components/ui/product-card.js";

export function renderProductCards(products) {
  const container = document.querySelector("#product-list-container");
  if (!container) {
    return;
  }

  //스크롤바 스타일링
  container.classList.add(
    "pb-3",
    "[&::-webkit-scrollbar]:h-2",
    "[&::-webkit-scrollbar-track]:bg-cararra",
    "[&::-webkit-scrollbar-thumb]:bg-woody-brown",
    "[&::-webkit-scrollbar-thumb]:rounded-full",
  );

  // 스크롤 필요할 때만 grab 적용
  function updateCursor() {
    if (container.scrollWidth > container.clientWidth) {
      container.style.cursor = "grab";
    } else {
      container.style.cursor = "default";
    }
  }

  let isDown = false;
  let startX;
  let scrollLeft;

  // 마우스 눌렀을때
  container.addEventListener("mousedown", (e) => {
    if (container.scrollWidth <= container.clientWidth) {
      return;
    }
    e.preventDefault();
    isDown = true;
    container.style.cursor = "grabbing";
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener("mouseleave", () => {
    isDown = false;
    updateCursor();
  });

  container.addEventListener("mouseup", () => {
    isDown = false;
    updateCursor();
  });

  // 마우스 움직일때
  container.addEventListener("mousemove", (e) => {
    if (!isDown) {
      return;
    }
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = x - startX;
    container.scrollLeft = scrollLeft - walk;
  });

  // 카드 너비 업데이트
  function updateCardWidths() {
    const containerWidth = container.clientWidth;
    const gap = 16;

    let count;
    if (window.innerWidth < 768) {
      count = 2;
    } else if (window.innerWidth < 1024) {
      count = 3;
    } else {
      count = 4;
    }

    const cardWidth = (containerWidth - gap * (count - 1)) / count;

    container.querySelectorAll("article").forEach((card) => {
      card.style.width = `${cardWidth}px`;
      card.style.flexShrink = "0";
    });
  }

  container.innerHTML = "";
  products.forEach((product) => {
    const cardElement = createProductCard(product);
    container.appendChild(cardElement);
    cardElement.style.cursor = "pointer";
  });

  updateCardWidths();
  updateCursor();

  window.addEventListener("resize", updateCursor);
  window.addEventListener("resize", updateCardWidths);
}
