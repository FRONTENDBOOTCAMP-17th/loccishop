import { fetchProductReviews } from "/src/js/api/product/index.js";
import { renderStars } from "/src/pages/product/detail/handlers/renderStars.js";
import { createPagination } from "/src/components/ui/pagination.js";
import { toggleRecommendReview } from "/src/js/api/review/index.js";

const reviewState = {
  page: 1,
  sort: "latest",
  productId: null,
  totalPages: 1,
  rating: null,

  // 상태를 초기화하는 메서드
  reset(productId) {
    this.page = 1;
    this.sort = "latest";
    this.productId = productId;
    this.totalPages = 1;
    this.rating = null;
  },
};

export async function initReviews(
  productId,
  { sort = "latest", rating = null } = {},
) {
  reviewState.reset(productId);
  reviewState.sort = sort;
  reviewState.rating = rating;

  const result = await fetchProductReviews(productId, {
    page: 1,
    limit: 4,
    sort,
    ...(rating && { rating }),
  });
  const { reviews, meta } = result;
  reviewState.totalPages = meta.pagination.totalPages;

  if (!reviews || reviews.length === 0) {
    const reviewList = document.querySelector("#review-list");
    reviewList.innerHTML = "";

    const empty = document.createElement("p");
    empty.className = "text-sm text-zambezi text-center py-10 col-span-2";
    empty.textContent = "해당 평점의 리뷰가 없습니다.";
    reviewList.append(empty);
    return;
  }

  const total = meta.pagination.total;

  const average = meta.ratingAverage.toFixed(1);
  const counts = meta.ratingCounts;
  const totalCount = Object.values(counts).reduce((sum, c) => sum + c, 0);

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
    const percent = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
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
        await initReviews(productId, {
          sort: "rating_high",
          rating: reviewState.rating,
        });
      } else if (text === "최신순") {
        await initReviews(productId, {
          sort: "latest",
          rating: reviewState.rating,
        });
      }
    });
  });
}

//리뷰목록
function createReviewCard(review) {
  const li = document.createElement("li");
  li.className = "h-full";

  const article = document.createElement("article");
  article.className =
    "h-full flex flex-col gap-3 border border-gray-300 rounded-md p-5";

  // 별점
  const starsDiv = document.createElement("div");
  starsDiv.setAttribute("role", "img");
  starsDiv.setAttribute("aria-label", `별점 ${review.rating}점`);
  renderStars(review.rating, starsDiv);

  // 작성자 + 날짜
  const metaDiv = document.createElement("div");
  metaDiv.className = "flex justify-between text-xs font-bold";
  const authorSpan = document.createElement("span");
  authorSpan.textContent = review.author;
  const dateSpan = document.createElement("span");
  dateSpan.textContent = review.createdAt.slice(0, 10);
  metaDiv.append(authorSpan, dateSpan);

  // 제목
  const title = document.createElement("h3");
  title.className = "text-sm font-bold";
  title.textContent = review.title ?? "";

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

  // 추천 버튼
  const actionsDiv = document.createElement("div");
  actionsDiv.className = "flex justify-end text-xs mt-auto pt-3";

  const recommendBtn = document.createElement("button");
  recommendBtn.type = "button";

  recommendBtn.className =
    "flex items-center gap-1.5 py-1.5 px-4 border border-gray-200 rounded-full text-xs font-medium hover:bg-merino hover:border-woody-brown transition-colors";

  const icon = document.createElement("img");
  icon.src = "/src/assets/icon/thumb-up.svg";
  icon.alt = "";
  icon.className = "w-3.5 h-3.5";

  const btnText = document.createElement("span");
  btnText.textContent = `도움됐어요 ${review.recommendCount}`;

  recommendBtn.append(icon, btnText);

  //리뷰 추천
  let isRecommended = false;

  recommendBtn.addEventListener("click", async () => {
    try {
      await toggleRecommendReview(review.id);
      if (isRecommended) {
        review.recommendCount--;
        isRecommended = false;
        recommendBtn.classList.remove("bg-merino", "border-woody-brown");
      } else {
        review.recommendCount++;
        isRecommended = true;
        recommendBtn.classList.add("bg-merino", "border-woody-brown");
      }
      btnText.textContent = `도움됐어요 ${review.recommendCount}`;
    } catch (e) {
      console.error("추천 처리 실패 :", e);
    }
  });

  actionsDiv.append(recommendBtn);

  article.append(starsDiv, metaDiv, title, content, imagesDiv, actionsDiv);
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
    totalPages: reviewState.totalPages,
    currentPage: 1,
    onPageChange: async (page) => {
      reviewState.page = page;

      const result = await fetchProductReviews(productId, {
        page,
        sort: reviewState.sort,
        limit: 4,
        ...(reviewState.rating && { rating: reviewState.rating }),
      });

      const { reviews } = result;

      const reviewList = document.querySelector("#review-list");
      reviewList.innerHTML = ""; // 더보기와 달리 페이지 교체라 초기화
      reviews.forEach((review) => reviewList.append(createReviewCard(review)));
    },
  });

  container.innerHTML = "";
  container.append(pagination);
}

//평점선택 드롭다운
export function initFilterButton(productId) {
  const filterBtn = document.querySelector("#filter-btn");
  if (!filterBtn) {
    return;
  }

  // 드롭다운 생성
  const dropdown = document.createElement("ul");
  dropdown.className =
    "absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-md z-10 hidden";

  const options = [
    { label: "전체", value: null },
    { label: "5점", value: 5 },
    { label: "4점", value: 4 },
    { label: "3점", value: 3 },
    { label: "2점", value: 2 },
    { label: "1점", value: 1 },
  ];

  options.forEach(({ label, value }) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "flex items-center w-full text-left px-4 py-2 text-sm hover:bg-cararra";

    if (value === null) {
      btn.textContent = "전체";
    } else {
      btn.innerHTML = `
    <span class="inline-flex gap-0.5 mr-1">
      ${'<img src="/src/assets/icon/star.svg" alt="" aria-hidden="true" class="w-3.5 h-3.5" />'.repeat(value)}
    </span>
    ${label}
  `;
    }

    btn.addEventListener("click", async () => {
      dropdown.classList.add("hidden");

      filterBtn.querySelector("span").textContent = value
        ? `${value}점`
        : "필터";

      await initReviews(productId, { sort: reviewState.sort, rating: value });
      initPagination(productId);
    });

    li.append(btn);
    dropdown.append(li);
  });

  // 드롭다운을 filterBtn 부모에 추가 (relative 필요)
  filterBtn.parentElement.style.position = "relative";
  filterBtn.parentElement.append(dropdown);

  // 토글
  filterBtn.addEventListener("click", () => {
    dropdown.classList.toggle("hidden");
  });

  // 외부 클릭 시 닫기
  document.addEventListener("click", (e) => {
    if (!filterBtn.contains(e.target)) {
      dropdown.classList.add("hidden");
    }
  });
}
