import { fetchProductReviews } from "/src/js/api/product/index.js";
import { renderStars } from "./renderStars.js";
import { createPagination } from "/src/components/ui/pagination.js";

let currentPage = 1;
let currentSort = "latest";
let currentProductId = null;
let totalPages = 1;

export async function initReviews(productId, { sort = "latest" } = {}) {
  currentPage = 1;
  currentSort = sort;
  currentProductId = productId;

  const { reviews, meta } = await fetchProductReviews(productId, {
    page: 1,
    limit: 4,
    sort,
  });

  if (!reviews || reviews.length === 0) {
    return;
  }

  const total = meta.pagination.total;
  totalPages = meta.pagination.totalPages;

  const average = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);

  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => counts[r.rating]++);

  document.querySelector("#all-review-count").textContent = total;
  document.querySelector("#rating-average").textContent = average;

  const productRatingStars = document.querySelector("#product-rating-stars");
  if (productRatingStars) {
    renderStars(average, productRatingStars);
  }

  const ratingStars = document.querySelector("#rating-stars");
  if (ratingStars) {
    renderStars(average, ratingStars, "w-6 h-6");
  }

  [5, 4, 3, 2, 1].forEach((star) => {
    const count = counts[star];
    const percent = total > 0 ? Math.round((count / total) * 100) : 0;
    document.querySelector(`#bar-${star}`).style.width = `${percent}%`;
    document.querySelector(`#count-${star}`).textContent =
      count.toLocaleString();
  });

  const reviewList = document.querySelector("#review-list");
  if (!reviewList) {
    return;
  }
  reviewList.innerHTML = "";

  reviews.forEach((review) => {
    reviewList.append(createReviewCard(review));
  });
}

//정렬
export function initSortButtons(productId) {
  const buttons = document.querySelectorAll(
    "#detail-reviews button[type='button']",
  );
  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.textContent.trim();
      if (text === "베스트순") {
        await initReviews(productId, { sort: "rating_high" });
      } else if (text === "최신순") {
        await initReviews(productId, { sort: "latest" });
      }
    });
  });
}

//리뷰작성카드
function createReviewCard(review) {
  const li = document.createElement("li");
  li.className = "h-full";

  const article = document.createElement("article");
  article.className =
    "h-full flex flex-col gap-3 border border-gray-300 rounded-md p-5";

  // 별점
  const starsDiv = document.createElement("div");
  starsDiv.className = "flex";
  starsDiv.setAttribute("role", "img");
  starsDiv.setAttribute("aria-label", `별점 ${review.rating}점`);
  for (let i = 0; i < review.rating; i++) {
    const star = document.createElement("span");
    star.textContent = "⭐";
    star.setAttribute("aria-hidden", "true");
    starsDiv.append(star);
  }

  // 제목
  const title = document.createElement("h3");
  title.className = "text-sm font-bold";
  title.textContent = review.title ?? "";

  // 작성자 + 날짜
  const metaDiv = document.createElement("div");
  metaDiv.className = "flex justify-between text-xs font-bold";
  const authorSpan = document.createElement("span");
  authorSpan.textContent = review.author;
  const dateSpan = document.createElement("span");
  dateSpan.textContent = review.createdAt.slice(0, 10);
  metaDiv.append(authorSpan, dateSpan);

  // 본문
  const content = document.createElement("p");
  content.className = "text-sm";
  content.textContent = review.content;

  // 리뷰 이미지
  const imagesDiv = document.createElement("div");
  imagesDiv.className = "flex gap-2";
  review.reviewImages.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "w-20 h-20 object-cover rounded-md border border-gray-300";
    img.alt = "리뷰 이미지";
    imagesDiv.append(img);
  });

  // 추천/신고 버튼
  const actionsDiv = document.createElement("div");
  actionsDiv.className = "flex justify-between text-xs mt-auto pt-3";

  const recommendBtn = document.createElement("button");
  recommendBtn.type = "button";
  recommendBtn.className =
    "bg-woody-brown text-white py-1 px-3 rounded-md font-bold hover:bg-opacity-90";
  recommendBtn.textContent = `이 제품을 추천합니다 (${review.recommendCount})`;

  const reportBtn = document.createElement("button");
  reportBtn.type = "button";
  reportBtn.className = "text-xs text-abbey/60 underline";
  reportBtn.textContent = "이 리뷰 신고하기";

  actionsDiv.append(recommendBtn, reportBtn);

  article.append(starsDiv, title, metaDiv, content, imagesDiv, actionsDiv);
  li.append(article);
  return li;
}

//페이징처리
export function initPagination(productId) {
  const container = document.querySelector("#more-reviews-btn");
  if (!container) {
    return;
  }

  const pagination = createPagination({
    totalPages,
    currentPage: 1,
    onPageChange: async (page) => {
      currentPage = page;

      const { reviews } = await fetchProductReviews(productId, {
        page,
        sort: currentSort,
        limit: 4,
      });

      const reviewList = document.querySelector("#review-list");
      reviewList.innerHTML = ""; // 더보기와 달리 페이지 교체라 초기화
      reviews.forEach((review) => reviewList.append(createReviewCard(review)));
    },
  });

  container.innerHTML = "";
  container.append(pagination);
}
