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

  let isDown = false;
  let startX;
  let scrollLeft;

  //마우스 눌렀을때
  container.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isDown = true;
    container.style.cursor = "grabbing";
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener("mouseleave", () => {
    isDown = false;
    container.style.cursor = "grab";
  });

  container.addEventListener("mouseup", () => {
    isDown = false;
    container.style.cursor = "grab";
  });

  //마우스 움직일때
  container.addEventListener("mousemove", (e) => {
    if (!isDown) {
      // 원치 않는 텍스트 선택 등 방지
      return;
    }
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = x - startX;
    container.scrollLeft = scrollLeft - walk;
  });

  container.style.cursor = "grab";

  //상품 카드 렌더링
  container.innerHTML = "";

  products.forEach((product) => {
    const cardElement = createProductCard(product);

    container.appendChild(cardElement);
  });
}
