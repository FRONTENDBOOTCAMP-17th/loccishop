import { checkId, signupAdmin } from "/src/js/api/auth/index.js";
import {
  isValidUsername,
  isValidEmail,
  isValidPassword,
} from "/src/js/signupUtils/validation.js";
import { setValid, setError, clearState } from "/src/js/signupUtils/ui.js";

window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    const form = document.getElementById("signupForm");
    if (form) {
      form.reset();
    }
  }
});

function getElements() {
  return {
    form: document.getElementById("signupForm"),
    userId: document.getElementById("userId"),
    userPw: document.getElementById("userPw"),
    userPwConfirm: document.getElementById("userPwConfirm"),
    userName: document.getElementById("userName"),
    userEmail: document.getElementById("userEmail"),
    adminToken: document.getElementById("adminToken"),
    idErrorIcon: document.getElementById("idErrorIcon"),
    idCheckIcon: document.getElementById("idCheckIcon"),
    idErrorText: document.getElementById("idErrorText"),
    idDuplicateText: document.getElementById("idDuplicateText"),
    idAvailableText: document.getElementById("idAvailableText"),
    pwErrorIcon: document.getElementById("pwErrorIcon"),
    pwCheckIcon: document.getElementById("pwCheckIcon"),
    pwGuideText: document.getElementById("pwGuideText"),
    pwErrorText: document.getElementById("pwErrorText"),
    pwConfirmErrorIcon: document.getElementById("pwConfirmErrorIcon"),
    pwConfirmCheckIcon: document.getElementById("pwConfirmCheckIcon"),
    pwConfirmErrorText: document.getElementById("pwConfirmErrorText"),
    nameErrorIcon: document.getElementById("nameErrorIcon"),
    nameCheckIcon: document.getElementById("nameCheckIcon"),
    nameErrorText: document.getElementById("nameErrorText"),
    emailErrorIcon: document.getElementById("emailErrorIcon"),
    emailCheckIcon: document.getElementById("emailCheckIcon"),
    emailErrorText: document.getElementById("emailErrorText"),
    tokenErrorIcon: document.getElementById("tokenErrorIcon"),
    tokenCheckIcon: document.getElementById("tokenCheckIcon"),
    tokenErrorText: document.getElementById("tokenErrorText"),
  };
}

function initUI(els) {
  [
    els.idErrorIcon,
    els.idCheckIcon,
    els.pwErrorIcon,
    els.pwCheckIcon,
    els.pwConfirmErrorIcon,
    els.pwConfirmCheckIcon,
    els.nameErrorIcon,
    els.nameCheckIcon,
    els.emailErrorIcon,
    els.emailCheckIcon,
    els.tokenErrorIcon,
    els.tokenCheckIcon,
  ].forEach((el) => {
    if (el) {
      el.style.display = "none";
    }
  });

  [
    els.idErrorText,
    els.idDuplicateText,
    els.idAvailableText,
    els.pwErrorText,
    els.pwConfirmErrorText,
    els.nameErrorText,
    els.emailErrorText,
    els.tokenErrorText,
  ].forEach((el) => {
    if (el) {
      el.style.display = "none";
    }
  });
}

function bindPasswordToggle(els) {
  document.getElementById("togglePassword").addEventListener("click", () => {
    els.userPw.type = els.userPw.type === "password" ? "text" : "password";
  });
  document
    .getElementById("togglePasswordConfirm")
    .addEventListener("click", () => {
      els.userPwConfirm.type =
        els.userPwConfirm.type === "password" ? "text" : "password";
    });
}

function bindIdValidation(els, state) {
  els.userId.addEventListener("input", () => {
    state.isIdChecked = false;
    state.isIdAvailable = false;
    els.idDuplicateText.style.display = "none";
    els.idAvailableText.style.display = "none";

    if (!els.userId.value) {
      return clearState(els.idErrorIcon, els.idCheckIcon, els.idErrorText);
    }
    isValidUsername(els.userId.value)
      ? setValid(els.idErrorIcon, els.idCheckIcon, els.idErrorText)
      : setError(els.idErrorIcon, els.idCheckIcon, els.idErrorText);
  });

  document.getElementById("checkIdBtn").addEventListener("click", async () => {
    if (!isValidUsername(els.userId.value)) {
      setError(els.idErrorIcon, els.idCheckIcon, els.idErrorText);
      return els.userId.focus();
    }

    try {
      const result = await checkId(els.userId.value);

      state.isIdChecked = true;
      if (result.isAvailable) {
        state.isIdAvailable = true;
        els.idDuplicateText.style.display = "none";
        els.idAvailableText.style.display = "block";
        setValid(els.idErrorIcon, els.idCheckIcon, els.idErrorText);
      } else {
        state.isIdAvailable = false;
        els.idAvailableText.style.display = "none";
        els.idDuplicateText.style.display = "block";
        setError(els.idErrorIcon, els.idCheckIcon, null);
      }
    } catch (error) {
      console.error("중복확인 오류:", error);
      alert("중복확인 중 오류가 발생했습니다.");
    }
  });
}

function bindPasswordValidation(els) {
  els.userPw.addEventListener("input", () => {
    if (!els.userPw.value) {
      clearState(els.pwErrorIcon, els.pwCheckIcon, els.pwErrorText);
      els.pwGuideText.style.display = "block";
      return;
    }
    els.pwGuideText.style.display = "none";
    isValidPassword(els.userPw.value)
      ? setValid(els.pwErrorIcon, els.pwCheckIcon, els.pwErrorText)
      : setError(els.pwErrorIcon, els.pwCheckIcon, els.pwErrorText);

    if (els.userPwConfirm.value) {
      els.userPw.value === els.userPwConfirm.value
        ? setValid(
          els.pwConfirmErrorIcon,
          els.pwConfirmCheckIcon,
          els.pwConfirmErrorText,
        )
        : setError(
          els.pwConfirmErrorIcon,
          els.pwConfirmCheckIcon,
          els.pwConfirmErrorText,
        );
    }
  });

  els.userPwConfirm.addEventListener("input", () => {
    if (!els.userPwConfirm.value) {
      return clearState(
        els.pwConfirmErrorIcon,
        els.pwConfirmCheckIcon,
        els.pwConfirmErrorText,
      );
    }
    els.userPw.value === els.userPwConfirm.value
      ? setValid(
        els.pwConfirmErrorIcon,
        els.pwConfirmCheckIcon,
        els.pwConfirmErrorText,
      )
      : setError(
        els.pwConfirmErrorIcon,
        els.pwConfirmCheckIcon,
        els.pwConfirmErrorText,
      );
  });
}

function bindFieldValidations(els) {
  els.userName.addEventListener("input", () => {
    if (!els.userName.value) {
      return clearState(els.nameErrorIcon, els.nameCheckIcon, els.nameErrorText);
    }
    els.userName.value.trim()
      ? setValid(els.nameErrorIcon, els.nameCheckIcon, els.nameErrorText)
      : setError(els.nameErrorIcon, els.nameCheckIcon, els.nameErrorText);
  });

  els.userEmail.addEventListener("input", () => {
    if (!els.userEmail.value) {
      return clearState(
        els.emailErrorIcon,
        els.emailCheckIcon,
        els.emailErrorText,
      );
    }
    isValidEmail(els.userEmail.value)
      ? setValid(els.emailErrorIcon, els.emailCheckIcon, els.emailErrorText)
      : setError(els.emailErrorIcon, els.emailCheckIcon, els.emailErrorText);
  });

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
}

async function handleSubmit(e, els, state) {
  e.preventDefault();

  if (!isValidUsername(els.userId.value)) {
    setError(els.idErrorIcon, els.idCheckIcon, els.idErrorText);
    return els.userId.focus();
  }
  if (!state.isIdChecked || !state.isIdAvailable) {
    alert("아이디 중복확인을 해주세요.");
    return els.userId.focus();
  }
  if (!isValidPassword(els.userPw.value)) {
    setError(els.pwErrorIcon, els.pwCheckIcon, els.pwErrorText);
    return els.userPw.focus();
  }
  if (els.userPw.value !== els.userPwConfirm.value) {
    setError(
      els.pwConfirmErrorIcon,
      els.pwConfirmCheckIcon,
      els.pwConfirmErrorText,
    );
    return els.userPwConfirm.focus();
  }
  if (!els.userName.value.trim()) {
    setError(els.nameErrorIcon, els.nameCheckIcon, els.nameErrorText);
    return els.userName.focus();
  }
  if (!isValidEmail(els.userEmail.value)) {
    setError(els.emailErrorIcon, els.emailCheckIcon, els.emailErrorText);
    return els.userEmail.focus();
  }
  if (!els.adminToken.value) {
    setError(els.tokenErrorIcon, els.tokenCheckIcon, els.tokenErrorText);
    return els.adminToken.focus();
  }

  const requestBody = {
    username: els.userId.value,
    password: els.userPw.value,
    name: els.userName.value.trim(),
    email: els.userEmail.value.trim(),
    adminToken: els.adminToken.value,
  };

  try {
    await signupAdmin(requestBody);
    alert("관리자 회원가입이 완료되었습니다.");
    window.location.href = "/src/pages/login/index.html";
  } catch (error) {
    console.error("회원가입 오류:", error);
    if (error.message.includes("401") || error.message.includes("403")) {
      setError(els.tokenErrorIcon, els.tokenCheckIcon, els.tokenErrorText);
      return els.adminToken.focus();
    }
    alert("회원가입에 실패했습니다. 다시 시도해주세요.");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const els = getElements();
  const state = { isIdChecked: false, isIdAvailable: false };

  initUI(els);
  bindPasswordToggle(els);
  bindIdValidation(els, state);
  bindPasswordValidation(els);
  bindFieldValidations(els);

  document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "/src/pages/login/index.html";
  });

  els.form.addEventListener("submit", (e) => handleSubmit(e, els, state));
});
