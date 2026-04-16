import { getReviewTemplate } from "/src/pages/mypage/components/myReviewTemplate.js";
import { fetchOrder, fetchOrderDetail } from "/src/js/api/order/index.js";
import { checkMyReview, deleteReview } from "/src/js/api/review/index.js";
import { openEditModal } from "/src/pages/product/detail/handlers/reviewModal.js";
import { createPagination } from "/src/components/ui/pagination.js";
import { renderStars } from "/src/pages/product/detail/handlers/renderStars.js";

const PAGE_SIZE = 5;

export async function renderReviewList() {
  const container = document.querySelector("#mypage-content");
  if (!container) return;

  container.innerHTML = getReviewTemplate();

  const reviewContainer = document.querySelector("#review-list-container");
  const reviewCount = document.querySelector("#review-count");

  try {
    // 1. 전체 주문 가져오기
    const orderRes = await fetchOrder(1, 999);
    const orders = orderRes.data?.orders ?? [];

    if (orders.length === 0) {
      reviewCount.textContent = "0 reviews";
      renderEmpty(reviewContainer);
      return;
    }

    // 2. 각 주문 상세에서 상품 ID 추출
    const orderDetails = await Promise.all(
      orders.map((order) => fetchOrderDetail(order.orderId)),
    );

    const productIds = [
      ...new Set(
        orderDetails.flatMap(
          (detail) => detail.items?.map((item) => item.productId) ?? [],
        ),
      ),
    ];

    if (productIds.length === 0) {
      reviewCount.textContent = "0 reviews";
      renderEmpty(reviewContainer);
      return;
    }

    // 3. 각 상품 리뷰 조회 후 내 리뷰만 필터링
    const reviewResults = await Promise.all(
      productIds.map((id) => checkMyReview(id).catch(() => null)),
    );

    const myReviews = reviewResults
      .flatMap((res) => res?.reviews ?? [])
      .filter((review) => review.isMyReview);

    reviewCount.textContent = `${myReviews.length} reviews`;

    if (myReviews.length === 0) {
      renderEmpty(reviewContainer);
      return;
    }

    // 4. 페이지네이션
    let currentPage = 1;

    function renderPage(page) {
      reviewContainer.textContent = "";
      document.querySelector("#review-pagination")?.remove();

      const start = (page - 1) * PAGE_SIZE;
      const pageReviews = myReviews.slice(start, start + PAGE_SIZE);
      renderReviews(pageReviews, reviewContainer);

      const totalPages = Math.ceil(myReviews.length / PAGE_SIZE);
      if (totalPages > 1) {
        const pagination = createPagination({
          totalPages,
          currentPage: page,
          onPageChange: (newPage) => {
            currentPage = newPage;
            renderPage(newPage);
          },
        });
        pagination.id = "review-pagination";
        pagination.className += " justify-center mt-12";
        reviewContainer.after(pagination);
      }
    }

    renderPage(currentPage);
  } catch (e) {
    console.error("리뷰 로딩 오류:", e);
    reviewContainer.innerHTML = `<p class="text-sm text-empress">데이터를 불러오는 중 오류가 발생했습니다.</p>`;
  }
}

function renderEmpty(container) {
  container.innerHTML = `
    <div class="py-40 text-center">
      <p class="text-[10px] text-empress uppercase tracking-[0.3em] mb-10 italic">작성한 리뷰가 없습니다.</p>
      <a href="/products" class="inline-block border border-dark-woody px-12 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-dark-woody hover:text-white transition-all">
        Go Shopping
      </a>
    </div>
  `;
}

function renderReviews(reviews, container) {
  const fragment = document.createDocumentFragment();

  reviews.forEach((review) => {
    const li = document.createElement("li");
    li.className =
      "flex flex-col gap-4 pb-20 border-b border-cararra/50 last:border-0";

    const date = review.createdAt?.split("T")[0].replace(/-/g, ".") ?? "-";

    const header = document.createElement("div");
    header.className = "flex justify-between items-start";

    const productInfo = document.createElement("div");
    productInfo.className =
      "flex flex-col gap-1 cursor-pointer hover:underline";
    productInfo.addEventListener("click", () => {
      window.location.href = `/src/pages/product/detail/?id=${review.productId}`;
    });

    const productName = document.createElement("p");
    productName.className = "text-xs text-empress uppercase tracking-widest";
    productName.textContent = review.productName;

    const rating = document.createElement("div");
    renderStars(review.rating, rating, "w-4 h-4");

    productInfo.append(productName, rating);

    const actions = document.createElement("div");
    actions.className = "flex gap-3 text-[10px] text-empress";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "hover:text-dark-woody transition-colors";
    editBtn.textContent = "수정";
    editBtn.addEventListener("click", () => {
      openEditModal(review, () => renderReviewList());
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "hover:text-ferra transition-colors";
    deleteBtn.textContent = "삭제";
    deleteBtn.addEventListener("click", async () => {
      if (!confirm("리뷰를 삭제하시겠습니까?")) return;
      try {
        await deleteReview(review.id);
        li.remove();
        const remaining = container.querySelectorAll("li").length;
        document.querySelector("#review-count").textContent =
          `${remaining} reviews`;
        if (remaining === 0) renderEmpty(container);
      } catch (e) {
        console.error("리뷰 삭제 오류:", e);
        alert("리뷰 삭제 중 오류가 발생했습니다.");
      }
    });

    actions.append(editBtn, deleteBtn);
    header.append(productInfo, actions);

    const title = document.createElement("h3");
    title.className = "text-sm font-medium text-dark-woody";
    title.textContent = review.title;

    const content = document.createElement("p");
    content.className = "text-sm text-empress leading-relaxed";
    content.textContent = review.content;

    const meta = document.createElement("p");
    meta.className = "text-[10px] text-empress/60";
    meta.textContent = date;

    li.append(header, title, content, meta);

    if (review.reviewImages?.length > 0) {
      const imgList = document.createElement("ul");
      imgList.className = "flex gap-2 list-none";

      review.reviewImages.forEach((url) => {
        const imgLi = document.createElement("li");
        const img = document.createElement("img");
        img.src = url;
        img.alt = "리뷰 이미지";
        img.className = "w-20 h-20 object-cover bg-cararra";
        imgLi.append(img);
        imgList.append(imgLi);
      });

      li.append(imgList);
    }

    fragment.appendChild(li);
  });

  container.appendChild(fragment);
}
