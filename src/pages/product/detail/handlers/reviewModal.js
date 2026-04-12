import { createReviewForm } from "/src/pages/product/detail/handlers/createReviewForm.js";

export async function openEditModal(review, onRefresh) {
  document.querySelector("#review-edit-modal")?.remove();

  const overlay = document.createElement("div");
  overlay.id = "review-edit-modal";
  overlay.className =
    "fixed inset-0 z-50 flex items-center justify-center bg-black/50";

  const panel = document.createElement("div");
  panel.className =
    "relative bg-white rounded-xl p-6 w-full max-w-md mx-4 flex flex-col gap-4 max-h-[90vh] overflow-y-auto";

  const heading = document.createElement("h2");
  heading.className = "text-base font-bold";
  heading.textContent = "리뷰 수정";

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "absolute top-4 right-4 text-gray-400 hover:text-black";
  closeBtn.textContent = "✕";
  closeBtn.addEventListener("click", () => overlay.remove());

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });

  const form = await createReviewForm(
    review.productId,
    null,
    () => overlay.remove(),
    {
      mode: "edit",
      reviewId: review.id,
      initialData: {
        rating: review.rating,
        nickname: review.author,
        title: review.title,
        content: review.content,
        reviewImages: review.reviewImages,
      },
      onRefresh,
    },
  );

  panel.append(closeBtn, heading, form);
  overlay.append(panel);
  document.body.append(overlay);
}
