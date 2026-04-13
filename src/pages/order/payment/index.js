// src/pages/order/payment/index.js
import { initStepIndicator } from "/src/components/ui/stepIndicator.js";
import { initOrderSummary } from "/src/components/ui/orderSummary.js";
import { fetchMe } from "/src/js/api/auth/index.js";
import {
  initPaymentMethods,
  initPointUsage,
  submitOrder,
} from "/src/pages/order/payment/handlers/renderPayment.js";
import { cartItemList } from "/src/js/api/cart/index.js";

async function initPaymentPage() {
  // 장바구니 체크
  const cartData = await cartItemList();
  if (!cartData.items || cartData.items.length === 0) {
    alert("결제할 상품이 없습니다.");
    location.href = "/";
    return;
  }

  // 배송지 체크
  const selectedAddress = sessionStorage.getItem("selectedAddress");
  if (!selectedAddress) {
    alert("배송지 정보가 없습니다.");
    location.href = "/src/pages/order/shipping/index.html";
    return;
  }

  initStepIndicator("payment");

  await initOrderSummary({
    showCoupon: false,
    showCartToggle: true,
    btnText: "결제하기",
    onBtnClick: () => submitOrder(),
  });

  // 보유 포인트 불러오기
  const me = await fetchMe();
  initPointUsage(me.point ?? 0);

  // 결제 수단 선택
  initPaymentMethods();
}

initPaymentPage();
