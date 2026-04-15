export async function renderInfo() {
  const container = document.querySelector("#mypage-content");
  if (!container) return;

  try {
    const response = await fetch("/src/pages/mypage/components/my-info.html");
    if (!response.ok) throw new Error("파일을 찾을 수 없습니다.");

    const html = await response.text();
    container.innerHTML = html;
  } catch (error) {
    container.innerHTML = `<p class="p-10 text-center text-error-red">화면을 불러오는 중 오류가 발생했습니다.</p>`;
    console.error(error);
  }
}
