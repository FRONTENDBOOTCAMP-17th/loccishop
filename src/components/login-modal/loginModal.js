import { loginUser } from "/src/js/api/auth/index.js";

export function renderLoginModal() {
  const modal = document.createElement("div");
  modal.id = "loginModal";
  modal.className =
    "fixed inset-0 z-50 flex justify-center items-center px-4 hidden";

  modal.innerHTML = `
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
    <div class="relative bg-grey-99 z-10 w-full max-w-200 h-fit">
      <button type="button" id="loginModalClose" class="absolute right-0 top-0 p-[21.67px]">
        <img tabindex="-1" src="/src/assets/icon/login_xBtn.svg" alt="로그인/회원가입 창 닫기버튼" />
      </button>
      <div class="flex flex-col my-10 md:my-18 px-6 md:px-9.25 w-full mx-auto">
        <div class="w-full">
          <h1 class="text-woody-brown text-[30px] font-normal leading-normal mb-2">
            로그인 / 회원가입
          </h1>
          <p class="text-abbey text-[14px] font-normal leading-5">필수항목*</p>
          <p class="pt-10 pb-6 text-woody-brown text-[12px] font-bold leading-4 tracking-[1.2px] uppercase">
            아이디/비밀번호를 입력하세요.
          </p>
        </div>
        <form id="loginModalForm" class="w-full bg-grey-96 px-6 md:px-10 py-6 flex flex-col gap-4">
          <div class="flex flex-col text-abbey text-[14px] font-semibold leading-5">
            <label for="modalUsername">아이디*</label>
            <div class="relative mt-2">
              <input
                type="text"
                id="modalUsername"
                name="username"
                class="bg-grey-99 border border-grey-45 h-10 w-full px-3"
                required
              />
              <img tabindex="-1"
                src="/src/assets/icon/error.svg"
                alt="아이디 에러"
                id="modalIdErrorIcon"
                class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 hidden"
              />
            </div>
            <p id="modalIdErrorText" class="text-error-red text-[12px] font-medium leading-4 mt-1 hidden">
              아이디 또는 비밀번호가 올바르지 않습니다.
            </p>
          </div>
          <div class="flex flex-col text-abbey text-[14px] font-semibold leading-5">
            <label for="modalPassword">비밀번호*</label>
            <div class="relative mt-2 w-full">
              <input
                type="password"
                id="modalPassword"
                class="w-full bg-grey-99 border border-grey-45 h-10 px-3 pr-10"
                required
              />
              <button
                type="button"
                id="modalTogglePassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 hidden"
                tabindex="-1"
              >
                <img tabindex="-1" src="/src/assets/icon/passwordEye.svg" alt="비밀번호 보기" class="w-5 h-5" />
              </button>
            </div>
          </div>
          <div class="flex flex-col gap-3 mt-2">
            <button
              type="submit"
              class="w-full h-10 bg-woody-brown text-white-solid text-[14px] font-medium leading-6"
            >
              로그인
            </button>
            <div class="text-center">
              <a href="/src/pages/signup/admin/index.html" class="text-[14px] font-medium hover:underline">관리자 회원가입</a>
              <span>/</span>
              <a href="/src/pages/signup/user/index.html" class="text-[14px] font-medium hover:underline">회원가입</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  `;

  setupModalEvents(modal);
  return modal;
}

function setupModalEvents(modal) {
  const form = modal.querySelector("#loginModalForm");
  const usernameInput = modal.querySelector("#modalUsername");
  const passwordInput = modal.querySelector("#modalPassword");
  const idErrorIcon = modal.querySelector("#modalIdErrorIcon");
  const idErrorText = modal.querySelector("#modalIdErrorText");
  const togglePasswordBtn = modal.querySelector("#modalTogglePassword");
  const closeBtn = modal.querySelector("#loginModalClose");

  closeBtn.addEventListener("click", closeLoginModal);

  // 배경(backdrop) 클릭 시 닫기
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeLoginModal();
  });

  passwordInput.addEventListener("input", () => {
    togglePasswordBtn.classList.toggle("hidden", !passwordInput.value);
  });

  togglePasswordBtn.addEventListener("click", () => {
    passwordInput.type =
      passwordInput.type === "password" ? "text" : "password";
  });

  usernameInput.addEventListener("input", () => {
    idErrorIcon.classList.add("hidden");
    idErrorText.classList.add("hidden");
  });

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
      const data = await loginUser(username, password);

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("role", data.member?.role ?? "user");
      localStorage.setItem("member", JSON.stringify(data.member));

      closeLoginModal();
      window.location.reload();

      if (data.member?.role?.toLowerCase() === "admin") {
        window.location.href = "/src/pages/admin/dashboard/index.html";
      }
    } catch {
      idErrorIcon.classList.remove("hidden");
      idErrorText.classList.remove("hidden");
    }
  });
}

export function openLoginModal() {
  document.getElementById("loginModal")?.classList.remove("hidden");
}

export function closeLoginModal() {
  document.getElementById("loginModal")?.classList.add("hidden");
}
