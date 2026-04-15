import { signupAdmin } from "/src/js/api/auth/index.js";
import { createSignupPage } from "/src/js/signupUtils/createSignupPage.js";
import { setValid, setError, clearState } from "/src/js/signupUtils/ui.js";

createSignupPage({
  signupApi: signupAdmin,
  successMessage: "관리자 회원가입이 완료되었습니다.",

  getExtraElements: () => ({
    adminToken: document.getElementById("adminToken"),
    tokenErrorIcon: document.getElementById("tokenErrorIcon"),
    tokenCheckIcon: document.getElementById("tokenCheckIcon"),
    tokenErrorText: document.getElementById("tokenErrorText"),
  }),

  extraIconsToHide: (els) => [els.tokenErrorIcon, els.tokenCheckIcon],
  extraTextsToHide: (els) => [els.tokenErrorText],

  bindExtraValidations: (els) => {
    els.adminToken.addEventListener("input", () => {
      if (!els.adminToken.value) {
        return clearState(
          els.tokenErrorIcon,
          els.tokenCheckIcon,
          els.tokenErrorText,
        );
      }
      setValid(els.tokenErrorIcon, els.tokenCheckIcon, els.tokenErrorText);
    });
  },

  validateExtraFields: (els) => {
    if (!els.adminToken.value) {
      setError(els.tokenErrorIcon, els.tokenCheckIcon, els.tokenErrorText);
      els.adminToken.focus();
      return false;
    }
    return true;
  },

  collectExtraFields: (els) => ({
    adminToken: els.adminToken.value,
  }),

  handleApiError: (error, els) => {
    if (error.message.includes("401") || error.message.includes("403")) {
      setError(els.tokenErrorIcon, els.tokenCheckIcon, els.tokenErrorText);
      els.adminToken.focus();
      return true;
    }
    return false;
  },
});
