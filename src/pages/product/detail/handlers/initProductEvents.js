import { createReviewForm } from "./createReviewForm.js";
import { createModal } from "/src/components/ui/modal.js";
import { fetchReviewable } from "/src/js/api/order/index.js";

export function initProductEvents(productId) {
  // 전체 리뷰보기로 이동
  const reviewLink = document.querySelector('a[href="#reviews"]');

  if (reviewLink) {
    reviewLink.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector("#reviews");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        target.setAttribute("tabindex", "-1");
        target.focus();
      }
    });
  }

  // 리뷰 작성 버튼
  const writeReviewBtn = document.querySelector("#write-review-btn");
  if (writeReviewBtn) {
    writeReviewBtn.addEventListener("click", async () => {
      const { isReviewable, orderId } = await fetchReviewable({ productId });
      if (!isReviewable) {
        alert("구매한 내역이 없거나 이미 리뷰를 작성하셨습니다.");
        return;
      }
      let reviewModal;

      const reviewForm = await createReviewForm(productId, orderId, () => {
        reviewModal.close();
      });

      reviewModal = createModal({
        title: "리뷰 작성하기",
        content: reviewForm,
      });

      reviewModal.open();
    });
  }
}
