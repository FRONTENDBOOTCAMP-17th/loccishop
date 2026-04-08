export function createReviewForm(productId, orderId) {
  const form = document.createElement("form");
  form.className = "flex flex-col gap-3";

  // 별점
  const starLabel = document.createElement("label");
  starLabel.className = "block text-sm font-bold mb-2";
  starLabel.textContent = "평점";
  const starSelect = document.createElement("select");
  starSelect.className = "w-full border border-gray-300 p-2 rounded-md";
  [5, 4, 3, 2, 1].forEach((num) => {
    const option = document.createElement("option");
    option.value = num;
    option.textContent = "⭐".repeat(num) + ` (${num}점)`;
    starSelect.append(option);
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

  // 제목
  const titleLabel = document.createElement("label");
  titleLabel.className = "block text-sm font-bold";
  titleLabel.textContent = "제목";
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.placeholder = "리뷰 제목을 입력하세요";
  titleInput.className = "w-full border border-gray-300 p-2 rounded-md text-sm";

  // 내용
  const contentLabel = document.createElement("label");
  contentLabel.className = "block text-sm font-bold";
  contentLabel.textContent = "내용";
  const reviewArea = document.createElement("textarea");
  reviewArea.className =
    "w-full h-32 border border-gray-300 p-2 rounded-md text-sm resize-none";
  reviewArea.placeholder = "상품에 대한 솔직한 리뷰를 남겨주세요. (10자 이상)";

  // 이미지 첨부
  const fileLabel = document.createElement("label");
  fileLabel.className = "block text-sm font-bold mb-2";
  fileLabel.textContent = "사진 첨부 (선택)";
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.className =
    "text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-merino file:text-woody-brown hover:file:bg-cararra";

  // 등록 버튼
  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className =
    "w-full bg-woody-brown text-white py-3 rounded-md font-bold hover:bg-opacity-90";
  submitBtn.textContent = "등록하기";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("데이터 전송:", {
      productId,
      orderId,
      rating: starSelect.value,
      recommend: recommendInput.checked,
      title: titleInput.value,
      content: reviewArea.value,
      image: fileInput.files[0] ?? null,
    });
    // TODO: 리뷰 작성 API 연결
  });

  form.append(
    starLabel,
    starSelect,
    recommendContainer,
    titleLabel,
    titleInput,
    contentLabel,
    reviewArea,
    fileLabel,
    fileInput,
    submitBtn,
  );
  return form;
}
