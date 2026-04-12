// ── 뷰/편집 모드 전환 ─────────────────────────────────────────────
const viewMode = document.getElementById("view-mode");
const editMode = document.getElementById("edit-mode");
const toEditBtn = document.getElementById("to-edit-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");

function showEditMode() {
  viewMode.classList.add("hidden");
  editMode.classList.remove("hidden");
}

function showViewMode() {
  editMode.classList.add("hidden");
  viewMode.classList.remove("hidden");
}

toEditBtn?.addEventListener("click", showEditMode);
cancelEditBtn?.addEventListener("click", showViewMode);

// ── 폼 제출 ───────────────────────────────────────────────────────
document.getElementById("edit-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  // TODO: API 연동 후 실제 저장 로직 구현
  const name = document.getElementById("name")?.value ?? "";
  const email = document.getElementById("email")?.value ?? "";
  const phone = document.getElementById("phone")?.value ?? "";

  // 뷰 모드 값 업데이트
  const viewName = document.getElementById("view-name");
  const viewEmail = document.getElementById("view-email");
  const viewPhone = document.getElementById("view-phone");
  if (viewName) viewName.textContent = name;
  if (viewEmail) viewEmail.textContent = email;
  if (viewPhone) viewPhone.textContent = phone;

  showViewMode();
});

// ── 광고/판촉 수신 동의 아코디언 ──────────────────────────────────
const accordionBtn = document.getElementById("promo-accordion-btn");
const accordionContent = document.getElementById("promo-accordion-content");
const accordionIcon = document.getElementById("promo-accordion-icon");

accordionBtn?.addEventListener("click", () => {
  const isExpanded = accordionBtn.getAttribute("aria-expanded") === "true";
  accordionBtn.setAttribute("aria-expanded", String(!isExpanded));
  accordionContent.classList.toggle("hidden");
  accordionIcon.style.transform = isExpanded ? "" : "rotate(90deg)";
});
