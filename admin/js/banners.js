import { fetchAPI, uploadImage } from "./api.js";

export async function loadBanners(position = "") {
  const query = position ? `?position=${position}` : "";
  return fetchAPI(`/banners${query}`);
}

export async function createBanner(data) {
  return fetchAPI("/admin/banners", { method: "POST", body: data });
}

export async function updateBanner(id, data) {
  return fetchAPI(`/admin/banners/${id}`, { method: "PATCH", body: data });
}

export async function deleteBanner(id) {
  return fetchAPI(`/admin/banners/${id}`, { method: "DELETE" });
}

const POSITION_TABS = [
  { value: "", label: "전체" },
  { value: "main", label: "메인" },
  { value: "sub1", label: "서브1" },
  { value: "sub2", label: "서브2" },
  { value: "mobile", label: "모바일" },
];

const POSITION_LABELS = {
  main: "메인",
  sub1: "서브1",
  sub2: "서브2",
  mobile: "모바일",
};

export function renderBannersSection(container) {
  container.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">배너 관리</h2>
      <button class="btn btn-primary" id="banner-add-btn">+ 배너 등록</button>
    </div>
    <div class="tab-bar" id="banner-tab-bar">
      ${POSITION_TABS.map(
        (t) => `
        <button class="tab-btn${t.value === "" ? " active" : ""}" data-position="${t.value}">
          ${t.label}
        </button>
      `,
      ).join("")}
    </div>
    <div class="banner-grid" id="banner-grid"></div>
    <div class="modal-overlay hidden" id="banner-modal">
      <div class="modal">
        <div class="modal-header">
          <h3 id="banner-modal-title">배너 등록</h3>
          <button class="modal-close" id="banner-modal-close">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group full">
              <label>제목 *</label>
              <input type="text" id="b-title" class="form-input" />
            </div>
            <div class="form-group full">
              <label>이미지</label>
              <input type="file" id="b-image" accept="image/*" class="form-input" />
              <input type="text" id="b-image-url" class="form-input mt-2" placeholder="또는 이미지 URL 직접 입력" />
            </div>
            <div class="form-group full">
              <label>링크 URL</label>
              <input type="text" id="b-link" class="form-input" />
            </div>
            <div class="form-group">
              <label>위치 *</label>
              <select id="b-position" class="form-input">
                ${POSITION_TABS.filter((t) => t.value !== "")
                  .map((t) => `<option value="${t.value}">${t.label}</option>`)
                  .join("")}
              </select>
            </div>
            <div class="form-group">
              <label>표시 순서</label>
              <input type="number" id="b-order" class="form-input" value="1" />
            </div>
            <div class="form-group">
              <label>시작일</label>
              <input type="datetime-local" id="b-start" class="form-input" />
            </div>
            <div class="form-group">
              <label>종료일</label>
              <input type="datetime-local" id="b-end" class="form-input" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="banner-modal-cancel">취소</button>
          <button class="btn btn-primary" id="banner-modal-submit">저장</button>
        </div>
      </div>
    </div>
  `;

  let editingId = null;
  let currentPosition = "";

  async function render() {
    const data = await loadBanners(currentPosition);
    const grid = document.getElementById("banner-grid");
    const list = data.banners ?? [];

    grid.innerHTML = list.length
      ? list
          .map(
            (b) => `
      <div class="banner-card">
        <div class="banner-img-wrap">
          <img src="${b.imageUrl}" alt="${b.title}" onerror="this.src=''" />
        </div>
        <div class="banner-info">
          <p class="banner-title">${b.title}</p>
          <p class="banner-meta">위치: ${POSITION_LABELS[b.position] ?? b.position ?? "-"}</p>
          <p class="banner-meta">${b.startDate?.slice(0, 10) ?? "-"} ~ ${b.endDate?.slice(0, 10) ?? "-"}</p>
          <p class="banner-meta">순서: ${b.sortOrder ?? "-"}</p>
        </div>
        <div class="banner-actions">
          <button class="btn-sm btn-edit" data-id="${b.id}">수정</button>
          <button class="btn-sm btn-delete" data-id="${b.id}">삭제</button>
        </div>
      </div>
    `,
          )
          .join("")
      : `<p class="empty">등록된 배너가 없습니다.</p>`;

    grid.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", () => {
        const banner = list.find((b) => b.id == btn.dataset.id);
        openModal(banner);
      });
    });

    grid.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("삭제하시겠습니까?")) return;
        await deleteBanner(btn.dataset.id);
        render();
      });
    });
  }

  function openModal(banner = null) {
    editingId = banner?.id ?? null;
    document.getElementById("banner-modal-title").textContent = banner
      ? "배너 수정"
      : "배너 등록";
    document.getElementById("b-title").value = banner?.title ?? "";
    document.getElementById("b-image-url").value = banner?.imageUrl ?? "";
    document.getElementById("b-link").value = banner?.linkUrl ?? "";
    document.getElementById("b-position").value = banner?.position ?? "main";
    document.getElementById("b-order").value = banner?.sortOrder ?? 1;
    document.getElementById("b-start").value =
      banner?.startDate?.slice(0, 16) ?? "";
    document.getElementById("b-end").value =
      banner?.endDate?.slice(0, 16) ?? "";
    document.getElementById("banner-modal").classList.remove("hidden");
  }

  function closeModal() {
    document.getElementById("banner-modal").classList.add("hidden");
    editingId = null;
  }

  document.getElementById("banner-tab-bar").addEventListener("click", (e) => {
    const btn = e.target.closest(".tab-btn");
    if (!btn) return;

    document
      .querySelectorAll(".tab-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    currentPosition = btn.dataset.position;
    render();
  });

  document
    .getElementById("banner-add-btn")
    .addEventListener("click", () => openModal());
  document
    .getElementById("banner-modal-close")
    .addEventListener("click", closeModal);
  document
    .getElementById("banner-modal-cancel")
    .addEventListener("click", closeModal);

  document
    .getElementById("banner-modal-submit")
    .addEventListener("click", async () => {
      const imageFile = document.getElementById("b-image").files[0];
      let imageUrl = document.getElementById("b-image-url").value;
      if (imageFile) imageUrl = await uploadImage(imageFile);

      const body = {
        title: document.getElementById("b-title").value,
        imageUrl,
        position: document.getElementById("b-position").value,
      };

      const linkUrl = document.getElementById("b-link").value;
      if (linkUrl) body.linkUrl = linkUrl;

      const sortOrder = Number(document.getElementById("b-order").value);
      if (sortOrder) body.sortOrder = sortOrder;

      const startDate = document.getElementById("b-start").value;
      if (startDate) body.startDate = startDate;

      const endDate = document.getElementById("b-end").value;
      if (endDate) body.endDate = endDate;

      if (editingId) {
        await updateBanner(editingId, body);
      } else {
        await createBanner(body);
      }
      closeModal();
      render();
    });

  render();
}
