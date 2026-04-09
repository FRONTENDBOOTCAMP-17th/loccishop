import { createProductCard } from "/src/components/ui/product-card.js";
import { fetchRitualSteps } from "/src/js/api/product/index.js";

export async function initRitualSteps(productId) {
  const data = await fetchRitualSteps(productId);

  const title = document.querySelector("#ritual-title");
  const description = document.querySelector("#ritual-description");

  title.textContent = data.title;
  description.textContent = data.description;

  const list = document.querySelector("#ritual-steps-list");
  data.steps.forEach((step) => {
    const li = document.createElement("li");
    li.className = "flex-1 h-full";
    li.append(
      createProductCard({
        layout: "horizontal",
        badgeText: `${step.step} 단계`,
        name: step.productName,
        size: step.volume,
        originalPrice: step.price,
        image: step.imageUrl,
        imageAlt: step.productName,
      }),
    );
    list.append(li);
  });
}
