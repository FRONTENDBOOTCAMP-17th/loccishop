// ── 로그인 타입에 따라 상태 전환 ──────────────────────────────────
// 실제 연동 시 API 응답의 isSocialLogin 값으로 대체
// URL 파라미터 ?sns=true 로 SNS 상태 확인 (개발/테스트용)
const isSNS = new URLSearchParams(window.location.search).get("sns") === "true";

document.getElementById("sns-form").classList.toggle("hidden", !isSNS);
document.getElementById("regular-form").classList.toggle("hidden", isSNS);

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
setupToggle("confirm-pw", "toggle-confirm-pw");

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
  // 새 비밀번호 에러 초기화
  setError("new-pw", "new-pw-error-icon", "new-pw-error-msg", false);
});

// ── 폼 유효성 검사 & 제출 ─────────────────────────────────────────
document.getElementById("pw-form")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const currentPw = document.getElementById("current-pw").value;
  const newPw = document.getElementById("new-pw").value;
  const confirmPw = document.getElementById("confirm-pw").value;
  let hasError = false;

  // 현재 비밀번호
  if (!currentPw) {
    setError("current-pw", "current-pw-error-icon", "current-pw-error-msg", true);
    hasError = true;
  } else {
    setError("current-pw", "current-pw-error-icon", "current-pw-error-msg", false);
  }

  // 새 비밀번호 (최소 요건 확인)
  const isValidNewPw =
    newPw.length >= 8 && /[a-zA-Z]/.test(newPw) && /[0-9]/.test(newPw);
  if (!isValidNewPw) {
    setError("new-pw", "new-pw-error-icon", "new-pw-error-msg", true);
    hasError = true;
  } else {
    setError("new-pw", "new-pw-error-icon", "new-pw-error-msg", false);
  }

  // 새 비밀번호 확인
  if (!confirmPw || confirmPw !== newPw) {
    setError("confirm-pw", "confirm-pw-error-icon", "confirm-pw-error-msg", true);
    hasError = true;
  } else {
    setError("confirm-pw", "confirm-pw-error-icon", "confirm-pw-error-msg", false);
  }

  if (hasError) return;

  // TODO: API 연동 후 실제 변경 요청
  console.log("비밀번호 변경 요청");
});

// ── 입력 시 에러 초기화 ───────────────────────────────────────────
document.getElementById("current-pw")?.addEventListener("input", () => {
  setError("current-pw", "current-pw-error-icon", "current-pw-error-msg", false);
});
document.getElementById("confirm-pw")?.addEventListener("input", () => {
  setError("confirm-pw", "confirm-pw-error-icon", "confirm-pw-error-msg", false);
});
