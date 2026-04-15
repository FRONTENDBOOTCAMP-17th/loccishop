export async function renderReviewList() {
  const container = document.querySelector("#mypage-content");
  if (!container) return;

  try {
    const response = await fetch("/src/pages/mypage/components/my-review.html");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    container.innerHTML = html;
  } catch (error) {
    console.error("리뷰 레이아웃 로드 실패:", error);
  }
}
