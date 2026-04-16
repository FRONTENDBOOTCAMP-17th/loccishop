export function getOrderTemplate() {
  return `
<section aria-labelledby="order-status-heading">
  <h3 id="order-status-heading" class="sr-only">주문 처리 현황</h3>
  <div class="overflow-x-auto mb-20 border-b border-cararra pb-12">
    <dl class="flex justify-between items-center min-w-[480px]">
      <div class="flex-1">
        <dt class="text-[10px] text-empress uppercase tracking-[0.2em] mb-4">Ordered</dt>
        <dd class="text-3xl font-light text-dark-woody" id="status-ordered">0</dd>
      </div>
      <div class="flex-1 border-l border-cararra/50 pl-10">
        <dt class="text-[10px] text-ferra uppercase tracking-[0.2em] mb-4 font-bold">Shipping</dt>
        <dd class="text-3xl font-light text-ferra" id="status-shipping">0</dd>
      </div>
      <div class="flex-1 border-l border-cararra/50 pl-10">
        <dt class="text-[10px] text-empress uppercase tracking-[0.2em] mb-4">Delivered</dt>
        <dd class="text-3xl font-light text-dark-woody" id="status-completed">0</dd>
      </div>
      <div class="flex-1 border-l border-cararra/50 pl-10">
        <dt class="text-[10px] text-empress uppercase tracking-[0.2em] mb-4">Canceled</dt>
        <dd class="text-3xl font-light text-dark-woody" id="status-cancelled">0</dd>
      </div>
    </dl>
  </div>
</section>

<section aria-labelledby="order-history-heading">
  <header class="flex justify-between items-center mb-8">
    <h4 id="order-history-heading" class="text-xs tracking-[0.3em] text-empress uppercase font-black">Order History</h4>
  </header>
  <div class="overflow-x-auto">
    <table class="w-full min-w-[640px]">
      <thead>
        <tr class="grid grid-cols-[1fr_3fr_0.5fr_0.5fr] px-4 py-3 border-y border-dark-woody text-[10px] text-empress uppercase tracking-widest font-bold ">
          <th scope="col" class="text-left font-bold">Date / No.</th>
          <th scope="col" class="text-center font-bold">Product info</th>
          <th scope="col" class="text-center font-bold">Amount</th>
          <th scope="col" class="text-right font-bold">Status</th>
        </tr>
      </thead>
      <tbody id="order-list-container" class="divide-y divide-cararra/50">
        <tr>
          <td colspan="4" class="py-10 text-center text-sm text-empress">
            주문 내역을 불러오는 중입니다...
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</section>
`;
}
