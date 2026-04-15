import { checkId } from "/src/js/api/auth/index.js";
import {
  isValidUsername,
  isValidEmail,
  isValidPassword,
} from "./validation.js";
import { setValid, setError, clearState } from "./ui.js";

/**
 * 회원가입 페이지(사용자/관리자)에 공통으로 필요한 동작을 하나로 묶는다.
 *
 * @param {object} options
 * @param {(body: object) => Promise<any>} options.signupApi - 실제로 호출할 API 함수
 * @param {string} options.successMessage - 성공 시 alert 문구
 * @param {(getField: Function) => object} [options.getExtraElements] - admin/user 마다 다른 추가 field 묶음을 반환하는 함수
 * @param {(els: object) => void} [options.bindExtraValidations] - 추가 필드의 input 이벤트 바인딩
 * @param {(els: object) => boolean} [options.validateExtraFields] - 폼 제출 전 추가 필드 검증
 * @param {(els: object) => object} [options.collectExtraFields] - 추가 필드를 requestBody 에 합칠 객체 반환
 * @param {(error: Error, els: object) => boolean} [options.handleApiError] - API 에러 처리. true 반환 시 공통 alert 생략
 */
export function createSignupPage({
  signupApi,
  successMessage,
  getExtraElements = () => ({}),
  bindExtraValidations = () => {},
  validateExtraFields = () => true,
  collectExtraFields = () => ({}),
  handleApiError = () => false,
}) {
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      const form = document.getElementById("signupForm");
      if (form) { form.reset(); }
    }
  });

  /**
   * data-field="name" 래퍼에서 필드 묶음을 한 번에 가져온다.
   * @param {string} name - data-field 속성값
   */
  function getField(name) {
    const root = document.querySelector(`[data-field="${name}"]`);
    return {
      root,
      input: root.querySelector("[data-field-input]"),
      errorIcon: root.querySelector('[data-field-icon="error"]'),
      checkIcon: root.querySelector('[data-field-icon="check"]'),
      errorMessage: root.querySelector('[data-field-message="error"]'),
      guideMessage: root.querySelector('[data-field-message="guide"]'),
      duplicateMessage: root.querySelector('[data-field-message="duplicate"]'),
      availableMessage: root.querySelector('[data-field-message="available"]'),
      toggleBtn: root.querySelector('[data-field-action="toggle"]'),
      checkBtn: root.querySelector('[data-field-action="check"]'),
    };
  }

  function getElements() {
    return {
      form: document.getElementById("signupForm"),
      userId: getField("userId"),
      userPw: getField("userPw"),
      userPwConfirm: getField("userPwConfirm"),
      userName: getField("userName"),
      userEmail: getField("userEmail"),
      ...getExtraElements(getField),
    };
  }

  function bindPasswordToggle(els) {
    els.userPw.toggleBtn.addEventListener("click", () => {
      els.userPw.input.type =
        els.userPw.input.type === "password" ? "text" : "password";
    });
    els.userPwConfirm.toggleBtn.addEventListener("click", () => {
      els.userPwConfirm.input.type =
        els.userPwConfirm.input.type === "password" ? "text" : "password";
    });
  }

  function bindIdValidation(els, state) {
    els.userId.input.addEventListener("input", () => {
      state.isIdChecked = false;
      state.isIdAvailable = false;
      els.userId.duplicateMessage.classList.add("hidden");
      els.userId.availableMessage.classList.add("hidden");

      if (!els.userId.input.value) {
        return clearState(els.userId);
      }
      isValidUsername(els.userId.input.value)
        ? setValid(els.userId)
        : setError(els.userId);
    });

    els.userId.checkBtn.addEventListener("click", async () => {
      if (!isValidUsername(els.userId.input.value)) {
        setError(els.userId);
        return els.userId.input.focus();
      }

      try {
        const result = await checkId(els.userId.input.value);
        state.isIdChecked = true;
        if (result.isAvailable) {
          state.isIdAvailable = true;
          els.userId.duplicateMessage.classList.add("hidden");
          els.userId.availableMessage.classList.remove("hidden");
          setValid(els.userId);
        } else {
          state.isIdAvailable = false;
          els.userId.availableMessage.classList.add("hidden");
          els.userId.duplicateMessage.classList.remove("hidden");
          // 에러 아이콘만 표시, errorMessage 는 duplicateMessage 가 대신함
          els.userId.errorIcon.classList.remove("hidden");
          els.userId.checkIcon.classList.add("hidden");
        }
      } catch (error) {
        console.error("중복확인 오류:", error);
        alert("중복확인 중 오류가 발생했습니다.");
      }
    });
  }

  function bindPasswordValidation(els) {
    els.userPw.input.addEventListener("input", () => {
      if (!els.userPw.input.value) {
        clearState(els.userPw);
        els.userPw.guideMessage.classList.remove("hidden");
        return;
      }
      els.userPw.guideMessage.classList.add("hidden");
      isValidPassword(els.userPw.input.value)
        ? setValid(els.userPw)
        : setError(els.userPw);

      if (els.userPwConfirm.input.value) {
        els.userPw.input.value === els.userPwConfirm.input.value
          ? setValid(els.userPwConfirm)
          : setError(els.userPwConfirm);
      }
    });

    els.userPwConfirm.input.addEventListener("input", () => {
      if (!els.userPwConfirm.input.value) {
        return clearState(els.userPwConfirm);
      }
      els.userPw.input.value === els.userPwConfirm.input.value
        ? setValid(els.userPwConfirm)
        : setError(els.userPwConfirm);
    });
  }

  function bindCommonFieldValidations(els) {
    els.userName.input.addEventListener("input", () => {
      if (!els.userName.input.value) {
        return clearState(els.userName);
      }
      els.userName.input.value.trim()
        ? setValid(els.userName)
        : setError(els.userName);
    });

    els.userEmail.input.addEventListener("input", () => {
      if (!els.userEmail.input.value) {
        return clearState(els.userEmail);
      }
      isValidEmail(els.userEmail.input.value)
        ? setValid(els.userEmail)
        : setError(els.userEmail);
    });

    bindExtraValidations(els);
  }

  async function handleSubmit(e, els, state) {
    e.preventDefault();

    if (!isValidUsername(els.userId.input.value)) {
      setError(els.userId);
      return els.userId.input.focus();
    }
    if (!state.isIdChecked || !state.isIdAvailable) {
      alert("아이디 중복확인을 해주세요.");
      return els.userId.input.focus();
    }
    if (!isValidPassword(els.userPw.input.value)) {
      setError(els.userPw);
      return els.userPw.input.focus();
    }
    if (els.userPw.input.value !== els.userPwConfirm.input.value) {
      setError(els.userPwConfirm);
      return els.userPwConfirm.input.focus();
    }
    if (!els.userName.input.value.trim()) {
      setError(els.userName);
      return els.userName.input.focus();
    }
    if (!isValidEmail(els.userEmail.input.value)) {
      setError(els.userEmail);
      return els.userEmail.input.focus();
    }
    if (!validateExtraFields(els)) { return; }

    const requestBody = {
      username: els.userId.input.value,
      password: els.userPw.input.value,
      name: els.userName.input.value.trim(),
      email: els.userEmail.input.value.trim(),
      ...collectExtraFields(els),
    };

    try {
      await signupApi(requestBody);
      alert(successMessage);
      window.location.href = "/src/pages/login/index.html";
    } catch (error) {
      console.error("회원가입 오류:", error);
      if (!handleApiError(error, els)) {
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    }
  }

  window.addEventListener("DOMContentLoaded", () => {
    const els = getElements();
    const state = { isIdChecked: false, isIdAvailable: false };

    bindPasswordToggle(els);
    bindIdValidation(els, state);
    bindPasswordValidation(els);
    bindCommonFieldValidations(els);

    document.getElementById("backBtn").addEventListener("click", () => {
      window.location.href = "/src/pages/login/index.html";
    });

    els.form.addEventListener("submit", (e) => handleSubmit(e, els, state));
  });
}
