import { initStepIndicator } from "/src/components/ui/stepIndicator.js";
import { initOrderSummary } from "/src/components/ui/orderSummary.js";
import { fetchAddresses } from "/src/js/api/address/index.js";
import {
  renderAddressList,
  initDeliveryMemo,
  getSelectedAddressId,
  getDeliveryMemo,
} from "./handlers/renderAddress.js";
import { createAddressFormFields } from "./handlers/addressForm.js";
import { initSaveAddress, initTabSwitch } from "./handlers/initSaveAddress.js";

async function initShippingPage() {
  initStepIndicator("shipping");

  await initOrderSummary({
    showCoupon: false,
    showCartToggle: true,
    btnText: "결제하기",
    onBtnClick: () => {
      const addressId = getSelectedAddressId();

      if (!addressId) {
        alert("배송지를 선택해주세요.");
        return;
      }
      const memo = getDeliveryMemo();
      sessionStorage.setItem("selectedAddressId", addressId);
      sessionStorage.setItem("deliveryMemo", memo);
      location.href = "/src/pages/order/payment/index.html";
    },
  });

  createAddressFormFields();

  const addresses = await fetchAddresses();
  await renderAddressList(addresses);

  initTabSwitch();
  initSaveAddress();
  initDeliveryMemo();
}
initShippingPage();
