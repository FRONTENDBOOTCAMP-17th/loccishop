import {
  fetchOrderDetail,
  cancelOrder,
  updateOrderShipping,
} from "/src/js/api/order/index.js";
import { renderOrderDetail as renderOrderDetailUI } from "/src/components/ui/orderDetail.js";
import { createModal } from "/src/components/ui/modal.js";

const STATUS_MAP = {
  PAID: { text: "결제 완료", class: "text-dark-woody bg-cararra" },
  SHIPPING: { text: "배송 중", class: "text-ferra bg-merino" },
  DELIVERED: { text: "배송 완료", class: "text-dark-woody bg-cararra" },
  CANCELLED: { text: "주문 취소", class: "text-white bg-empress" },
};

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
    "px-3 py-1.5 border border-gray-300 text-sm hover:bg-cararra transition-colors whitespace-nowrap flex-shrink-0";
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

  const detailInput = document.createElement("input");
  detailInput.type = "text";
  detailInput.value = shippingAddress.detailAddress ?? "";
  detailInput.placeholder = "상세주소";
  detailInput.className =
    "w-full border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-dark-woody";
  inputs.detailAddress = detailInput;
  form.append(detailInput);

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
    window.location.href = `?menu=order-detail&id=${shippingAddress._id || ""}`;
  });

  btnGroup.append(cancelBtn, saveBtn);
  section.append(h2, form, btnGroup);
}

export async function renderOrderDetail(id) {
  const container = document.querySelector("#mypage-content");
  if (!container || !id) return;

  // 로딩 상태
  container.innerHTML = `<p class="p-10 text-center text-sm text-empress">주문 정보를 불러오는 중입니다...</p>`;

  try {
    const order = await fetchOrderDetail(id);

    const statusInfo = STATUS_MAP[order.status] || {
      text: order.status,
      class: "text-dark-woody bg-cararra",
    };

    // 컨테이너 구성
    container.innerHTML = `
      <div class="flex flex-col gap-8">
        <div class="flex flex-col gap-3 py-8 border-b border-cararra">
          <button type="button" id="back-btn"
            class="text-left cursor-pointer text-xs text-empress hover:text-dark-woody transition-colors w-fit">
            ← 주문 내역으로
          </button>
          <h2 class="text-xl font-bold">주문 상세</h2>
          <div id="order-status-badge"></div>
          <p class="text-sm text-zambezi">${order.orderNumber || ""}</p>
        </div>
        <div id="order-detail-section"></div>
      </div>
    `;

    // 상태 뱃지
    const statusBadge = document.createElement("span");
    statusBadge.className = `text-xs font-bold px-4 py-2 ${statusInfo.class}`;
    statusBadge.textContent = statusInfo.text;
    document.getElementById("order-status-badge").append(statusBadge);

    // 주문 상세 렌더링
    const detailSection = document.getElementById("order-detail-section");
    renderOrderDetailUI(order, detailSection);

    // 뒤로가기
    document.getElementById("back-btn").addEventListener("click", () => {
      window.location.href = `?menu=order`;
    });

    // 결제 완료 상태일 때만 버튼 표시
    if (order.status === "PAID") {
      const btnGroup = document.createElement("div");
      btnGroup.className = "flex gap-3 mt-4";

      const cancelBtn = document.createElement("button");
      cancelBtn.type = "button";
      cancelBtn.className =
        "flex-1 py-3 border border-gray-300 text-sm font-bold hover:bg-cararra transition-colors";
      cancelBtn.textContent = "주문 취소";
      cancelBtn.addEventListener("click", () => {
        const modalContent = createCancelModalContent(async (reason) => {
          try {
            await cancelOrder(id, { cancelReason: reason });
            modal.close();
            alert("주문이 취소되었습니다.");
            window.location.href = `?menu=order-detail&id=${id}`;
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
              await updateOrderShipping(id, formData);
              alert("배송정보가 수정되었습니다.");
              window.location.href = `?menu=order-detail&id=${id}`;
            } catch (error) {
              console.error("배송정보 수정 오류:", error);
              alert("배송정보 수정 중 오류가 발생했습니다.");
            }
          },
        );
      });

      btnGroup.append(cancelBtn, editBtn);
      detailSection.append(btnGroup);
    }
  } catch (error) {
    container.innerHTML = `<p class="p-10 text-center text-error-red">주문 정보를 불러오는 중 오류가 발생했습니다.</p>`;
    console.error(error);
  }
}
