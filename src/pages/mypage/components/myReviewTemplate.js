export function getReviewTemplate() {
  return `
<section aria-labelledby="review-heading">
  <header class="flex justify-between items-baseline mb-12 border-b-2 border-dark-woody pb-6">
    <h4 id="review-heading" class="text-xl font-light tracking-tight text-dark-woody">Reviews</h4>
    <p class="text-[10px] text-empress uppercase tracking-[0.2em]" id="review-count">-</p>
  </header>
  <ol id="review-list-container" class="space-y-20" aria-label="내 리뷰 목록"></ol>
</section>
  `;
}
