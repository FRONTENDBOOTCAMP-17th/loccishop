export function getBestReviewTemplate() {
  return `
    <section id="best-review-section" class="flex flex-col gap-4 mt-9">
  <h2 class="text-xl leading-7">베스트리뷰</h2>
  <article class="bg-rose-white p-3">
    <header class="flex flex-col gap-4">
      <div id="best-review-stars" class="flex" role="img" aria-label=""></div>
      <h3 id="review-title" class="leading-5"></h3>
    </header>
    <p id="review-content" class="text-sm leading-5 my-0.5 text-zambezi"></p>
    <footer class="flex justify-between py-3.5">
      <span id="author" class="text-xs leading-4 tracking-[.03em]"></span>
      <a href="#reviews" class="text-xs leading-4 tracking-[.03em] underline"
        >전체 리뷰보기</a
      >
    </footer>
  </article>
</section>

  `;
}