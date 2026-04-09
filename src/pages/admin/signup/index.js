import { fetchAPI } from "/src/js/api/client.js";

const CHECK_ID_URL =
  "https://api.fullstackfamily.com/api/loccishop/v1/auth/check-id";
const ADMIN_TOKEN = "LCS_ADMIN_2026";

function isValidUsername(value) {
  return value.length >= 4 && value.length <= 20;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPassword(value) {
  return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
    value,
  );
}

function setValid(errorIcon, checkIcon, errorText) {
  if (errorIcon) errorIcon.style.display = "none";
  checkIcon.style.display = "block";
  if (errorText) errorText.style.display = "none";
}

function setError(errorIcon, checkIcon, errorText) {
  if (errorIcon) errorIcon.style.display = "block";
  checkIcon.style.display = "none";
  if (errorText) errorText.style.display = "block";
}

function clearState(errorIcon, checkIcon, errorText) {
  if (errorIcon) errorIcon.style.display = "none";
  checkIcon.style.display = "none";
  if (errorText) errorText.style.display = "none";
}

// 브라우저 뒤로가기로 돌아왔을 때 폼 초기화
window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    const form = document.getElementById("signupForm");
    if (form) {
      form.reset();
    }
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const userId = document.getElementById("userId");
  const userPw = document.getElementById("userPw");
  const userPwConfirm = document.getElementById("userPwConfirm");
  const userName = document.getElementById("userName");
  const userEmail = document.getElementById("userEmail");
  const adminToken = document.getElementById("adminToken");

  const idErrorIcon = document.getElementById("idErrorIcon");
  const idCheckIcon = document.getElementById("idCheckIcon");
  const idErrorText = document.getElementById("idErrorText");
  const idDuplicateText = document.getElementById("idDuplicateText");
  const idAvailableText = document.getElementById("idAvailableText");
  let isIdChecked = false;
  let isIdAvailable = false;

  const pwErrorIcon = document.getElementById("pwErrorIcon");
  const pwCheckIcon = document.getElementById("pwCheckIcon");
  const pwGuideText = document.getElementById("pwGuideText");
  const pwErrorText = document.getElementById("pwErrorText");

  const pwConfirmErrorIcon = document.getElementById("pwConfirmErrorIcon");
  const pwConfirmCheckIcon = document.getElementById("pwConfirmCheckIcon");
  const pwConfirmErrorText = document.getElementById("pwConfirmErrorText");

  const nameErrorIcon = document.getElementById("nameErrorIcon");
  const nameCheckIcon = document.getElementById("nameCheckIcon");
  const nameErrorText = document.getElementById("nameErrorText");

  const emailErrorIcon = document.getElementById("emailErrorIcon");
  const emailCheckIcon = document.getElementById("emailCheckIcon");
  const emailErrorText = document.getElementById("emailErrorText");

  const tokenErrorIcon = document.getElementById("tokenErrorIcon");
  const tokenCheckIcon = document.getElementById("tokenCheckIcon");
  const tokenErrorText = document.getElementById("tokenErrorText");

  // 초기 상태: 아이콘과 에러 텍스트 숨김
  [
    idErrorIcon,
    idCheckIcon,
    pwErrorIcon,
    pwCheckIcon,
    pwConfirmErrorIcon,
    pwConfirmCheckIcon,
    nameErrorIcon,
    nameCheckIcon,
    emailErrorIcon,
    emailCheckIcon,
    tokenErrorIcon,
    tokenCheckIcon,
  ].forEach((el) => {
    if (el) el.style.display = "none";
  });

  [
    idErrorText,
    idDuplicateText,
    idAvailableText,
    pwErrorText,
    pwConfirmErrorText,
    nameErrorText,
    emailErrorText,
    tokenErrorText,
  ].forEach((el) => {
    if (el) el.style.display = "none";
  });

  // 비밀번호 보기/숨기기
  document.getElementById("togglePassword").addEventListener("click", () => {
    userPw.type = userPw.type === "password" ? "text" : "password";
  });
  document
    .getElementById("togglePasswordConfirm")
    .addEventListener("click", () => {
      userPwConfirm.type =
        userPwConfirm.type === "password" ? "text" : "password";
    });

  // 실시간 유효성 검사
  userId.addEventListener("input", () => {
    isIdChecked = false;
    isIdAvailable = false;
    idDuplicateText.style.display = "none";
    idAvailableText.style.display = "none";

    if (!userId.value) {
      return clearState(idErrorIcon, idCheckIcon, idErrorText);
    }
    isValidUsername(userId.value)
      ? setValid(idErrorIcon, idCheckIcon, idErrorText)
      : setError(idErrorIcon, idCheckIcon, idErrorText);
  });

  // 중복확인 버튼
  document.getElementById("checkIdBtn").addEventListener("click", async () => {
    if (!isValidUsername(userId.value)) {
      setError(idErrorIcon, idCheckIcon, idErrorText);
      return userId.focus();
    }

    try {
      const response = await fetch(
        `${CHECK_ID_URL}?username=${encodeURIComponent(userId.value)}`,
      );
      const result = await response.json();

      isIdChecked = true;
      if (result.success && result.data.isAvailable) {
        isIdAvailable = true;
        idDuplicateText.style.display = "none";
        idAvailableText.style.display = "block";
        setValid(idErrorIcon, idCheckIcon, idErrorText);
      } else {
        isIdAvailable = false;
        idAvailableText.style.display = "none";
        idDuplicateText.style.display = "block";
        setError(idErrorIcon, idCheckIcon, null);
      }
    } catch (error) {
      console.error("중복확인 오류:", error);
      alert("중복확인 중 오류가 발생했습니다.");
    }
  });

  userPw.addEventListener("input", () => {
    if (!userPw.value) {
      clearState(pwErrorIcon, pwCheckIcon, pwErrorText);
      pwGuideText.style.display = "block";
      return;
    }
    pwGuideText.style.display = "none";
    isValidPassword(userPw.value)
      ? setValid(pwErrorIcon, pwCheckIcon, pwErrorText)
      : setError(pwErrorIcon, pwCheckIcon, pwErrorText);

    if (userPwConfirm.value) {
      userPw.value === userPwConfirm.value
        ? setValid(pwConfirmErrorIcon, pwConfirmCheckIcon, pwConfirmErrorText)
        : setError(pwConfirmErrorIcon, pwConfirmCheckIcon, pwConfirmErrorText);
    }
  });

  userPwConfirm.addEventListener("input", () => {
    if (!userPwConfirm.value) {
      return clearState(
        pwConfirmErrorIcon,
        pwConfirmCheckIcon,
        pwConfirmErrorText,
      );
    }
    userPw.value === userPwConfirm.value
      ? setValid(pwConfirmErrorIcon, pwConfirmCheckIcon, pwConfirmErrorText)
      : setError(pwConfirmErrorIcon, pwConfirmCheckIcon, pwConfirmErrorText);
  });

  userName.addEventListener("input", () => {
    if (!userName.value) {
      return clearState(nameErrorIcon, nameCheckIcon, nameErrorText);
    }
    userName.value.trim()
      ? setValid(nameErrorIcon, nameCheckIcon, nameErrorText)
      : setError(nameErrorIcon, nameCheckIcon, nameErrorText);
  });

  userEmail.addEventListener("input", () => {
    if (!userEmail.value) {
      return clearState(emailErrorIcon, emailCheckIcon, emailErrorText);
    }
    isValidEmail(userEmail.value)
      ? setValid(emailErrorIcon, emailCheckIcon, emailErrorText)
      : setError(emailErrorIcon, emailCheckIcon, emailErrorText);
  });

  // 인증토큰: 입력값이 ADMIN_TOKEN과 일치하면 체크, 아니면 에러
  adminToken.addEventListener("input", () => {
    if (!adminToken.value) {
      return clearState(tokenErrorIcon, tokenCheckIcon, tokenErrorText);
    }
    adminToken.value === ADMIN_TOKEN
      ? setValid(tokenErrorIcon, tokenCheckIcon, tokenErrorText)
      : setError(tokenErrorIcon, tokenCheckIcon, tokenErrorText);
  });

  // 뒤로 가기
  document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "/src/pages/login/index.html";
  });

  // 폼 제출
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!isValidUsername(userId.value)) {
      setError(idErrorIcon, idCheckIcon, idErrorText);
      return userId.focus();
    }
    if (!isIdChecked || !isIdAvailable) {
      alert("아이디 중복확인을 해주세요.");
      return userId.focus();
    }
    if (!isValidPassword(userPw.value)) {
      setError(pwErrorIcon, pwCheckIcon, pwErrorText);
      return userPw.focus();
    }
    if (userPw.value !== userPwConfirm.value) {
      setError(pwConfirmErrorIcon, pwConfirmCheckIcon, pwConfirmErrorText);
      return userPwConfirm.focus();
    }
    if (!userName.value.trim()) {
      setError(nameErrorIcon, nameCheckIcon, nameErrorText);
      return userName.focus();
    }
    if (!isValidEmail(userEmail.value)) {
      setError(emailErrorIcon, emailCheckIcon, emailErrorText);
      return userEmail.focus();
    }
    if (adminToken.value !== ADMIN_TOKEN) {
      setError(tokenErrorIcon, tokenCheckIcon, tokenErrorText);
      return adminToken.focus();
    }

    const requestBody = {
      username: userId.value,
      password: userPw.value,
      name: userName.value.trim(),
      email: userEmail.value.trim(),
      adminToken: adminToken.value,
    };

    try {
      await fetchAPI("/auth/admin/signup", {
        method: "POST",
        body: requestBody,
      });
      alert("관리자 회원가입이 완료되었습니다.");
      window.location.href = "/src/pages/login/index.html";
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  });
});
