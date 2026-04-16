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

function createDropdown(isLoggedIn) {
  const dropdown = document.createElement("div");
  dropdown.className = "absolute top-0 pt-8 right-0 w-40 z-50 hidden";

  const inner = document.createElement("div");
  inner.className =
    "bg-white border border-cararra shadow-md rounded-lg overflow-hidden";

  if (isLoggedIn) {
    const items = [
      { text: "내 정보", href: "/src/pages/mypage/index.html?menu=info" },
      { text: "주문 내역", href: "/src/pages/mypage/index.html?menu=order" },
      { text: "위시리스트", href: "/src/pages/mypage/index.html?menu=wish" },
      { text: "내 리뷰", href: "/src/pages/mypage/index.html?menu=review" },
    ];

    items.forEach(({ text, href }) => {
      const a = document.createElement("a");
      a.href = href;
      a.className =
        "block px-4 py-3 text-xs text-gray-800 bg-white hover:bg-cararra transition-colors tracking-wide";
      a.textContent = text;
      inner.append(a);
    });

    const divider = document.createElement("div");
    divider.className = "border-t border-gray-300";
    inner.append(divider);

    const logoutBtn = document.createElement("button");
    logoutBtn.type = "button";
    logoutBtn.className =
      "w-full text-left px-4 py-3 text-xs text-gray-800 bg-white hover:bg-cararra transition-colors tracking-wide";
    logoutBtn.textContent = "로그아웃";
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("member");
      window.location.href = "/";
    });
    inner.append(logoutBtn);
  } else {
    const loginMenuBtn = document.createElement("button");
    loginMenuBtn.type = "button";
    loginMenuBtn.className =
      "w-full text-left px-4 py-3 text-xs text-gray-800 bg-white hover:bg-cararra transition-colors tracking-wide";
    loginMenuBtn.textContent = "로그인";
    loginMenuBtn.addEventListener("click", () => openLoginModal());
    inner.append(loginMenuBtn);

    const signupA = document.createElement("a");
    signupA.href = "/src/pages/signup/user/index.html";
    signupA.className =
      "block px-4 py-3 text-xs text-gray-800 bg-white hover:bg-cararra transition-colors tracking-wide";
    signupA.textContent = "회원가입";
    inner.append(signupA);
  }

  dropdown.append(inner);
  return dropdown;
}

export async function renderHeader() {
  const res = await fetch("/src/components/header/header.html");
  const html = await res.text();

  const temp = document.createElement("div");
  temp.innerHTML = html;
  const nav = temp.querySelector("nav");

  const isLoggedIn = !!localStorage.getItem("token");
  const loginBtn = nav.querySelector("#loginBtn");
  const loginWrapper = loginBtn.parentElement;
  loginWrapper.classList.add("relative");

  const dropdown = createDropdown(isLoggedIn);
  loginWrapper.append(dropdown);

  loginWrapper.addEventListener("mouseenter", () => {
    dropdown.classList.remove("hidden");
  });
  loginWrapper.addEventListener("mouseleave", () => {
    dropdown.classList.add("hidden");
  });

  const { open } = createNavDrawer();
  nav.querySelector(".hamburger-btn").addEventListener("click", open);

  if (!document.getElementById("loginModal")) {
    document.body.append(renderLoginModal());
  }

  // wishlist
  const wishlistIcon = nav.querySelector("#wishlist-icon");
  if (isLoggedIn) {
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
