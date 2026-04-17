import {
  fetchOrderDetail,
  cancelOrder,
  updateOrderShipping,
} from "/src/js/api/order/index.js";

import { renderOrderDetail } from "/src/components/ui/orderDetail.js";
import { createModal } from "/src/components/ui/modal.js";

function createCancelModalContent(onConfirm) {
  const CANCEL_REASONS = [
    "단순 변심",
    "배송 지연",
    "상품 정보 상이",
    "다른 상품 주문 예정",
    "기타",
  ];

  const wrapper = document.createElement("div");
  wrapper.className = "flex flex-col gap-4";

  const select = document.createElement("select");
  select.className = "w-full border border-gray-300 rounded px-3 py-2 text-sm";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "취소 사유를 선택해주세요";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  select.append(defaultOption);

  CANCEL_REASONS.forEach((reason) => {
    const option = document.createElement("option");
    option.value = reason;
    option.textContent = reason;
    select.append(option);
  });

  const textarea = document.createElement("textarea");
  textarea.className =
    "w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none hidden";
  textarea.placeholder = "취소 사유를 직접 입력해주세요.";
  textarea.rows = 3;

  select.addEventListener("change", () => {
    if (select.value === "기타") {
      textarea.classList.remove("hidden");
      textarea.focus();
    } else {
      textarea.classList.add("hidden");
      textarea.value = "";
    }
  });

  const confirmBtn = document.createElement("button");
  confirmBtn.type = "button";
  confirmBtn.className =
    "w-full py-3 bg-dark-woody text-white text-sm font-bold hover:opacity-90 transition-opacity";
  confirmBtn.textContent = "주문 취소";
  confirmBtn.addEventListener("click", () => {
    if (!select.value) {
      alert("취소 사유를 선택해주세요.");
      return;
    }
    if (select.value === "기타" && !textarea.value.trim()) {
      alert("취소 사유를 입력해주세요.");
      return;
    }
    const reason =
      select.value === "기타" ? textarea.value.trim() : select.value;
    onConfirm(reason);
  });

  wrapper.append(select, textarea, confirmBtn);
  return wrapper;
}

function renderShippingForm(shippingAddress, section, onSave) {
  section.innerHTML = "";

  const h2 = document.createElement("h2");
  h2.className = "text-sm font-bold";
  h2.textContent = "배송 정보";

  const form = document.createElement("div");
  form.className = "flex flex-col gap-3";

  const inputs = {};

  // 1. 수령인, 연락처
  const topFields = [
    {
      label: "수령인",
      key: "receiverName",
      type: "text",
      value: shippingAddress.receiverName,
    },
    {
      label: "연락처",
      key: "phone",
      type: "tel",
      value: shippingAddress.receiverPhone,
    },
  ];

  topFields.forEach(({ label, key, type, value }) => {
    const wrapper = document.createElement("div");
    wrapper.className = "flex gap-4 items-center py-2 border-b border-gray-100";

    const labelEl = document.createElement("label");
    labelEl.className = "w-24 flex-shrink-0 text-xs text-gray-400";
    labelEl.textContent = label;

    const input = document.createElement("input");
    input.type = type;
    input.value = value ?? "";
    input.className =
      "flex-1 border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-dark-woody";

    if (type === "tel") {
      input.addEventListener("input", () => {
        let digits = input.value.replace(/[^0-9]/g, "");
        if (digits.length <= 3) {
          input.value = digits;
        } else if (digits.length <= 7) {
          input.value = `${digits.slice(0, 3)}-${digits.slice(3)}`;
        } else {
          input.value = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
        }
      });
    }

    inputs[key] = input;
    wrapper.append(labelEl, input);
    form.append(wrapper);
  });

  // 2. 기본 주소 (다음 검색)
  const addressWrapper = document.createElement("div");
  addressWrapper.className =
    "flex flex-col gap-2 py-2 border-b border-gray-100";

  const addressLabel = document.createElement("span");
  addressLabel.className = "text-xs text-gray-400";
  addressLabel.textContent = "기본 주소";

  const addressRow = document.createElement("div");
  addressRow.className = "flex gap-2";

  const addressInput = document.createElement("input");
  addressInput.type = "text";
  addressInput.value = shippingAddress.baseAddress ?? "";
  addressInput.readOnly = true;
  addressInput.className =
    "flex-1 border border-gray-300 px-3 py-1.5 text-sm outline-none bg-gray-50 min-w-0";

  const searchBtn = document.createElement("button");
  searchBtn.type = "button";
  searchBtn.className =
    "px-3 py-1.5 border border-gray-300 text-sm hover:bg-cararra transition-colors whitespace-nowrap flex-shrink-0"; // whitespace-nowrap 추가
  searchBtn.textContent = "주소 검색";

  searchBtn.addEventListener("click", () => {
    new daum.Postcode({
      oncomplete: (data) => {
        addressInput.value = data.roadAddress;
      },
    }).open();
  });

  addressRow.append(addressInput, searchBtn);
  addressWrapper.append(addressLabel, addressRow);
  inputs.baseAddress = addressInput;
  form.append(addressWrapper);

  // 3. 상세주소, 배송 요청사항
  const bottomFields = [
    {
      label: "상세주소",
      key: "detailAddress",
      type: "text",
      value: shippingAddress.detailAddress,
      placeholder: "상세주소",
    },
  ];

  bottomFields.forEach(({ key, type, value, placeholder }) => {
    const input = document.createElement("input");
    input.type = type;
    input.value = value ?? "";
    input.placeholder = placeholder ?? "";
    input.className =
      "w-full border border-gray-300 px-3 py-1 text-sm outline-none focus:border-dark-woody";

    inputs[key] = input;
    form.append(input);
  });

  // 4. 버튼 그룹
  const btnGroup = document.createElement("div");
  btnGroup.className = "flex gap-2 mt-2";

  const saveBtn = document.createElement("button");
  saveBtn.type = "button";
  saveBtn.className =
    "flex-1 py-2 bg-dark-woody text-white text-sm font-bold hover:opacity-90 transition-opacity";
  saveBtn.textContent = "저장";
  saveBtn.addEventListener("click", () => {
    const formData = {
      receiverName: inputs.receiverName.value.trim(),
      receiverPhone: inputs.phone.value.trim(),
      baseAddress: inputs.baseAddress.value.trim(),
      detailAddress: inputs.detailAddress.value.trim(),
    };
    if (
      !formData.receiverName ||
      !formData.receiverPhone ||
      !formData.baseAddress
    ) {
      alert("수령인, 연락처, 주소는 필수 항목입니다.");
      return;
    }

    onSave(formData);
  });

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.className =
    "flex-1 py-2 border border-gray-300 text-sm font-bold hover:bg-cararra transition-colors";
  cancelBtn.textContent = "취소";
  cancelBtn.addEventListener("click", () => {
    window.location.reload();
  });

  btnGroup.append(cancelBtn, saveBtn);
  section.append(h2, form, btnGroup);
}

async function initOrderDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("id");

  document.getElementById("back-btn").addEventListener("click", () => {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");

    if (from === "order") {
      window.location.href = "/mypage?menu=order";
    } else {
      history.back();
    }
  });

  if (!orderId) {
    window.location.href = "/";
    return;
  }

  try {
    const order = await fetchOrderDetail(orderId);
    const orderNumber = document.getElementById("order-number");
    orderNumber.textContent = order.orderNumber;

    const STATUS_MAP = {
      PAID: { text: "결제 완료", class: "text-dark-woody bg-cararra" },
      SHIPPING: { text: "배송 중", class: "text-ferra bg-merino" },
      DELIVERED: { text: "배송 완료", class: "text-dark-woody bg-cararra" },
      CANCELLED: { text: "주문 취소", class: "text-white bg-empress" },
    };

    const statusInfo = STATUS_MAP[order.status] || {
      text: order.status,
      class: "text-dark-woody bg-cararra",
    };

    const statusBadge = document.createElement("span");
    statusBadge.className = `text-xs font-bold px-4 py-2 ${statusInfo.class}`;
    statusBadge.textContent = statusInfo.text;

    document.getElementById("order-status-badge").append(statusBadge);

    const container = document.getElementById("order-detail-section");
    renderOrderDetail(order, container);

    if (order.status === "PAID") {
      const btnGroup = document.createElement("div");
      btnGroup.className = "flex gap-3";

      const cancelBtn = document.createElement("button");
      cancelBtn.type = "button";
      cancelBtn.className =
        "flex-1 py-3 border border-gray-300 text-sm font-bold hover:bg-cararra transition-colors";
      cancelBtn.textContent = "주문 취소";
      cancelBtn.addEventListener("click", () => {
        const modalContent = createCancelModalContent(async (reason) => {
          try {
            await cancelOrder(orderId, { cancelReason: reason });
            modal.close();
            alert("주문이 취소되었습니다.");
            window.location.reload();
          } catch (error) {
            console.error("주문 취소 오류:", error);
            alert("주문 취소 중 오류가 발생했습니다.");
          }
        });

        const modal = createModal({
          title: "주문 취소",
          content: modalContent,
        });
        modal.open();
      });

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className =
        "flex-1 py-3 bg-dark-woody text-white text-sm font-bold hover:opacity-90 transition-opacity";
      editBtn.textContent = "배송정보 수정";
      editBtn.addEventListener("click", () => {
        const shippingSection = document.getElementById(
          "shipping-info-section",
        );
        renderShippingForm(
          order.shippingAddress,
          shippingSection,
          async (formData) => {
            try {
              await updateOrderShipping(orderId, formData);
              alert("배송정보가 수정되었습니다.");
              window.location.reload();
            } catch (error) {
              console.error("배송정보 수정 오류:", error);
              alert("배송정보 수정 중 오류가 발생했습니다.");
            }
          },
        );
      });

      btnGroup.append(cancelBtn, editBtn);
      document.querySelector(".max-w-\\[700px\\]").append(btnGroup);
    }
  } catch (error) {
    console.error("주문 상세 로딩 오류:", error);
  }
}

initOrderDetailPage();
