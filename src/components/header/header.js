import { createNavDrawer } from "/src/components/header/createNavDrawer.js";
import {
  openLoginModal,
  renderLoginModal,
} from "/src/components/login-modal/loginModal.js";
import { fetchWishList } from "/src/js/api/wishlist/index.js";
import { cartItemList } from "/src/js/api/cart/index.js";

let cartBadgeEl = null;
let cartWrapperEl = null;

export async function updateCartBadge() {
  if (!localStorage.getItem("token") || !cartWrapperEl) return;

  try {
    const cartRes = await cartItemList();
    const count = cartRes?.items?.length ?? 0;

    if (cartBadgeEl) cartBadgeEl.remove();
    cartBadgeEl = null;

    if (count > 0) {
      cartBadgeEl = document.createElement("span");
      cartBadgeEl.textContent = count > 99 ? "99+" : count;
      cartBadgeEl.className =
        "absolute -top-1 -right-2 bg-woody-brown text-rose-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center";
      cartWrapperEl.append(cartBadgeEl);
    }
  } catch (e) {
    console.error(e);
  }
}

export async function renderHeader() {
  const res = await fetch("/src/components/header/header.html");
  const html = await res.text();

  const temp = document.createElement("div");
  temp.innerHTML = html;
  const nav = temp.querySelector("nav");

  nav.querySelector("#loginBtn").addEventListener("click", () => {
    if (localStorage.getItem("token")) {
      window.location.href = "/src/pages/mypage/index.html";
    } else {
      openLoginModal();
    }
  });

  const { open } = createNavDrawer();
  nav.querySelector(".hamburger-btn").addEventListener("click", open);

  if (!document.getElementById("loginModal")) {
    document.body.append(renderLoginModal());
  }

  // wishlist
  const wishlistIcon = nav.querySelector("#wishlist-icon");
  if (localStorage.getItem("token")) {
    try {
      const wishRes = await fetchWishList();
      if (wishRes?.total > 0) {
        wishlistIcon.src = "/src/assets/icon/heart.svg";
      }
    } catch (e) {
      console.error(e);
    }
  }

  // cart
  cartWrapperEl = nav.querySelector("#cart-icon").parentElement;
  cartWrapperEl.classList.add("relative");
  await updateCartBadge();

  return nav;
}
