import { getOrderTemplate } from "/src/pages/mypage/components/myOrderTemplate.js";
import { fetchOrder } from "/src/js/api/order/index.js";
import { createPagination } from "/src/components/ui/pagination.js"; // 경로 확인해줘요

const STATUS_MAP = {
  PAID: { text: "결제 완료", class: "text-dark-woody" },
  SHIPPING: { text: "배송 중", class: "text-ferra" },
  DELIVERED: { text: "배송 완료", class: "text-dark-woody" },
  CANCELLED: { text: "주문 취소", class: "text-dark-woody" },
};

export async function renderOrderList(page = 1) {
  const container = document.querySelector("#mypage-content");
  if (!container) return;

  container.innerHTML = getOrderTemplate();
  const tbody = document.querySelector("#order-list-container");

  try {
    // 현황용 전체 조회 + 페이지용 조회 동시에
    const [allRes, pageRes] = await Promise.all([
      fetchOrder(1, 999), // 전체
      fetchOrder(page), // 현재 페이지
    ]);

    if (!pageRes || !pageRes.data?.orders || pageRes.data.orders.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="py-10 text-center text-sm text-empress">
            주문 내역이 존재하지 않습니다.
          </td>
        </tr>
      `;
      return;
    }

    updateOrderSummary(allRes.data.orders); // 전체 기준으로 현황 계산
    renderOrders(pageRes.data.orders, tbody);

    const { totalPages, page: currentPage } = pageRes.meta.pagination;
    const pagination = createPagination({
      totalPages,
      currentPage,
      onPageChange: (newPage) => renderOrderList(newPage),
    });
    pagination.className += " justify-center mt-6";

    const tableWrapper = tbody.closest(".overflow-x-auto");
    tableWrapper.after(pagination);
  } catch (error) {
    console.error("Order Load Error:", error);
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="py-10 text-center text-sm text-empress">
          데이터를 불러오는 중 오류가 발생했습니다.
        </td>
      </tr>
    `;
  }
}

function updateOrderSummary(orders) {
  const counts = { PAID: 0, SHIPPING: 0, DELIVERED: 0, CANCELLED: 0 };
  orders.forEach((order) => {
    if (counts[order.status] !== undefined) {
      counts[order.status]++;
    }
  });

  const set = (id, count) => {
    const el = document.getElementById(id);
    if (el) el.textContent = count;
  };

  set("status-ordered", counts.PAID);
  set("status-shipping", counts.SHIPPING);
  set("status-completed", counts.DELIVERED);
  set("status-cancelled", counts.CANCELLED);
}

function renderOrders(orders, tbody) {
  tbody.textContent = "";
  const fragment = document.createDocumentFragment();

  orders.forEach((order) => {
    const date =
      order.orderDate?.split("T")[0].replace(/-/g, ".") || "0000.00.00";
    const statusInfo = STATUS_MAP[order.status] || {
      text: order.status,
      class: "text-dark-woody",
    };

    const tr = document.createElement("tr");
    tr.className =
      "grid grid-cols-[1fr_3fr_0.5fr_0.5fr] px-4 py-6 items-center text-sm transition-colors hover:bg-cararra/10 cursor-pointer";

    tr.addEventListener("click", () => {
      window.location.href = `/src/pages/mypage/order-detail/?id=${order.orderId}&from=order`;
    });

    tr.innerHTML = `
      <td class="flex flex-col gap-1">
        <span class="order-date text-dark-woody font-medium"></span>
        <span class="order-no text-[10px] text-empress"></span>
      </td>
      <td class="flex items-center gap-4">
        <img src="" alt="" class="order-thumb w-16 h-20 object-cover bg-cararra">
        <span class="product-name font-bold text-dark-woody truncate max-w-[350px]"></span>
      </td>
      <td class="price-text text-center font-light text-dark-woody"></td>
      <td class="text-right">
        <span class="status-text text-[11px] font-bold tracking-tighter"></span>
      </td>
    `;

    tr.querySelector(".order-date").textContent = date;
    tr.querySelector(".order-no").textContent = order.orderNumber || "";
    tr.querySelector(".order-thumb").src = order.representativeThumbnail || "";
    tr.querySelector(".order-thumb").alt =
      order.representativeProductName || "";
    tr.querySelector(".product-name").textContent =
      order.representativeProductName || "상품 정보 없음";
    tr.querySelector(".price-text").textContent =
      `${(order.totalPrice || 0).toLocaleString()}원`;

    const statusEl = tr.querySelector(".status-text");
    statusEl.textContent = statusInfo.text;
    statusEl.classList.add(statusInfo.class);

    fragment.appendChild(tr);
  });

  tbody.appendChild(fragment);
}
