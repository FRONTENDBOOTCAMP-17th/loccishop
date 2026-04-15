import { signupUser } from "/src/js/api/auth/index.js";
import { createSignupPage } from "/src/js/signupUtils/createSignupPage.js";

createSignupPage({
  signupApi: signupUser,
  successMessage: "회원가입이 완료되었습니다.",

  getExtraElements: (getField) => ({
    userAddress: getField("userAddress"),
    userDetailAddress: getField("userDetailAddress"),
  }),

  extraIconsToHide: (els) => [
    els.userAddress.checkIcon,
    els.userDetailAddress.checkIcon,
  ],

  bindExtraValidations: (els) => {
    els.userAddress.input.addEventListener("input", () => {
      els.userAddress.checkIcon.style.display = els.userAddress.input.value.trim()
        ? "block"
        : "none";
    });

    els.userDetailAddress.input.addEventListener("input", () => {
      els.userDetailAddress.checkIcon.style.display =
        els.userDetailAddress.input.value.trim() ? "block" : "none";
    });
  },

  collectExtraFields: (els) => ({
    baseAddress: els.userAddress.input.value.trim(),
    detailAddress: els.userDetailAddress.input.value.trim(),
  }),
});
