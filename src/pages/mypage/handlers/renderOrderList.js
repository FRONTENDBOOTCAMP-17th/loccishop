import { getOrderTemplate } from "/src/pages/mypage/components/myOrderTemplate.js";
import { fetchOrder } from "/src/js/api/order/index.js";
import { createPagination } from "/src/components/ui/pagination.js"; // 경로 확인해줘요

const STATUS_MAP = {
  PAID: { text: "결제 완료", class: "text-dark-woody" },
  SHIPPING: { text: "배송 중", class: "text-ferra" },
  DELIVERED: { text: "배송 완료", class: "text-dark-woody" },
  CANCELLED: { text: "주문 취소", class: "text-dark-woody" },
};

export async function renderOrderList(id, page = 1) {
  const container = document.querySelector("#mypage-content");
  if (!container) return;

  container.innerHTML = getOrderTemplate();
  const listContainer = document.querySelector("#order-list-container");

  try {
    // 현황용 전체 조회 + 페이지용 조회 동시에
    const [allRes, pageRes] = await Promise.all([
      fetchOrder(1, 999), // 전체
      fetchOrder(page), // 현재 페이지
    ]);

    if (!pageRes || !pageRes.data?.orders || pageRes.data.orders.length === 0) {
      listContainer.innerHTML = `
         <li class="py-10 text-center text-sm text-empress">
    주문 내역이 존재하지 않습니다.
  </li>
      `;
      return;
    }

    updateOrderSummary(allRes.data.orders); // 전체 기준으로 현황 계산
    renderOrders(pageRes.data.orders, listContainer);

    const { totalPages, page: currentPage } = pageRes.meta.pagination;
    const pagination = createPagination({
      totalPages,
      currentPage,
      onPageChange: (newPage) => renderOrderList(newPage),
    });
    pagination.className += " justify-center mt-6";

    listContainer.after(pagination);
  } catch (error) {
    console.error("Order Load Error:", error);
    listContainer.innerHTML = `
      <li class="py-10 text-center text-sm text-empress">
    데이터를 불러오는 중 오류가 발생했습니다.
  </li>
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

function renderOrders(orders, listContainer) {
  listContainer.textContent = "";
  const fragment = document.createDocumentFragment();

  orders.forEach((order) => {
    const date =
      order.orderDate?.split("T")[0].replace(/-/g, ".") || "0000.00.00";
    const statusInfo = STATUS_MAP[order.status] || {
      text: order.status,
      class: "text-dark-woody",
    };

    const li = document.createElement("li");
    li.className =
      "px-4 py-6 cursor-pointer hover:bg-cararra/10 transition-colors";
    li.addEventListener("click", () => {
      window.location.href = `/mypage/order-detail/?id=${order.orderId}&from=order`;
    });

    li.innerHTML = `
      <!-- 모바일: 카드형 / sm 이상: 테이블형 -->
      <div class="flex flex-col gap-4 sm:grid sm:grid-cols-[1fr_3fr_0.5fr_0.5fr] sm:items-center">
        
        <!-- 날짜 / 주문번호 -->
        <div class="flex sm:flex-col gap-2 sm:gap-1 items-center sm:items-start">
          <span class="order-date text-dark-woody font-medium text-sm"></span>
          <span class="order-no text-[10px] text-empress"></span>
        </div>

        <!-- 상품 이미지 + 이름 -->
        <div class="flex items-center gap-4">
          <img src="" alt="" class="order-thumb w-16 h-20 object-cover bg-cararra flex-shrink-0">
          <span class="product-name font-bold text-dark-woody text-sm line-clamp-2"></span>
        </div>

        <!-- 금액 + 상태 (모바일에서 한 줄로) -->
        <div class="flex justify-between items-center sm:contents">
          <span class="price-text font-light text-dark-woody text-sm sm:text-center"></span>
          <span class="status-text text-[11px] font-bold tracking-tighter sm:text-right"></span>
        </div>

      </div>
    `;

    li.querySelector(".order-date").textContent = date;
    li.querySelector(".order-no").textContent = order.orderNumber || "";
    li.querySelector(".order-thumb").src = order.representativeThumbnail || "";
    li.querySelector(".order-thumb").alt =
      order.representativeProductName || "";
    li.querySelector(".product-name").textContent =
      order.representativeProductName || "상품 정보 없음";
    li.querySelector(".price-text").textContent =
      `${(order.totalPrice || 0).toLocaleString()}원`;

    const statusEl = li.querySelector(".status-text");
    statusEl.textContent = statusInfo.text;
    statusEl.classList.add(statusInfo.class);

    fragment.appendChild(li);
  });

  listContainer.appendChild(fragment);
}
