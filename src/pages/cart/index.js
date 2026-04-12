import { cartItemList } from "/src/js/api/cart/index.js";
import { renderCart } from "./handlers/renderCart.js";

async function initCartPage() {
  const data = await cartItemList();
  renderCart(data);
}

initCartPage();
