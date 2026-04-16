export function getReviewTemplate() {
  return `
    <section aria-labelledby="review-heading" class="max-w-3xl">
      <header class="flex justify-between items-end mb-16 border-b-2 border-dark-woody pb-8">
        <h4 id="review-heading" class="text-xl font-light tracking-tight text-dark-woody">Reviews</h4>
        <div class="text-right">
          <div class="flex items-center gap-3 justify-end mb-1">
            <span class="text-3xl font-light text-dark-woody tracking-tighter" id="review-average-score">4.7</span>
            <figure aria-label="평균 별점" class="flex text-ferra text-[8px]" id="total-stars-container"></figure>
          </div>
          <p class="text-[10px] text-empress uppercase tracking-[0.2em]" id="review-total-count">
            Based on 3 reviews
          </p>
        </div>
      </header>

      <ol id="review-list-container" class="space-y-20" aria-label="내 리뷰 목록"></ol>
    </section>
  `;
}
