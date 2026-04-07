import { createProductCard } from "/src/components/ui/product-card.js";

export function renderProductCards(products) {
  const container = document.querySelector("#product-list-container");
  if (!container) {
    return;
  }

  container.innerHTML = "";

  products.forEach((product) => {
    const cardElement = createProductCard(product);

    container.appendChild(cardElement);
  });
}
