import { checkTokenValidity } from "/src/js/utils/checkTokenValidity.js";
import { cartItemList } from "/src/js/api/cart/index.js";

checkTokenValidity();
import { renderCart } from "/src/pages/cart/handlers/renderCart.js";
import { initStepIndicator } from "/src/components/ui/stepIndicator.js";
import { initOrderSummary } from "/src/components/ui/orderSummary.js";

async function initCartPage() {
  const data = await cartItemList();
  renderCart(data);
}

initCartPage();
initStepIndicator("cart");
await initOrderSummary({
  showCartToggle: false,
  btnText: "결제 계속하기",
  onBtnClick: () => {
    window.location.href = "/src/pages/order/shipping/index.html";
  },
});
