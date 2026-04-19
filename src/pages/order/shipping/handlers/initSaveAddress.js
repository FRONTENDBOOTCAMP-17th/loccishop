import {
  addAddress,
  updateAddress,
  fetchAddresses,
} from "/src/js/api/address/index.js";
import { renderAddressList } from "/src/pages/order/shipping/handlers/renderAddress.js";
import {
  openAddressForm,
  switchTab,
} from "/src/pages/order/shipping/handlers/addressForm.js";

//배송지 저장
export function initSaveAddress() {
  const saveBtn = document.getElementById("save-address-btn");
  if (!saveBtn) {
    return;
  }

  saveBtn.addEventListener("click", async () => {
    const name = document.querySelector("#new-name").value.trim();
    const phone = document.querySelector("#new-phone").value.trim();
    const zipCode = document.querySelector("#new-zipcode").value.trim();
    const address = document.querySelector("#new-address").value.trim();
    const detailAddress = document.querySelector("#new-detail").value.trim();
    const isDefault = document.querySelector("#new-default").checked;

    if (!name || !phone || !zipCode || !address) {
      alert("필수 항목을 모두 입력해 주세요.");
      return;
    }

    const data = { name, phone, zipCode, address, detailAddress, isDefault };

    try {
      if (saveBtn.dataset.mode === "edit") {
        await updateAddress(Number(saveBtn.dataset.addressId), data);
      } else {
        await addAddress(data);
      }

      const tabSelect = document.getElementById("tab-select");
      const tabNew = document.getElementById("tab-new");
      const panelSelect = document.getElementById("panel-select");
      const panelNew = document.getElementById("panel-new");

      switchTab(tabSelect, tabNew, panelSelect, panelNew);

      const addresses = await fetchAddresses();
      await renderAddressList(addresses);
    } catch (e) {
      console.error("저장 오류: ", e);
      alert("저장에 실패했습니다.");
    }
  });
}

//탭전환
export function initTabSwitch() {
  const tabSelect = document.getElementById("tab-select");
  const tabNew = document.getElementById("tab-new");
  const panelSelect = document.getElementById("panel-select");
  const panelNew = document.getElementById("panel-new");

  tabSelect.addEventListener("click", () => {
    switchTab(tabSelect, tabNew, panelSelect, panelNew);
  });
  tabNew.addEventListener("click", async () => {
    const addresses = await fetchAddresses();
    if (addresses.length >= 3) {
      alert("배송지는 최대 3개까지 등록할 수 있습니다.");
      return;
    }
    openAddressForm();
  });
}
