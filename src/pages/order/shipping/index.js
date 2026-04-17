import { checkTokenValidity } from "/src/js/utils/checkTokenValidity.js";
import { initStepIndicator } from "/src/components/ui/stepIndicator.js";

checkTokenValidity();
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
    showCartToggle: true,
    btnText: "결제하기",
    onBtnClick: async () => {
      const addressId = getSelectedAddressId();

      if (!addressId) {
        alert("배송지를 선택해주세요.");
        return;
      }

      const addresses = await fetchAddresses();
      const selectedAddress = addresses.find((a) => a.addressId === addressId);

      const memo = getDeliveryMemo();

      sessionStorage.setItem(
        "selectedAddress",
        JSON.stringify(selectedAddress),
      );
      sessionStorage.setItem("deliveryMemo", memo);
      location.href = "/order/payment";
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
