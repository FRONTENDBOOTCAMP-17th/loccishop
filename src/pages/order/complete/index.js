import { checkTokenValidity } from "/src/js/utils/checkTokenValidity.js";
import { fetchOrderDetail } from "/src/js/api/order/index.js";

checkTokenValidity();
import { renderOrderDetail } from "/src/components/ui/orderDetail.js";

function checkOrderId() {
  const id = sessionStorage.getItem("orderId");

  if (!id) {
    window.location.href = "/";
    return;
  }
  return id;
}

async function initCompletePage() {
  const orderId = checkOrderId();

  if (!orderId) {
    return;
  }

  const order = await fetchOrderDetail(orderId);
  const completeMain = document.getElementById("complete-main");
  const orderNumber = document.getElementById("order-number");
  const container = document.getElementById("order-detail-section");

  orderNumber.textContent = order.orderNumber;

  renderOrderDetail(order, container);
  completeMain.classList.remove("hidden");
}
initCompletePage();
