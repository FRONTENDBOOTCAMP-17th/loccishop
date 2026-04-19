import { signupAdmin } from "/src/js/api/auth/index.js";
import { createSignupPage } from "/src/js/signupUtils/createSignupPage.js";
import { setValid, setError, clearState } from "/src/js/signupUtils/ui.js";

createSignupPage({
  signupApi: signupAdmin,
  successMessage: "관리자 회원가입이 완료되었습니다.",

  getExtraElements: (getField) => ({
    adminToken: getField("adminToken"),
  }),

  bindExtraValidations: (els) => {
    els.adminToken.input.addEventListener("input", () => {
      if (!els.adminToken.input.value) {
        return clearState(els.adminToken);
      }
      setValid(els.adminToken);
    });
  },

  validateExtraFields: (els) => {
    if (!els.adminToken.input.value) {
      setError(els.adminToken);
      els.adminToken.input.focus();
      return false;
    }
    return true;
  },

  collectExtraFields: (els) => ({
    adminToken: els.adminToken.input.value,
  }),

  handleApiError: (error, els) => {
    if (error.message.includes("401") || error.message.includes("403")) {
      setError(els.adminToken);
      els.adminToken.input.focus();
      return true;
    }
    return false;
  },
});
