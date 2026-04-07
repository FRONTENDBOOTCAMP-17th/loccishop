import { fetchProductReviews } from "/src/js/api/product/index.js";

export async function initBestReview(productId) {
  const { reviews } = await fetchProductReviews(productId, {
    page: 1,
    limit: 1,
    sort: "rating_high",
  });

  if (!reviews || reviews.length === 0) {
    document.querySelector("#best-review-section")?.remove();
    return;
  }

  const review = reviews[0];

  const stars = document.querySelector("#best-review-stars");
  stars.innerHTML = "<img src='/src/assets/icon/star.svg' />".repeat(
    review.rating,
  );
  stars.setAttribute("aria-label", `별점 5점 만점에 ${review.rating}점`);

  document.querySelector("#review-title").textContent = review.title ?? "";
  document.querySelector("#review-content").textContent = review.content;
  document.querySelector("#author").textContent = review.author;
}
