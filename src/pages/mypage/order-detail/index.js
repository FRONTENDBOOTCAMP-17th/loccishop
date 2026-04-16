import { fetchOrderDetail } from "/src/js/api/order/index.js";
import { renderOrderDetail } from "/src/components/ui/orderDetail.js";

async function initOrderDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("id");

  if (!orderId) {
    window.location.href = "/";
    return;
  }

  try {
    const order = await fetchOrderDetail(orderId);
    const orderNumber = document.getElementById("order-number");
    const container = document.getElementById("order-detail-section");

    orderNumber.textContent = order.orderNumber;
    renderOrderDetail(order, container);
  } catch (error) {
    console.error("주문 상세 로딩 오류:", error);
  }
}

document.addEventListener("DOMContentLoaded", initOrderDetailPage);
