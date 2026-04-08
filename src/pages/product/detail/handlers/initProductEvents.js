export function initProductEvents() {
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
}
