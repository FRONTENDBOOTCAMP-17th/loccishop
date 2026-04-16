export function getOrderTemplate() {
  return `
<div class="overflow-x-auto mb-20 border-b border-cararra pb-12">
  <div class="flex justify-between items-center min-w-[480px]">
    <div class="flex-1">
      <p class="text-[10px] text-empress uppercase tracking-[0.2em] mb-4">Ordered</p>
      <p class="text-3xl font-light text-dark-woody" id="status-ordered">0</p>
    </div>
    <div class="flex-1 border-l border-cararra/50 pl-10">
      <p class="text-[10px] text-ferra uppercase tracking-[0.2em] mb-4 font-bold">Shipping</p>
      <p class="text-3xl font-light text-ferra" id="status-shipping">0</p>
    </div>
    <div class="flex-1 border-l border-cararra/50 pl-10">
      <p class="text-[10px] text-empress uppercase tracking-[0.2em] mb-4">Delivered</p>
      <p class="text-3xl font-light text-dark-woody" id="status-completed">0</p>
    </div>
    <div class="flex-1 border-l border-cararra/50 pl-10">
      <p class="text-[10px] text-empress uppercase tracking-[0.2em] mb-4">Returns</p>
      <p class="text-3xl font-light text-dark-woody" id="status-cancelled">0</p>
    </div>
  </div>
</div>

<div>
  <div class="flex justify-between items-center mb-8">
    <h4 class="text-xs tracking-[0.3em] text-empress uppercase font-black">Order History</h4>
  </div>
  <div class="overflow-x-auto">
    <div class="min-w-[640px]">
      <div class="grid grid-cols-[1fr_2fr_1fr_1fr] px-4 py-3 border-y border-dark-woody text-[10px] text-empress uppercase tracking-widest font-bold">
        <div>Date / No.</div>
        <div>Product info</div>
        <div class="text-center">Amount</div>
        <div class="text-right">Status</div>
      </div>
      <div id="order-list-container" class="divide-y divide-cararra/50"></div>
    </div>
  </div>
</div>
  `;
}
