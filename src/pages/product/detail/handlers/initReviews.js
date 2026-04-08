import { fetchProductReviews } from "/src/js/api/product/index.js";
import { renderStars } from "./renderStars.js";

export async function initReviews(productId, { sort = "latest" } = {}) {
  const { reviews, meta } = await fetchProductReviews(productId, {
    page: 1,
    limit: 999,
    sort,
  });

  if (!reviews || reviews.length === 0) return;

  const total = meta.pagination.total;
  const average = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);

  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => counts[r.rating]++);

  document.querySelector("#all-review-count").textContent = total;
  document.querySelector("#rating-average").textContent = average;

  const productRatingStars = document.querySelector("#product-rating-stars");
  if (productRatingStars) renderStars(average, productRatingStars);

  const ratingStars = document.querySelector("#rating-stars");
  if (ratingStars) renderStars(average, ratingStars, "w-6 h-6");

  [5, 4, 3, 2, 1].forEach((star) => {
    const count = counts[star];
    const percent =
      reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
    document.querySelector(`#bar-${star}`).style.width = `${percent}%`;
    document.querySelector(`#count-${star}`).textContent =
      count.toLocaleString();
  });

  const reviewList = document.querySelector("#review-list");
  if (!reviewList) return;
  reviewList.innerHTML = "";

  reviews.forEach((review) => {
    const li = document.createElement("li");
    li.className = "h-full";
    li.innerHTML = `
      <article class="h-full flex flex-col gap-3 shadow-[0_0_6px_0_rgba(0,0,0,0.05)] rounded-lg p-5 bg-rose-white">
        <div class="flex">
          ${"<img src='/src/assets/icon/star.svg' class='w-3 h-3' />".repeat(review.rating)}
        </div>
        <h3 class="review-title leading-6">${review.title ?? ""}</h3>
        <div class="flex justify-between text-xs font-medium">
          <span>${review.author}</span>
          <span>${review.createdAt.slice(0, 10)}</span>
        </div>
        <p class="text-sm leading-5 text-zambezi">${review.content}</p>
        <div class="flex gap-2">
          ${review.reviewImages
            .map(
              (src) =>
                `<img src="${src}" class="w-20 h-20 object-cover rounded-xl bg-cararra" />`,
            )
            .join("")}
        </div>
        <div class="flex justify-between text-xs mt-auto pt-3">
          <button type="button">이 제품을 추천합니다 (${review.recommendCount})</button>
          <button type="button" class="text-abbey/60 underline">이 리뷰 신고하기</button>
        </div>
      </article>
    `;
    reviewList.append(li);
  });
}

export function initSortButtons(productId) {
  const buttons = document.querySelectorAll(
    "#detail-reviews button[type='button']",
  );
  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.textContent.trim();
      if (text === "베스트순")
        await initReviews(productId, { sort: "rating_high" });
      else if (text === "최신순")
        await initReviews(productId, { sort: "latest" });
    });
  });
}
