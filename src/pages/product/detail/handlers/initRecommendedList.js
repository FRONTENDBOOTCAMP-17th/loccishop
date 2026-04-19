import { fetchRelatedProducts } from "/src/js/api/product/index.js";
import { renderProductCards } from "/src/components/ui/product-card-list";

export async function initRecommendedList(productId) {
  const title = document.querySelector("#card-list-title");
  title.textContent = "추천 상품";

  const { products } = await fetchRelatedProducts(productId);

  renderProductCards(
    products.map((product) => ({
      id: product.id,
      image: product.images?.[0] ?? "",
      imageAlt: product.name,
      badgeType: product.badge ?? null,
      size: product.size,
      name: product.name,
      originalPrice: product.price,
      discountRate: product.discountRate ?? null,
      discountPrice: product.discountRate
        ? Math.round(product.price * (1 - product.discountRate / 100))
        : null,
      isWished: product.isWished ?? false,
    })),
  );
}
