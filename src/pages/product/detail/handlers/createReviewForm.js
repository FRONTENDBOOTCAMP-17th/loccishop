import { submitReview } from "/src/js/api/review/index.js";
import { fetchMe } from "/src/js/api/auth/index.js";

export async function createReviewForm(productId, orderId, onClose) {
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

  let selectedRating = 5; // 기본값

  [1, 2, 3, 4, 5].forEach((num) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.rating = num;

    const img = document.createElement("img");
    img.src = "/src/assets/icon/star.svg";
    img.alt = `${num}점`;
    img.className = "w-6 h-6";
    btn.append(img);

    btn.addEventListener("click", () => {
      selectedRating = num;
      // 선택된 별 이하는 채운 별, 초과는 빈 별
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
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.multiple = true;
  fileInput.id = "images";
  fileInput.name = "images";
  fileLabel.htmlFor = "images";

  const filePreview = document.createElement("ul");
  filePreview.className = "flex flex-col gap-1 text-xs text-zambezi";

  fileInput.addEventListener("change", () => {
    filePreview.innerHTML = ""; // 초기화
    Array.from(fileInput.files).forEach((file) => {
      const li = document.createElement("li");
      li.textContent = `📎 ${file.name}`;
      filePreview.append(li);
    });
  });

  fileInput.className =
    "text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-merino file:text-woody-brown hover:file:bg-cararra";

  // 등록 버튼
  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className =
    "w-full bg-woody-brown text-white py-3 rounded-md font-bold hover:bg-opacity-90";
  submitBtn.textContent = "등록하기";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const reviewData = {
      orderId,
      rating: selectedRating,
      isRecommend: recommendInput.checked,
      nickname: nicknameInput.value.trim() || userName,
      title: titleInput.value,
      content: reviewArea.value,
    };
    const imageFiles = Array.from(fileInput.files);

    try {
      await submitReview(productId, reviewData, imageFiles);
      alert("리뷰가 등록되었습니다.");
      onClose();
      sessionStorage.setItem("scrollTo", "detail-reviews");
      window.location.reload();
    } catch (e) {
      if (e.message.includes(400)) {
        alert("리뷰 내용은 10자 이상이어야 합니다.");
        return;
      }
      if (e.message.includes(409)) {
        alert("이미 리뷰를 작성했습니다.");
        return;
      }
      console.error("리뷰 등록 실패:", e);
      alert("리뷰 등록에 실패했습니다. 다시 시도해주세요.");
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
    fileInput,
    filePreview,
    submitBtn,
  );
  return form;
}
