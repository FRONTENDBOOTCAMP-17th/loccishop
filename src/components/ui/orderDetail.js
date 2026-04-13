export function renderOrderDetail(order, container) {
  container.append(
    createOrderItems(order.items),
    createShippingInfo(order.shippingAddress),
    createPaymentInfo(order),
  );
}

export function createOrderItems(item) {
  const section = document.createElement("div");
  section.className = "flex flex-col gap-3 pb-6 border-b border-gray-200";

  const h2 = document.createElement("h2");
  h2.className = "text-sm font-bold";
  h2.textContent = "주문 상품";

  const ul = document.createElement("ul");
  ul.className = "flex flex-col gap-3";

  item.forEach((i) => {
    const li = document.createElement("li");
    li.className = "flex justify-between items-center text-sm";

    const nameEl = document.createElement("span");
    nameEl.className = "flex-1 text-woody-brown";

    const quantityEl = document.createElement("span");
    quantityEl.className = "text-zambezi mx-4";

    const priceEl = document.createElement("span");
    priceEl.className = "font-bold";

    nameEl.textContent = i.name;
    quantityEl.textContent = i.qty;
    priceEl.textContent = `₩${i.price.toLocaleString()}`;

    li.append(nameEl, quantityEl, priceEl);
    ul.append(li);
  });

  section.append(h2, ul);

  return section;
}

export function createShippingInfo(shippingAddress) {
  const section = document.createElement("div");
  section.className = "flex flex-col gap-3 pb-6 border-b border-gray-200";

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
    ...(shippingAddress.shippingRequest
      ? [{ label: "배송 요청사항", value: shippingAddress.shippingRequest }]
      : []),
  ];

  rows.forEach(({ label, value }) => {
    const row = document.createElement("div");
    row.className = "flex gap-4 items-start py-2 border-b border-gray-100";
    const labelEl = document.createElement("span");
    labelEl.className = "w-24 flex-shrink-0 text-xs text-gray-400";
    const valueEl = document.createElement("span");
    valueEl.className = "text-sm text-woody-brown font-medium";

    labelEl.textContent = label;
    valueEl.textContent = value;

    row.append(labelEl, valueEl);
    wrapper.append(row);
  });

  section.append(h2, wrapper);
  return section;
}

export function createPaymentInfo(order) {
  const section = document.createElement("div");
  section.className = "flex flex-col gap-3 pt-6";

  const h2 = document.createElement("h2");
  h2.className = "text-sm font-bold";
  h2.textContent = "결제 정보";

  const wrapper = document.createElement("div");
  wrapper.className = "flex flex-col gap-2 text-sm";

  const methodMap = {
    CARD: "신용/체크카드",
    KAKAO_PAY: "카카오페이",
    NAVER_PAY: "네이버페이",
  };

  const totalPrice = order.items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  const rows = [
    {
      label: "결제 수단",
      value: order.payment.map((m) => methodMap[m] ?? m).join(", "),
    },
    { label: "결제 금액", value: `₩${totalPrice.toLocaleString()}` },
    {
      label: "주문 일시",
      value: new Date(order.createdAt).toLocaleString("ko-KR"),
    },
  ];

  rows.forEach(({ label, value }) => {
    const row = document.createElement("div");
    row.className = "flex justify-between";

    const labelEl = document.createElement("span");
    labelEl.className = "text-zambezi";
    labelEl.textContent = label;

    const valueEl = document.createElement("span");
    valueEl.className = "font-bold";
    valueEl.textContent = value;

    row.append(labelEl, valueEl);
    wrapper.append(row);
  });

  section.append(h2, wrapper);
  return section;
}
