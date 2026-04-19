import { cartItemList } from "/src/js/api/cart/index.js";

let cachedTotal = 0;

// 주문 요약 초기화
export async function initOrderSummary({
  showCartToggle = false,
  btnText = "결제 계속하기",
  onBtnClick = null,
} = {}) {
  const section = document.querySelector("#order-summary-section");
  if (!section) {
    return;
  }

  section.innerHTML = "";

  const data = await cartItemList();
  const { items, total, shipping } = data;
  cachedTotal = total;

  // 장바구니 보기 토글 (배송/결제 페이지)
  if (showCartToggle) {
    const toggleWrapper = document.createElement("div");
    toggleWrapper.className = "border border-gray-200 rounded p-4";

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className =
      "flex justify-between items-center w-full text-sm font-bold";

    const toggleLabel = document.createElement("span");
    toggleLabel.textContent = `장바구니 보기 (${items.length})`;

    const toggleIcon = document.createElement("span");
    toggleIcon.className = "text-xs text-zambezi";
    toggleIcon.textContent = "▼";

    toggleBtn.append(toggleLabel, toggleIcon);

    const cartSummaryList = document.createElement("ul");
    cartSummaryList.className = "hidden flex-col gap-2 mt-3";

    items.forEach((item) => {
      const li = document.createElement("li");
      li.className = "flex justify-between text-xs text-zambezi py-1";

      const name = document.createElement("span");
      name.textContent = `${item.productName} x${item.quantity}`;
      name.className = "truncate flex-1 mr-2";

      const price = document.createElement("span");
      price.textContent = `₩${item.subtotal.toLocaleString()}`;
      price.className = "flex-shrink-0";

      li.append(name, price);
      cartSummaryList.append(li);
    });

    let isOpen = false;
    toggleBtn.addEventListener("click", () => {
      isOpen = !isOpen;
      cartSummaryList.classList.toggle("hidden", !isOpen);
      cartSummaryList.classList.toggle("flex", isOpen);
      toggleIcon.textContent = isOpen ? "▲" : "▼";
    });

    toggleWrapper.append(toggleBtn, cartSummaryList);
    section.append(toggleWrapper);
  }

  // 주문 요약
  const summaryDiv = document.createElement("div");
  summaryDiv.className =
    "border border-gray-200 rounded p-4 flex flex-col gap-3";

  const productRow = document.createElement("div");
  productRow.className = "flex justify-between text-sm";
  const productLabel = document.createElement("span");
  productLabel.textContent = "제품";
  const productPrice = document.createElement("span");
  productPrice.id = "summary-product-price";
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  productPrice.textContent = `₩${subtotal.toLocaleString()}`;
  productRow.append(productLabel, productPrice);

  const shippingRow = document.createElement("div");
  shippingRow.className = "flex justify-between text-sm";
  const shippingLabel = document.createElement("span");
  shippingLabel.textContent = "배송비";
  const shippingFee = document.createElement("span");
  shippingFee.id = "summary-shipping";
  shippingFee.className = "text-blue-500";
  shippingFee.textContent =
    shipping === 0 ? "무료" : `₩${shipping.toLocaleString()}`;
  shippingRow.append(shippingLabel, shippingFee);

  const pointRow = document.createElement("div");
  pointRow.id = "summary-point-row";
  pointRow.className = "flex justify-between text-sm hidden";

  const pointLabel = document.createElement("span");
  pointLabel.textContent = "포인트 사용";

  const pointValue = document.createElement("span");
  pointValue.id = "summary-point-value";
  pointValue.className = "text-woody-brown font-semibold";

  pointRow.append(pointLabel, pointValue);

  const totalRow = document.createElement("div");
  totalRow.className =
    "border-t border-gray-200 pt-3 flex justify-between text-base font-bold";
  const totalLabel = document.createElement("span");
  totalLabel.textContent = "최종 결제 금액";
  const totalPrice = document.createElement("span");
  totalPrice.id = "summary-total";
  totalPrice.textContent = `₩${total.toLocaleString()}`;
  totalRow.append(totalLabel, totalPrice);

  summaryDiv.append(productRow, shippingRow, pointRow, totalRow);
  section.append(summaryDiv);

  // 4. 버튼
  const btn = document.createElement("button");
  btn.type = "button";
  btn.id = "order-summary-btn";
  btn.className =
    "w-full bg-woody-brown text-white py-4 rounded text-sm font-bold hover:bg-opacity-90 transition-opacity";
  btn.textContent = btnText;

  if (onBtnClick) {
    btn.addEventListener("click", onBtnClick);
  }

  section.append(btn);
}

export function updateOrderSummary({
  subtotal,
  total,
  shipping,
  usedPoint = 0,
}) {
  const productPrice = document.querySelector("#summary-product-price");
  const shippingFee = document.querySelector("#summary-shipping");
  const totalPrice = document.querySelector("#summary-total");
  const pointRow = document.querySelector("#summary-point-row");
  const pointValue = document.querySelector("#summary-point-value");

  if (productPrice && subtotal !== undefined) {
    productPrice.textContent = `₩${subtotal.toLocaleString()}`;
  }
  if (shippingFee && shipping !== undefined) {
    shippingFee.textContent =
      shipping === 0 ? "무료" : `₩${shipping.toLocaleString()}`;
  }
  if (pointRow && pointValue) {
    if (usedPoint > 0) {
      pointValue.textContent = `-${usedPoint.toLocaleString()}P`;
      pointRow.classList.remove("hidden");
    } else {
      pointRow.classList.add("hidden");
    }
  }

  if (totalPrice) {
    const base = total !== undefined ? total : cachedTotal;
    totalPrice.textContent = `₩${(base - usedPoint).toLocaleString()}`;
  }
}
