export function renderOrderDetail(order, container) {
  container.append(
    createOrderItems(order.items),
    createShippingInfo(order.shippingAddress),
    createPaymentInfo(order),
  );
}

export function createOrderItems(items) {
  const section = document.createElement("div");
  section.className = "flex flex-col gap-3 pb-6 border-b border-gray-200";

  const h2 = document.createElement("h2");
  h2.className = "text-sm font-bold";
  h2.textContent = "주문 상품";

  const ul = document.createElement("ul");
  ul.className = "flex flex-col gap-3 ";

  items.forEach((item) => {
    const {
      productId,
      name,
      qty,
      price,
      discountPrice,
      discountRate,
      subtotal,
      thumbnailUrl,
    } = item;

    const li = document.createElement("li");
    li.className = "flex gap-3 items-center";

    const img = document.createElement("img");
    img.className = "w-14 h-14 object-cover rounded bg-merino flex-shrink-0";
    img.src = thumbnailUrl;
    img.alt = name;

    const info = document.createElement("div");
    info.className = "flex flex-1 justify-between items-center gap-2";

    const textGroup = document.createElement("div");
    textGroup.className = "flex flex-col gap-0.5";

    const nameEl = document.createElement("span");
    nameEl.className = "text-sm font-medium cursor-pointer hover:underline";
    nameEl.textContent = name;
    nameEl.addEventListener("click", () => {
      window.location.href = `/product/detail?id=${productId}`;
    });

    const qtyEl = document.createElement("span");
    qtyEl.className = "text-xs text-zambezi";
    qtyEl.textContent = `수량 ${qty}개`;

    textGroup.append(nameEl, qtyEl);

    const priceEl = document.createElement("span");
    priceEl.className = "text-sm font-bold flex-shrink-0";
    priceEl.textContent = `₩${subtotal.toLocaleString()}`;

    info.append(textGroup, priceEl);
    li.append(img, info);
    ul.append(li);
  });

  section.append(h2, ul);
  return section;
}

export function createShippingInfo(shippingAddress) {
  const section = document.createElement("div");
  section.id = "shipping-info-section";
  section.className = "flex flex-col gap-3 py-6 border-b border-gray-200";

  const h2 = document.createElement("h2");
  h2.className = "text-sm font-bold";
  h2.textContent = "배송 정보";

  const wrapper = document.createElement("div");
  wrapper.className = "flex flex-col gap-3";

  const rows = [
    { label: "수령인", value: shippingAddress.receiverName },
    { label: "연락처", value: shippingAddress.receiverPhone },
    { label: "주소", value: shippingAddress.baseAddress },
    { label: "상세주소", value: shippingAddress.detailAddress },
  ];

  rows.forEach(({ label, value }) => {
    const row = document.createElement("div");
    row.className = "flex gap-4 items-start py-2 border-b border-gray-100";

    const labelEl = document.createElement("span");
    labelEl.className = "w-24 flex-shrink-0 text-xs text-gray-400";
    labelEl.textContent = label;

    const valueEl = document.createElement("span");
    valueEl.className = "text-sm text-woody-brown font-medium";
    valueEl.textContent = value;

    row.append(labelEl, valueEl);
    wrapper.append(row);
  });

  section.append(h2, wrapper);
  return section;
}

export function createPaymentInfo(order) {
  const { totalAmount, usedPoint, earnedPoint, payment, createdAt } = order;

  const section = document.createElement("div");
  section.className = "flex flex-col gap-3 pt-6";

  const h2 = document.createElement("h2");
  h2.className = "text-sm font-bold";
  h2.textContent = "결제 정보";

  const wrapper = document.createElement("div");
  wrapper.className = "flex flex-col gap-2 text-sm";

  const methodMap = {
    CARD: "신용/체크카드",
    BANK_TRANSFER: "무통장 입금",
    KAKAO_PAY: "카카오페이",
    NAVER_PAY: "네이버페이",
  };

  const rows = [
    {
      label: "결제 수단",
      value: payment.map((m) => methodMap[m] ?? m).join(", "),
    },
    ...(usedPoint > 0
      ? [
          {
            label: "포인트 사용",
            value: `-${usedPoint.toLocaleString()}P`,
            accent: true,
          },
        ]
      : []),
    {
      label: "결제 금액",
      value: `₩${totalAmount.toLocaleString()}`,
      bold: true,
    },
    { label: "주문 일시", value: new Date(createdAt).toLocaleString("ko-KR") },
  ];

  rows.forEach(({ label, value, accent, bold }) => {
    const row = document.createElement("div");
    row.className = "flex justify-between";

    const labelEl = document.createElement("span");
    labelEl.className = "text-zambezi";
    labelEl.textContent = label;

    const valueEl = document.createElement("span");
    valueEl.className =
      `${bold ? "font-bold text-base" : "font-bold"} ${accent ? "text-woody-brown" : ""}`.trim();
    valueEl.textContent = value;

    row.append(labelEl, valueEl);
    wrapper.append(row);
  });

  if (earnedPoint > 0) {
    const earnedEl = document.createElement("p");
    earnedEl.className = "text-xs text-zambezi mt-1";
    earnedEl.textContent = `이번 주문으로 ${earnedPoint.toLocaleString()}P 적립 예정`;
    wrapper.append(earnedEl);
  }

  section.append(h2, wrapper);
  return section;
}
