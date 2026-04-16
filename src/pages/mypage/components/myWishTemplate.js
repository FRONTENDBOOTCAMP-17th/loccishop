export function getWishTemplate() {
  return `
    <section aria-labelledby="wish-heading">
      <header class="flex justify-between items-baseline mb-12 border-b-2 border-dark-woody pb-6">
        <h4 id="wish-heading" class="text-xl font-light tracking-tight text-dark-woody">Wishlist</h4>
        <p class="text-[10px] text-empress uppercase tracking-[0.2em]" id="wish-count">
          <span id="wish-count-number">3</span> items
        </p>
      </header>

      <ul id="wish-list-container" class="grid grid-cols-3 gap-x-12 gap-y-20" aria-label="위시리스트 상품 목록"></ul>

      <div id="wish-empty" class="hidden py-40 text-center" role="status" aria-live="polite">
        <p class="text-[10px] text-empress uppercase tracking-[0.3em] mb-10 italic">
          Your list is currently empty
        </p>
        
          href="/products"
          class="inline-block border border-dark-woody px-12 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-dark-woody hover:text-white transition-all"
        >
          Go Shopping
        </a>
      </div>
    </section>
  `;
}
