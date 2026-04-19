import { fetchAPI } from "./api.js";

export async function loadCategories() {
  return fetchAPI("/categories");
}

export async function createCategory(data) {
  return fetchAPI("/admin/categories", { method: "POST", body: data });
}

export async function updateCategory(id, data) {
  return fetchAPI(`/admin/categories/${id}`, { method: "PATCH", body: data });
}

export async function deleteCategory(id) {
  return fetchAPI(`/admin/categories/${id}`, { method: "DELETE" });
}

export function renderCategoriesSection(container) {
  container.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">카테고리 관리</h2>
      <button class="btn btn-primary" id="cat-add-btn">+ 카테고리 등록</button>
    </div>
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr><th>ID</th><th>이름</th><th>슬러그</th><th>상위 카테고리</th><th>하위 수</th><th>관리</th></tr>
        </thead>
        <tbody id="cat-tbody"></tbody>
      </table>
    </div>
    <div class="modal-overlay hidden" id="cat-modal">
      <div class="modal">
        <div class="modal-header">
          <h3 id="cat-modal-title">카테고리 등록</h3>
          <button class="modal-close" id="cat-modal-close">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label>이름 *</label>
              <input type="text" id="c-name" class="form-input" />
            </div>
            <div class="form-group">
              <label>슬러그 *</label>
              <input type="text" id="c-slug" class="form-input" placeholder="예: skincare" />
            </div>
            <div class="form-group">
              <label>상위 카테고리 ID</label>
              <input type="number" id="c-parent" class="form-input" placeholder="없으면 비워두기" />
            </div>
            <div class="form-group">
              <label>이미지 URL</label>
              <input type="text" id="c-image" class="form-input" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="cat-modal-cancel">취소</button>
          <button class="btn btn-primary" id="cat-modal-submit">저장</button>
        </div>
      </div>
    </div>
  `;

  let editingId = null;
  let allCategories = [];

  function flattenCategories(categories, parentName = null) {
    const result = [];
    categories.forEach((cat) => {
      result.push({ ...cat, parentName });
      if (cat.children?.length) {
        result.push(...flattenCategories(cat.children, cat.name));
      }
    });
    return result;
  }

  async function render() {
    const data = await loadCategories();
    allCategories = Array.isArray(data) ? data : [];
    const flat = flattenCategories(allCategories);

    const tbody = document.getElementById("cat-tbody");
    tbody.innerHTML = flat
      .map(
        (cat) => `
  <tr ${!cat.parentName ? 'style="background: #ddd0c0  ;"' : ""}>
    <td>${cat.id}</td>
    <td>${cat.name}</td>
    <td><code>${cat.slug}</code></td>
    <td>${cat.parentName ?? "-"}</td>
    <td>${cat.children?.length ?? 0}</td>
    <td class="td-actions">
      <button class="btn-sm btn-edit" data-id="${cat.id}">수정</button>
      <button class="btn-sm btn-delete" data-id="${cat.id}">삭제</button>
    </td>
  </tr>
`,
      )
      .join("");

    tbody.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = flat.find((c) => c.id == btn.dataset.id);
        openModal(cat);
      });
    });

    tbody.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("삭제하시겠습니까?")) return;
        await deleteCategory(btn.dataset.id);
        render();
      });
    });
  }

  function openModal(cat = null) {
    editingId = cat?.id ?? null;
    document.getElementById("cat-modal-title").textContent = cat
      ? "카테고리 수정"
      : "카테고리 등록";
    document.getElementById("c-name").value = cat?.name ?? "";
    document.getElementById("c-slug").value = cat?.slug ?? "";
    document.getElementById("c-parent").value = "";
    document.getElementById("c-image").value = cat?.imageUrl ?? "";
    document.getElementById("cat-modal").classList.remove("hidden");
  }

  function closeModal() {
    document.getElementById("cat-modal").classList.add("hidden");
    editingId = null;
  }

  document
    .getElementById("cat-add-btn")
    .addEventListener("click", () => openModal());
  document
    .getElementById("cat-modal-close")
    .addEventListener("click", closeModal);
  document
    .getElementById("cat-modal-cancel")
    .addEventListener("click", closeModal);

  document
    .getElementById("cat-modal-submit")
    .addEventListener("click", async () => {
      const body = {
        name: document.getElementById("c-name").value,
        slug: document.getElementById("c-slug").value,
      };
      const parentId = document.getElementById("c-parent").value;
      const imageUrl = document.getElementById("c-image").value;
      if (parentId) body.parentId = Number(parentId);
      if (imageUrl) body.imageUrl = imageUrl;

      if (editingId) {
        await updateCategory(editingId, body);
      } else {
        await createCategory(body);
      }
      closeModal();
      render();
    });

  render();
}
