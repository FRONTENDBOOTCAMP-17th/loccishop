import { fetchAPI } from "./api.js";

export async function loadRitualSets() {
  return fetchAPI("/admin/ritual-sets");
}

export async function createRitualSet(data) {
  return fetchAPI("/admin/ritual-sets", { method: "POST", body: data });
}

export async function deleteRitualSet(id) {
  return fetchAPI(`/admin/ritual-sets/${id}`, { method: "DELETE" });
}

export async function addRitualStep(setId, data) {
  return fetchAPI(`/admin/ritual-sets/${setId}/steps`, {
    method: "POST",
    body: data,
  });
}

export async function deleteRitualStep(setId, stepId) {
  return fetchAPI(`/admin/ritual-sets/${setId}/steps/${stepId}`, {
    method: "DELETE",
  });
}

export function renderRitualsSection(container) {
  container.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">리추얼 세트 관리</h2>
      <button class="btn btn-primary" id="ritual-add-btn">+ 세트 생성</button>
    </div>
    <div id="ritual-list"></div>
    <div class="modal-overlay hidden" id="ritual-modal">
      <div class="modal">
        <div class="modal-header">
          <h3>리추얼 세트 생성</h3>
          <button class="modal-close" id="ritual-modal-close">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group full">
              <label>제목 *</label>
              <input type="text" id="r-title" class="form-input" />
            </div>
            <div class="form-group full">
              <label>설명</label>
              <textarea id="r-desc" class="form-input" rows="3"></textarea>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="ritual-modal-cancel">취소</button>
          <button class="btn btn-primary" id="ritual-modal-submit">생성</button>
        </div>
      </div>
    </div>
    <div class="modal-overlay hidden" id="step-modal">
      <div class="modal">
        <div class="modal-header">
          <h3>스텝 추가</h3>
          <button class="modal-close" id="step-modal-close">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label>스텝 번호 *</label>
              <input type="number" id="s-step" class="form-input" min="1" />
            </div>
            <div class="form-group">
              <label>상품 ID *</label>
              <input type="number" id="s-product" class="form-input" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="step-modal-cancel">취소</button>
          <button class="btn btn-primary" id="step-modal-submit">추가</button>
        </div>
      </div>
    </div>
  `;

  let currentSetId = null;

  async function render() {
    const data = await loadRitualSets();
    const sets = data.ritualSets ?? [];
    const list = document.getElementById("ritual-list");

    list.innerHTML = sets.length
      ? sets
          .map(
            (s) => `
      <div class="ritual-card">
        <div class="ritual-info">
          <p class="ritual-title">${s.id}</p>
          <p class="ritual-title">${s.title}</p>
          <p class="ritual-desc">${s.description ?? ""}</p>
          <p class="ritual-meta">생성일: ${s.createdAt?.slice(0, 10)}</p>
        </div>
        <div class="ritual-actions">
          <button class="btn-sm btn-edit" data-id="${s.id}">+ 스텝 추가</button>
          <button class="btn-sm btn-delete" data-id="${s.id}">세트 삭제</button>
        </div>
      </div>
    `,
          )
          .join("")
      : `<p class="empty">등록된 리추얼 세트가 없습니다.</p>`;

    list.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", () => openStepModal(btn.dataset.id));
    });

    list.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("세트와 모든 스텝이 삭제됩니다. 진행하시겠습니까?"))
          return;
        await deleteRitualSet(btn.dataset.id);
        render();
      });
    });
  }

  function openStepModal(setId) {
    currentSetId = setId;
    document.getElementById("s-step").value = "";
    document.getElementById("s-product").value = "";
    document.getElementById("step-modal").classList.remove("hidden");
  }

  document.getElementById("ritual-add-btn").addEventListener("click", () => {
    document.getElementById("r-title").value = "";
    document.getElementById("r-desc").value = "";
    document.getElementById("ritual-modal").classList.remove("hidden");
  });

  document
    .getElementById("ritual-modal-close")
    .addEventListener("click", () =>
      document.getElementById("ritual-modal").classList.add("hidden"),
    );
  document
    .getElementById("ritual-modal-cancel")
    .addEventListener("click", () =>
      document.getElementById("ritual-modal").classList.add("hidden"),
    );

  document
    .getElementById("ritual-modal-submit")
    .addEventListener("click", async () => {
      await createRitualSet({
        title: document.getElementById("r-title").value,
        description: document.getElementById("r-desc").value || undefined,
      });
      document.getElementById("ritual-modal").classList.add("hidden");
      render();
    });

  document
    .getElementById("step-modal-close")
    .addEventListener("click", () =>
      document.getElementById("step-modal").classList.add("hidden"),
    );
  document
    .getElementById("step-modal-cancel")
    .addEventListener("click", () =>
      document.getElementById("step-modal").classList.add("hidden"),
    );

  document
    .getElementById("step-modal-submit")
    .addEventListener("click", async () => {
      await addRitualStep(currentSetId, {
        step: Number(document.getElementById("s-step").value),
        productId: Number(document.getElementById("s-product").value),
      });
      document.getElementById("step-modal").classList.add("hidden");
      render();
    });

  render();
}
