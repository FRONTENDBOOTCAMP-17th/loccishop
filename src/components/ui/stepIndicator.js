// 현재 단계: 'cart' | 'shipping' | 'payment'
export function initStepIndicator(currentStep) {
  const container = document.querySelector("#step-indicator");
  if (!container) {
    return;
  }

  const steps = [
    { key: "cart", label: "장바구니", icon: "/src/assets/icon/cart.svg" },
    { key: "shipping", label: "배송", icon: "/src/assets/icon/delivery.svg" },
    { key: "payment", label: "결제", icon: "/src/assets/icon/payment.svg" },
  ];

  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  container.className = "flex items-center justify-center gap-0 mb-10";
  container.innerHTML = "";

  steps.forEach((step, i) => {
    const isDone = i <= currentIndex;

    const item = document.createElement("div");
    item.className = "flex flex-col items-center gap-1";

    const circle = document.createElement("div");
    circle.className = [
      "w-10 h-10 rounded-full border-2 flex items-center justify-center",
      isDone ? "border-woody-brown bg-woody-brown" : "border-gray-300",
    ].join(" ");

    const icon = document.createElement("img");
    icon.src = step.icon;
    icon.alt = "";
    icon.className = isDone
      ? "w-5 h-5 brightness-0 invert"
      : "w-5 h-5 opacity-30";

    circle.append(icon);

    const label = document.createElement("span");
    label.textContent = step.label;
    label.className = isDone
      ? "text-xs font-bold text-woody-brown"
      : "text-xs text-gray-400";

    item.append(circle, label);
    container.append(item);

    if (i < steps.length - 1) {
      const line = document.createElement("div");
      line.className = [
        "w-24 lg:w-40 h-px mb-4",
        i < currentIndex ? "bg-woody-brown" : "bg-gray-300",
      ].join(" ");
      container.append(line);
    }
  });
}
