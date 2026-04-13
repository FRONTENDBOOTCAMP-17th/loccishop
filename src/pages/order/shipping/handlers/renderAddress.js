import { deleteAddress, fetchAddresses } from "/src/js/api/address/index.js";
import { openAddressForm } from "./addressForm.js";

let selectedAddressId = null;

//선택한 배송지 id
export function getSelectedAddressId() {
  return selectedAddressId;
}

//배송지 랜더링
export async function renderAddressList(data) {
  const addressList = document.getElementById("address-list");
  addressList.innerHTML = "";

  if (!data || data.length === 0) {
    const empty = document.createElement("div");
    empty.className = " py-10 text-center text-sm text-zambezi";

    const msg = document.createElement("p");
    msg.textContent = "등록된 배송지가 없습니다.";

    empty.append(msg);
    addressList.append(empty);

    return;
  }

  //기본 배송지 자동 선택
  const defaultAddress = data.find((address) => address.isDefault) ?? data[0];
  selectedAddressId = defaultAddress.addressId;

  data.forEach((address) => {
    const li = createAddressItem(
      address,
      address.addressId === selectedAddressId,
    );
    addressList.append(li);
  });
}

//배송지 아이템 생성
function createAddressItem(address, isSelected = false) {
  const {
    addressId,
    name,
    phone,
    zipCode,
    address: addr,
    detailAddress,
    isDefault,
  } = address;

  const li = document.createElement("li");
  li.className = "flex gap-3 py-4 items-start";
  li.dataset.addressId = addressId;

  const radio = document.createElement("input");
  radio.type = "radio";
  radio.name = "address";
  radio.value = addressId;
  radio.checked = isSelected;
  radio.className =
    "mt-1 flex-shrink-0 accent-woody-brown cursor-pointer w-4 h-4";

  radio.addEventListener("change", () => {
    selectedAddressId = addressId;
  });

  //정보
  const infoWrapper = document.createElement("article");
  infoWrapper.className = "flex flex-col gap-1 flex-1";

  //이름 + 기본주소 뱃지
  const nameRow = document.createElement("div");
  nameRow.className = "flex items-center gap-2";

  const nameEl = document.createElement("span");
  nameEl.textContent = name;
  nameEl.className = "text-sm font-bold";

  nameRow.append(nameEl);

  if (isDefault) {
    const defaultBadge = document.createElement("span");
    defaultBadge.textContent = "기본";
    defaultBadge.className =
      "text-xs px-1.5 py-0.5 border border-woody-brown text-woody-brown rounded";
    nameRow.append(defaultBadge);
  }

  //연락처
  const phoneEl = document.createElement("span");
  phoneEl.textContent = phone;
  phoneEl.className = "text-sm text-zambezi";

  //주소
  const addressEl = document.createElement("span");
  addressEl.textContent = `${addr} ${detailAddress ?? ""}`;
  addressEl.className = "text-sm text-zambezi";

  //우편번호
  const zipEl = document.createElement("span");
  zipEl.textContent = `(${zipCode})`;
  zipEl.className = "text-sm text-zambezi";

  infoWrapper.append(nameRow, phoneEl, addressEl, zipEl);
  infoWrapper.addEventListener("click", () => {
    radio.checked = true;
    selectedAddressId = addressId;
  });

  //수정,삭제 버튼
  const buttonWrapper = document.createElement("div");
  buttonWrapper.className =
    "flex items-center gap-2 text-sm text-zambezi flex-shrink-0";

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.textContent = "수정";
  editBtn.className = "hover:text-woody-brown transition-colors";

  const divider = document.createElement("span");
  divider.textContent = "|";
  divider.className = "text-gray-300";

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.textContent = "삭제";
  deleteBtn.className = "hover:text-red-500 transition-colors";

  buttonWrapper.append(editBtn, divider, deleteBtn);
  li.append(radio, infoWrapper, buttonWrapper);

  //수정 이벤트
  editBtn.addEventListener("click", () => openAddressForm(address));

  //삭제 이벤트
  deleteBtn.addEventListener("click", async () => {
    if (!confirm("배송지를 삭제하시겠습니까?")) {
      return;
    }
    try {
      await deleteAddress(addressId);
      const addresses = await fetchAddresses();
      await renderAddressList(addresses);
    } catch (e) {
      console.error("삭제 오류: ", e);
      alert("삭제에 실패했습니다.");
    }
  });
  return li;
}

//배송메모
export function initDeliveryMemo() {
  const memoSelect = document.getElementById("delivery-memo");
  const memoCustom = document.getElementById("delivery-memo-custom");

  if (!memoSelect || !memoCustom) {
    return;
  }

  memoSelect.addEventListener("change", () => {
    if (memoSelect.value === "직접입력") {
      memoCustom.classList.remove("hidden");
    } else {
      memoCustom.classList.add("hidden");
    }
  });
}

export function getDeliveryMemo() {
  const memoSelect = document.getElementById("delivery-memo");
  const memoCustom = document.getElementById("delivery-memo-custom");

  if (memoSelect.value === "직접입력") {
    return memoCustom.value.trim();
  }
  return memoSelect.value;
}
