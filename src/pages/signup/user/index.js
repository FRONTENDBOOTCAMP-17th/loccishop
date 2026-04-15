import { signupUser } from "/src/js/api/auth/index.js";
import { createSignupPage } from "/src/js/signupUtils/createSignupPage.js";

createSignupPage({
  signupApi: signupUser,
  successMessage: "회원가입이 완료되었습니다.",

  getExtraElements: () => ({
    userAddress: document.getElementById("userAddress"),
    userDetailAddress: document.getElementById("userDetailAddress"),
    addressCheckIcon: document.getElementById("addressCheckIcon"),
    detailAddressCheckIcon: document.getElementById("detailAddressCheckIcon"),
  }),

  extraIconsToHide: (els) => [els.addressCheckIcon, els.detailAddressCheckIcon],

  bindExtraValidations: (els) => {
    els.userAddress.addEventListener("input", () => {
      els.addressCheckIcon.style.display = els.userAddress.value.trim()
        ? "block"
        : "none";
    });

    els.userDetailAddress.addEventListener("input", () => {
      els.detailAddressCheckIcon.style.display =
        els.userDetailAddress.value.trim() ? "block" : "none";
    });
  },

  collectExtraFields: (els) => ({
    baseAddress: els.userAddress.value.trim(),
    detailAddress: els.userDetailAddress.value.trim(),
  }),
});
