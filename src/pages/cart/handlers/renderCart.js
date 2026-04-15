import { editCartItem, deleteCartItem } from "/src/js/api/cart/index.js";
import { updateOrderSummary } from "/src/components/ui/orderSummary.js";
import { updateCartBadge } from "/src/components/header/header.js";

//장바구니 렌더링
export async function renderCart({ items, total, shipping }) {
  const cartList = document.getElementById("cart-list");
  const cartCount = document.getElementById("cart-count");

  if (!items || items.length === 0) {
    const empty = document.createElement("div");
    empty.className =
      "flex flex-col items-center justify-center py-24 gap-4 text-center";

    const msg = document.createElement("p");
    msg.className = "text-base text-zambezi";
    msg.textContent = "장바구니가 비어있습니다.";

    const link = document.createElement("a");
    link.className =
      "text-sm underline underline-offset-2 text-woody-brown hover:opacity-70";
    link.href = "/src/pages/product/list/index.html";
    link.textContent = "쇼핑 계속하기";

    empty.append(msg, link);
    cartList.append(empty);

    cartCount.textContent = 0;
    updateOrderSummary({ subtotal: 0, total: 0, shipping: 0 });
    return;
  }

  cartCount.textContent = items.length;
  updateOrderSummary({ subtotal: total - shipping, total, shipping });
  items.forEach((item) => {
    cartList.append(createCartItem(item));
  });
}

//장바구나 아이템 카드 생성
function createCartItem(item) {
  const {
    cartItemId,
    productId,
    productName,
    optionLabel,
    quantity,
    discountPrice,
    price,
    thumbnailUrl,
    subtotal,
    stock,
  } = item;

  const li = document.createElement("li");
  li.className =
    "relative flex gap-4 border border-gray-200 rounded p-4 bg-rose-white";

  //상품 이미지
  const img = document.createElement("img");
  img.className = "w-24 h-24 object-cover rounded flex-shrink-0 bg-merino";
  img.src = thumbnailUrl;
  img.alt = productName;

  //상품 정보
  const infoWrapper = document.createElement("div");
  infoWrapper.className = "flex flex-col flex-1 gap-1";

  //상품명
  const nameEl = document.createElement("p");
  nameEl.textContent = productName;
  nameEl.className =
    "text-sm font-bold leading-5 cursor-pointer hover:underline";
  nameEl.addEventListener("click", () => {
    window.location.href = `/src/pages/product/detail/?id=${productId}`;
  });

  //용량(옵션)
  const optionEl = document.createElement("span");
  optionEl.className = "text-xs text-zambezi underline";
  optionEl.textContent = optionLabel;

  //수량,금액
  const bottomRow = document.createElement("div");
  bottomRow.className = "flex items-center justify-between mt-auto pt-2";

  // 수량 조절 버튼
  const qtyWrapper = document.createElement("div");
  qtyWrapper.className = "flex items-center border border-gray-300 rounded";

  //해당 제품 금액
  const totalEl = document.createElement("span");
  totalEl.className = "text-sm font-bold";
  totalEl.textContent = `₩${subtotal.toLocaleString()}`;

  const minusBtn = document.createElement("button");
  minusBtn.type = "button";
  minusBtn.textContent = "−";
  minusBtn.className =
    "w-8 h-8 flex items-center justify-center text-sm hover:bg-cararra transition-colors";

  const qtyDisplay = document.createElement("span");
  qtyDisplay.textContent = quantity;
  qtyDisplay.className =
    "w-8 h-8 flex items-center justify-center text-sm border-x border-gray-300";

  const plusBtn = document.createElement("button");
  plusBtn.type = "button";
  plusBtn.textContent = "+";
  plusBtn.className =
    "w-8 h-8 flex items-center justify-center text-sm hover:bg-cararra transition-colors";

  let currentQty = quantity;

  minusBtn.addEventListener("click", async () => {
    if (currentQty <= 1) {
      return;
    }

    const result = await editCartItem(cartItemId, currentQty - 1);
    if (!result) {
      return;
    }
    currentQty--;
    qtyDisplay.textContent = currentQty;
    totalEl.textContent = `₩${((discountPrice ?? price) * currentQty).toLocaleString()}`;
    updateOrderSummary({
      subtotal: result.summary.subtotal,
      total: result.summary.total,
      shipping: result.summary.shipping,
    });
  });

  plusBtn.addEventListener("click", async () => {
    if (currentQty >= stock) {
      alert("재고가 부족합니다.");
      return;
    }

    const result = await editCartItem(cartItemId, currentQty + 1);
    if (!result) {
      return;
    }

    currentQty++;
    qtyDisplay.textContent = currentQty;
    totalEl.textContent = `₩${((discountPrice ?? price) * currentQty).toLocaleString()}`;
    updateOrderSummary({
      subtotal: result.summary.subtotal,
      total: result.summary.total,
      shipping: result.summary.shipping,
    });
  });

  qtyWrapper.append(minusBtn, qtyDisplay, plusBtn);

  bottomRow.append(qtyWrapper, totalEl);

  infoWrapper.append(nameEl, optionEl, bottomRow);

  //삭제버튼
  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className =
    "absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-woody-brown transition-colors";
  deleteBtn.innerHTML = `<img src="/src/assets/icon/close.svg" alt="삭제" class="w-4 h-4" />`;

  deleteBtn.addEventListener("click", async () => {
    try {
      const result = await deleteCartItem(cartItemId);
      li.remove();
      await updateCartBadge();

      const cartList = document.querySelector("#cart-list");
      const remaining = cartList.querySelectorAll("li").length;
      document.querySelector("#cart-count").textContent = remaining;

      if (remaining === 0) {
        // cart-empty를 JS로 생성
        const empty = document.createElement("div");
        empty.className =
          "flex flex-col items-center justify-center py-24 gap-4 text-center";

        const msg = document.createElement("p");
        msg.className = "text-base text-zambezi";
        msg.textContent = "장바구니가 비어있습니다.";

        const link = document.createElement("a");
        link.href = "/src/pages/product/list/index.html";
        link.className =
          "text-sm underline underline-offset-2 text-woody-brown hover:opacity-70";
        link.textContent = "쇼핑 계속하기";

        empty.append(msg, link);
        cartList.append(empty);

        updateOrderSummary({ subtotal: 0, total: 0, shipping: 0 });
      } else {
        updateOrderSummary({
          subtotal: result.summary.subtotal,
          total: result.summary.total,
          shipping: result.summary.shipping,
        });
      }
      await updateCartBadge();
    } catch (e) {
      console.error("삭제 오류:", e);
      alert("삭제에 실패했습니다.");
    }
  });

  li.append(img, infoWrapper, deleteBtn);
  return li;
}
