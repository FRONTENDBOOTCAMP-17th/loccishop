import { signupUser } from "/src/js/api/auth/index.js";
import { createSignupPage } from "/src/js/signupUtils/createSignupPage.js";

createSignupPage({
  signupApi: signupUser,
  successMessage: "회원가입이 완료되었습니다.",

  getExtraElements: (getField) => ({
    userAddress: getField("userAddress"),
    userDetailAddress: getField("userDetailAddress"),
  }),

  bindExtraValidations: (els) => {
    els.userAddress.input.addEventListener("input", () => {
      els.userAddress.checkIcon.classList.toggle(
        "hidden",
        !els.userAddress.input.value.trim(),
      );
    });

    els.userDetailAddress.input.addEventListener("input", () => {
      els.userDetailAddress.checkIcon.classList.toggle(
        "hidden",
        !els.userDetailAddress.input.value.trim(),
      );
    });
  },

  collectExtraFields: (els) => ({
    baseAddress: els.userAddress.input.value.trim(),
    detailAddress: els.userDetailAddress.input.value.trim(),
  }),
});
