import {
  submitReview,
  updateReview,
  uploadReviewImages,
} from "/src/js/api/review/index.js";
import { fetchMe } from "/src/js/api/auth/index.js";

export async function createReviewForm(
  productId,
  orderId,
  onClose,
  options = {},
) {
  const isEdit = options.mode === "edit";

  let userName = "";
  try {
    const me = await fetchMe();
    userName = me.name ?? "";
  } catch (e) {
    console.error("사용자 정보 조회 실패", e);
  }

  const form = document.createElement("form");
  form.className = "flex flex-col gap-3";

  // 별점
  const starLabel = document.createElement("p");
  starLabel.className = "block text-sm font-bold mb-2";
  starLabel.textContent = "평점";

  const starGroup = document.createElement("div");
  starGroup.className = "flex gap-1";

  let selectedRating = options.initialData?.rating ?? 5;

  [1, 2, 3, 4, 5].forEach((num) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.rating = num;

    const img = document.createElement("img");
    img.src =
      num <= selectedRating
        ? "/src/assets/icon/star.svg"
        : "/src/assets/icon/star-empty.svg";
    img.alt = `${num}점`;
    img.className = "w-6 h-6";
    btn.append(img);

    btn.addEventListener("click", () => {
      selectedRating = num;
      starGroup.querySelectorAll("button").forEach((b) => {
        b.querySelector("img").src = "/src/assets/icon/star.svg";

        const bImg = b.querySelector("img");
        bImg.src =
          Number(b.dataset.rating) <= num
            ? "/src/assets/icon/star.svg"
            : "/src/assets/icon/star-empty.svg";
      });
    });

    starGroup.append(btn);
  });

  // 추천 여부
  const recommendContainer = document.createElement("div");
  recommendContainer.className = "flex items-center gap-2";
  const recommendInput = document.createElement("input");
  recommendInput.type = "checkbox";
  recommendInput.checked = true;
  recommendInput.id = "recommend";
  const recommendLabel = document.createElement("label");
  recommendLabel.htmlFor = "recommend";
  recommendLabel.className = "text-sm cursor-pointer";
  recommendLabel.textContent = "이 제품을 추천합니다";
  recommendContainer.append(recommendInput, recommendLabel);

  //닉네임
  const nicknameLabel = document.createElement("label");
  nicknameLabel.className = "block text-sm font-bold";
  nicknameLabel.textContent = "닉네임";
  const nicknameInput = document.createElement("input");
  nicknameInput.value = options.initialData?.nickname ?? "";
  nicknameInput.type = "text";
  nicknameInput.placeholder = "미입력시 실명으로 등록됩니다.";
  nicknameInput.className =
    "w-full border border-gray-300 p-2 rounded-md text-sm";
  nicknameInput.id = "nickname";
  nicknameInput.name = "nickname";
  nicknameLabel.htmlFor = "nickname";

  // 제목
  const titleLabel = document.createElement("label");
  titleLabel.className = "block text-sm font-bold";
  titleLabel.textContent = "제목";
  const titleInput = document.createElement("input");
  titleInput.value = options.initialData?.title ?? "";
  titleInput.type = "text";
  titleInput.placeholder = "리뷰 제목을 입력하세요";
  titleInput.className = "w-full border border-gray-300 p-2 rounded-md text-sm";
  titleInput.id = "title";
  titleInput.name = "title";
  titleLabel.htmlFor = "title";

  // 내용
  const contentLabel = document.createElement("label");
  contentLabel.className = "block text-sm font-bold";
  contentLabel.textContent = "내용";
  const reviewArea = document.createElement("textarea");
  reviewArea.value = options.initialData?.content ?? "";
  reviewArea.className =
    "w-full h-32 border border-gray-300 p-2 rounded-md text-sm resize-none";
  reviewArea.placeholder = "상품에 대한 솔직한 리뷰를 남겨주세요. (10자 이상)";
  reviewArea.id = "content";
  reviewArea.name = "content";
  contentLabel.htmlFor = "content";

  // 이미지 첨부
  const fileLabel = document.createElement("label");
  fileLabel.className = "block text-sm font-bold mb-2";
  fileLabel.textContent = "사진 첨부 (선택)";
  fileLabel.htmlFor = "images";

  //기본 이미지 미리보기 - edit모드만
  let remainingImages = [...(options.initialData?.reviewImages ?? [])];

  const existingImagePreview = document.createElement("div");
  existingImagePreview.className = "flex gap-2 flex-wrap";

  if (isEdit && options.initialData?.reviewImages?.length) {
    remainingImages.forEach((src) => {
      const wrapper = document.createElement("div");
      wrapper.className = "relative w-16 h-16";

      const img = document.createElement("img");
      img.src = src;
      img.className =
        "w-16 h-16 object-cover rounded-md border border-gray-200";
      img.alt = "기존 리뷰 이미지";

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.textContent = "X";
      removeBtn.className =
        "absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center";

      removeBtn.addEventListener("click", () => {
        remainingImages = remainingImages.filter((url) => url !== src);
        wrapper.remove();
      });
      wrapper.append(img, removeBtn);
      existingImagePreview.append(wrapper);
    });
  }

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.multiple = true;
  fileInput.id = "images";
  fileInput.name = "images";
  fileInput.className =
    "text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-merino file:text-woody-brown hover:file:bg-cararra";

  const filePreview = document.createElement("ul");
  filePreview.className = "flex flex-col gap-1 text-xs text-zambezi";

  fileInput.addEventListener("change", () => {
    filePreview.innerHTML = "";

    existingImagePreview.classList.add("hidden");
    Array.from(fileInput.files).forEach((file) => {
      const li = document.createElement("li");
      li.textContent = `📎 ${file.name}`;
      filePreview.append(li);
    });
  });

  // 등록/수정 버튼
  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className =
    "w-full bg-woody-brown text-white py-3 rounded-md font-bold hover:bg-opacity-90";
  submitBtn.textContent = isEdit ? "수정완료" : "등록하기";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const content = reviewArea.value.trim();
    const imageFiles = Array.from(fileInput.files);
    const nickname = nicknameInput.value.trim() || userName;
    const isrecommended = recommendInput.checked;
    const rating = selectedRating;

    try {
      if (isEdit) {
        const images =
          imageFiles.length > 0
            ? await uploadReviewImages(imageFiles)
            : remainingImages;

        await updateReview(options.reviewId, {
          title,
          content,
          rating,
          isrecommended,
          nickname,
          images,
        });

        alert("리뷰가 수정되었습니다.");
        onClose();
        options.onRefresh?.();
      } else {
        const reviewData = {
          orderId,
          rating,
          isrecommended,
          nickname,
          title,
          content,
        };
        await submitReview(productId, reviewData, imageFiles);
        alert("리뷰가 등록되었습니다.");
        onClose();
        sessionStorage.setItem("scrollTo", "detail-reviews");
        window.location.reload();
      }
    } catch (e) {
      if (e.message.includes(400)) {
        alert("리뷰 내용은 10자 이상이어야 합니다.");
        return;
      }
      if (e.message.includes(409)) {
        alert("이미 리뷰를 작성했습니다.");
        return;
      }
      console.error(isEdit ? "수정 실패:" : "등록 실패:", e);
      alert(isEdit ? "수정에 실패했습니다." : "리뷰 등록에 실패했습니다.");
    }
  });

  form.append(
    starLabel,
    starGroup,
    recommendContainer,
    nicknameLabel,
    nicknameInput,
    titleLabel,
    titleInput,
    contentLabel,
    reviewArea,
    fileLabel,
    existingImagePreview,
    fileInput,
    filePreview,
    submitBtn,
  );
  return form;
}
