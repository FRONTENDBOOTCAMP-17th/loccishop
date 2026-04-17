import { cartItemList } from "/src/js/api/cart/index.js";
import { createOrder } from "/src/js/api/order/index.js";
import { fetchMe } from "/src/js/api/auth/index.js";
import { updateOrderSummary } from "/src/components/ui/orderSummary.js";

let selectedMethod = null;
let usedPoint = 0;

// 결제수단 선택
export function initPaymentMethods() {
  const buttons = document.querySelectorAll(".payment-method-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      //기존 선택 해제
      buttons.forEach((b) => {
        b.classList.remove("border-woody-brown");
        b.classList.add("border-gray-200");
      });

      //선택된 버튼
      btn.classList.remove("border-gray-200");
      btn.classList.add("border-woody-brown");

      selectedMethod = btn.dataset.method;
    });
  });
}

// 포인트 사용
export function initPointUsage(availablePoint) {
  const avaliblePointEl = document.getElementById("available-point");
  const usePointInput = document.getElementById("use-point-input");
  const usePointBtn = document.getElementById("use-point-btn");
  const usePointEl = document.getElementById("used-point");

  if (availablePoint) {
    avaliblePointEl.textContent = `${availablePoint.toLocaleString()}P`;
  }
  usePointInput.value = usedPoint;
  usePointInput.max = availablePoint;
  usePointInput.step = 100;

  usePointInput.addEventListener("focus", () => {
    usePointInput.value = "";
  });

  usePointBtn.addEventListener("click", () => {
    const inputVal = Number(usePointInput.value);

    if (inputVal < 0) {
      alert("0 이상의 포인트를 입력해 주세요");
      usePointInput.value = 0;
      return;
    }

    if (inputVal > availablePoint) {
      alert(
        `보유 포인트 (${availablePoint.toLocaleString()}P)를 초과할 수 없습니다.`,
      );
      usePointInput.value = availablePoint;
      return;
    }

    usedPoint = Math.floor(inputVal / 100) * 100;
    usePointEl.textContent = `${usedPoint.toLocaleString()}P`;
    updateOrderSummary({ usedPoint });

    if (inputVal !== usedPoint) {
      alert(
        `${usedPoint.toLocaleString()}P가 적용되었습니다. (100P 단위로 적용)`,
      );
    }

    usePointInput.value = "";
  });
}

// 결제하기
export async function submitOrder() {
  if (!selectedMethod) {
    alert("결제수단을 선택해 주세요.");
    return;
  }

  const agreeTerms = document.getElementById("agree-terms");
  if (!agreeTerms.checked) {
    alert("이용약관 및 개인정보처리방침에 동의해 주세요.");
    return;
  }

  const selectedAddress = JSON.parse(sessionStorage.getItem("selectedAddress"));
  const deliveryMemo = sessionStorage.getItem("deliveryMemo") ?? "";

  if (!selectedAddress) {
    alert("배송지 정보가 없습니다. 배송지 페이지로 이동합니다.");
    window.location.href = "/src/pages/order/shipping/index.html";
    return;
  }

  //장바구니상품 가져오기
  const cartData = await cartItemList();

  if (!cartData.items || cartData.items.length === 0) {
    alert("결제할 상품이 없습니다.");
    return;
  }

  const items = cartData.items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }));

  //주문 정보
  const orderData = {
    items,
    paymentMethod: selectedMethod,
    usedPoint: usedPoint,
    shippingInfo: {
      receiverName: selectedAddress.name,
      phone: selectedAddress.phone,
      baseAddress: selectedAddress.address,
      detailAddress: selectedAddress.detailAddress ?? "",
      request: deliveryMemo,
    },
  };

  try {
    const result = await createOrder(orderData);

    const me = await fetchMe();
    document.getElementById("available-point").textContent =
      `${me.point.toLocaleString()}P`;

    sessionStorage.removeItem("selectedAddress");
    sessionStorage.removeItem("deliveryMemo");

    sessionStorage.setItem("orderId", result.orderId);
    alert(`주문이 완료되었습니다.\n주문번호 :${result.orderNumber}`);
    window.location.href = "/src/pages/order/complete/index.html";
  } catch (e) {
    if (e.message.includes(404)) {
      alert("상품을 찾을 수 없습니다.");
      return;
    }
    console.error("주문 오류:", e);
    alert("주문에 실패했습니다. 다시 시도해주세요.");
  }
}
