import { fetchAPI } from "/src/js/api/client.js";

// ── 비밀번호 표시 토글 ────────────────────────────────────────────
function setupToggle(inputId, btnId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  if (!input || !btn) return;
  btn.addEventListener("click", () => {
    input.type = input.type === "password" ? "text" : "password";
  });
}

setupToggle("current-pw", "toggle-current-pw");
setupToggle("new-pw", "toggle-new-pw");

// ── 에러 상태 유틸 ────────────────────────────────────────────────
function setError(inputId, iconId, msgId, show) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  const msg = document.getElementById(msgId);
  if (input) input.classList.toggle("border-error-red", show);
  if (icon) icon.classList.toggle("hidden", !show);
  if (msg) msg.classList.toggle("hidden", !show);
}

// ── 비밀번호 강도 & 체크리스트 ───────────────────────────────────
function updateCheck(id, isValid) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle("text-teal-green", isValid);
  el.classList.toggle("text-gray-400", !isValid);
}

function updateStrength(value) {
  const hasLength = value.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[^a-zA-Z0-9]/.test(value);

  updateCheck("check-length", hasLength);
  updateCheck("check-letter", hasLetter);
  updateCheck("check-number", hasNumber);

  const score = [hasLength, hasLetter, hasNumber, hasSpecial].filter(Boolean).length;
  const bar = document.getElementById("strength-bar");
  if (!bar) return;

  const configs = [
    { width: "w-0",    color: "" },
    { width: "w-1/4",  color: "bg-error-red" },
    { width: "w-2/4",  color: "bg-yellow-400" },
    { width: "w-3/4",  color: "bg-teal-green" },
    { width: "w-full", color: "bg-teal-green" },
  ];
  const { width, color } = configs[score];
  bar.className = `h-1.5 rounded-full transition-all duration-300 ${width} ${color}`;
}

document.getElementById("new-pw")?.addEventListener("input", (e) => {
  updateStrength(e.target.value);
  setError("new-pw", "new-pw-error-icon", "new-pw-error-msg", false);
});

// ── 폼 유효성 검사 & 제출 ─────────────────────────────────────────
document.getElementById("pw-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const currentPassword = document.getElementById("current-pw").value;
  const newPassword = document.getElementById("new-pw").value;
  let hasError = false;

  // 현재 비밀번호
  if (!currentPassword) {
    setError("current-pw", "current-pw-error-icon", "current-pw-error-msg", true);
    hasError = true;
  } else {
    setError("current-pw", "current-pw-error-icon", "current-pw-error-msg", false);
  }

  // 새 비밀번호 (최소 요건 확인)
  const isValidNewPw =
    newPassword.length >= 8 && /[a-zA-Z]/.test(newPassword) && /[0-9]/.test(newPassword);
  if (!isValidNewPw) {
    setError("new-pw", "new-pw-error-icon", "new-pw-error-msg", true);
    hasError = true;
  } else {
    setError("new-pw", "new-pw-error-icon", "new-pw-error-msg", false);
  }

  if (hasError) return;

  try {
    await fetchAPI("/members/me/password", {
      method: "PATCH",
      body: { currentPassword, newPassword },
    });
    alert("비밀번호가 변경되었습니다. 다시 로그인해주세요.");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("member");
    window.location.href = "/src/pages/login/index.html";
  } catch {
    setError("current-pw", "current-pw-error-icon", "current-pw-error-msg", true);
  }
});

// ── 입력 시 에러 초기화 ───────────────────────────────────────────
document.getElementById("current-pw")?.addEventListener("input", () => {
  setError("current-pw", "current-pw-error-icon", "current-pw-error-msg", false);
});
