import { loginUser } from "/src/js/api/login/index.js";

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const idErrorIcon = document.getElementById("idErrorIcon");
  const idErrorText = document.getElementById("idErrorText");
  const togglePasswordBtn = document.getElementById("togglePassword");

  // 비밀번호 입력 시 눈 아이콘 표시/숨김
  passwordInput.addEventListener("input", () => {
    togglePasswordBtn.classList.toggle("hidden", !passwordInput.value);
  });

  // 비밀번호 보기/숨기기
  togglePasswordBtn.addEventListener("click", () => {
    passwordInput.type =
      passwordInput.type === "password" ? "text" : "password";
  });

  // 아이디 입력 시 에러 초기화
  usernameInput.addEventListener("input", () => {
    idErrorIcon.classList.add("hidden");
    idErrorText.classList.add("hidden");
  });

  // 폼 제출
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username) {
      idErrorIcon.classList.remove("hidden");
      idErrorText.classList.remove("hidden");
      return usernameInput.focus();
    }

    try {
      const result = await loginUser(username, password);

      if (result.success) {
        localStorage.setItem("token", result.data.accessToken);
        localStorage.setItem("role", result.data.member?.role ?? "user");
        localStorage.setItem("member", JSON.stringify(result.data.member));

        alert("로그인에 성공하셨습니다.");

        if (result.data.member?.role?.toLowerCase() === "admin") {
          window.location.href = "/src/pages/admin/dashboard/index.html";
        } else {
          window.location.href = "/index.html";
        }
      } else {
        idErrorIcon.classList.remove("hidden");
        idErrorText.textContent =
          result.message || "아이디 또는 비밀번호가 올바르지 않습니다.";
        idErrorText.classList.remove("hidden");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("오류가 발생했습니다.");
    }
  });
});
