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

  const viewName = document.getElementById("view-name");
  const viewEmail = document.getElementById("view-email");
  if (viewName) viewName.textContent = name;
  if (viewEmail) viewEmail.textContent = email;

  showViewMode();
});
