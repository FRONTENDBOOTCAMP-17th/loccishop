export function getWishTemplate() {
  return `
<div class="flex justify-between items-baseline mb-12 border-b-2 border-dark-woody pb-6">
  <h4 class="text-xl font-light tracking-tight text-dark-woody">Wishlist</h4>
  <span class="text-[10px] text-empress uppercase tracking-[0.2em]" id="wish-count">-</span>
</div>

<div id="wish-list-container" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-20"></div>

<div id="wish-empty" class="hidden py-40 text-center">
  <p class="text-[10px] text-empress uppercase tracking-[0.3em] mb-10 italic">Your list is currently empty</p>
  <a href="/products" class="inline-block border border-dark-woody px-12 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-dark-woody hover:text-white transition-all">
    Go Shopping
  </a>
</div>
  `;
}
