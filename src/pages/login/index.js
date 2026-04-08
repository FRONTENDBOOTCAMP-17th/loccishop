const LOGIN_URL = "https://api.fullstackfamily.com/api/loccishop/v1/auth/login";

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
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
  emailInput.addEventListener("input", () => {
    idErrorIcon.classList.add("hidden");
    idErrorText.classList.add("hidden");
  });

  // 폼 제출
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = emailInput.value.trim();
    const password = passwordInput.value;

    if (!username) {
      idErrorIcon.classList.remove("hidden");
      idErrorText.classList.remove("hidden");
      return emailInput.focus();
    }

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("accessToken", result.data.accessToken);
        localStorage.setItem("role", result.data.member?.role ?? "user");
        // 내 정보 조회를 위해 추가
        localStorage.setItem("member", JSON.stringify(result.data.member));

        // 관리자면 관리자 페이지로, 일반 사용자면 메인으로
        if (result.data.member?.role === "admin") {
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
