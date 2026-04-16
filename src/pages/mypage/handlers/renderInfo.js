import { getInfoTemplate } from "/src/pages/mypage/components/myInfoTemplate.js";
import {
  fetchMe,
  updateMemberInfo,
  withdrawMember,
  logoutUser,
} from "/src/js/api/auth/index.js";
import { ROUTES } from "/src/js/constants/routes.js";

// 날짜 포맷
function formatJoinDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day} 가입`;
}

// 모달 열기/닫기 헬퍼
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove("hidden");
  el.classList.add("flex");
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add("hidden");
  el.classList.remove("flex");
}

// 회원 정보를 DOM에 채우기
function populateInfo(member) {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val ?? "-";
  };

  set("info-summary-name", member.name);
  set("info-summary-email", member.email);
  set("info-summary-join-date", formatJoinDate(member.createdAt));
  set("info-summary-point", member.point ?? 0);

  set("info-detail-name", member.name);
  set("info-detail-email", member.email);
  set("info-detail-phone", member.phone);
  set("info-detail-birth", member.birth);

  const address =
    member.baseAddress && member.detailAddress
      ? `${member.baseAddress} ${member.detailAddress}`
      : member.baseAddress || "-";
  set("info-detail-address", address);

  // 포인트 요소는 숫자 뒤 P 스팬이 있으므로 별도 처리
  const pointEl = document.getElementById("info-summary-point");
  if (pointEl) {
    pointEl.innerHTML = `${(member.point ?? 0).toLocaleString()} <span class="text-lg ml-0.5 text-ferra font-normal">P</span>`;
  }
}

// 수정 폼에 현재 값 미리 채우기
function prefillEditForm(member) {
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val ?? "";
  };
  setVal("edit-name", member.name);
  setVal("edit-email", member.email);
  setVal("edit-base-address", member.baseAddress);
  setVal("edit-detail-address", member.detailAddress);
}

export async function renderInfo() {
  const container = document.querySelector("#mypage-content");
  if (!container) return;

  container.innerHTML = getInfoTemplate();

  // 회원 정보 로딩
  let member;
  try {
    member = await fetchMe();
    if (!member) return;
    populateInfo(member);
  } catch (err) {
    container.innerHTML = `<p class="p-10 text-center text-red-500 text-sm">회원 정보를 불러오지 못했습니다.</p>`;
    console.error(err);
    return;
  }

  // 수정 모달 이벤트
  document.getElementById("btn-open-edit")?.addEventListener("click", () => {
    prefillEditForm(member);
    const errEl = document.getElementById("edit-error");
    if (errEl) errEl.classList.add("hidden");
    openModal("modal-edit");
  });

  const closeEdit = () => closeModal("modal-edit");
  document
    .getElementById("btn-close-edit")
    ?.addEventListener("click", closeEdit);
  document
    .getElementById("btn-cancel-edit")
    ?.addEventListener("click", closeEdit);
  document
    .getElementById("modal-edit-backdrop")
    ?.addEventListener("click", closeEdit);

  document
    .getElementById("form-edit")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const errEl = document.getElementById("edit-error");

      const name = document.getElementById("edit-name").value.trim();
      const email = document.getElementById("edit-email").value.trim();
      const baseAddress = document
        .getElementById("edit-base-address")
        .value.trim();
      const detailAddress = document
        .getElementById("edit-detail-address")
        .value.trim();

      if (!name || !email) {
        errEl.textContent = "이름과 이메일은 필수 입력 항목입니다.";
        errEl.classList.remove("hidden");
        return;
      }

      try {
        const updated = await updateMemberInfo({
          name,
          email,
          baseAddress,
          detailAddress,
        });
        if (!updated) return;
        member = { ...member, ...updated };
        populateInfo(member);
        closeEdit();
        alert("정보가 수정되었습니다.");
      } catch (err) {
        errEl.textContent = "정보 수정 중 오류가 발생했습니다.";
        errEl.classList.remove("hidden");
        console.error(err);
      }
    });

  //  탈퇴 모달 이벤트
  document
    .getElementById("btn-open-withdraw")
    ?.addEventListener("click", () => {
      const errEl = document.getElementById("withdraw-error");
      if (errEl) errEl.classList.add("hidden");
      const pwEl = document.getElementById("withdraw-password");
      if (pwEl) pwEl.value = "";
      openModal("modal-withdraw");
    });

  const closeWithdraw = () => closeModal("modal-withdraw");
  document
    .getElementById("btn-close-withdraw")
    ?.addEventListener("click", closeWithdraw);
  document
    .getElementById("btn-cancel-withdraw")
    ?.addEventListener("click", closeWithdraw);
  document
    .getElementById("modal-withdraw-backdrop")
    ?.addEventListener("click", closeWithdraw);

  document
    .getElementById("form-withdraw")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const errEl = document.getElementById("withdraw-error");
      const password = document.getElementById("withdraw-password").value;

      if (!password) {
        errEl.textContent = "비밀번호를 입력해 주세요.";
        errEl.classList.remove("hidden");
        return;
      }

      try {
        await withdrawMember(password);
        logoutUser();
        alert("탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.");
        window.location.href = ROUTES.HOME;
      } catch (err) {
        errEl.textContent = "비밀번호가 올바르지 않거나 오류가 발생했습니다.";
        errEl.classList.remove("hidden");
        console.error(err);
      }
    });
}
