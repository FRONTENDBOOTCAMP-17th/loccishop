import { fetchAPI } from "./api.js";

export async function loadMembers(page = 1, keyword = "", status = "") {
  const params = new URLSearchParams({ page, limit: 20 });
  if (keyword) params.set("keyword", keyword);
  if (status) params.set("status", status);
  return fetchAPI(`/admin/members?${params}`);
}

export async function loadMember(id) {
  return fetchAPI(`/admin/members/${id}`);
}

export async function updateMember(id, data) {
  return fetchAPI(`/admin/members/${id}`, { method: "PATCH", body: data });
}

export async function deleteMember(id) {
  return fetchAPI(`/admin/members/${id}`, { method: "DELETE" });
}

export function renderMembersSection(container) {
  container.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">회원 관리</h2>
    </div>
    <div class="search-bar">
      <input type="text" id="member-search" placeholder="이름 또는 아이디 검색..." class="search-input" />
      <select id="member-status" class="search-select">
        <option value="">전체</option>
        <option value="ACTIVE">활성</option>
        <option value="SUSPENDED">정지</option>
        <option value="WITHDRAWN">탈퇴</option>
      </select>
    </div>
    <div class="table-wrap">
      <table class="data-table">
      <colgroup>
     <col style="width: 10%" />   <!-- ID -->
  <col style="width: 25%" />  <!-- 아이디 -->
  <col style="width: 12%" />  <!-- 이름 -->
  <col style="width: 8%" />   <!-- 등급 -->
  <col style="width: 8%" />   <!-- 포인트 -->
  <col style="width: 8%" />   <!-- 상태 -->
  <col style="width: 12%" />  <!-- 가입일 -->
  <col style="width: 17%" />  <!-- 관리 -->              
  </colgroup>
        <thead>
          <tr><th>ID</th><th>아이디</th><th>이름</th><th>등급</th><th>포인트</th><th>상태</th><th>가입일</th><th>관리</th></tr>
        </thead>
        <tbody id="member-tbody"></tbody>
      </table>
    </div>
    <div class="pagination" id="member-pagination"></div>
    <div class="modal-overlay hidden" id="member-detail-modal">
      <div class="modal modal-lg">
        <div class="modal-header">
          <h3>회원 상세</h3>
          <button class="modal-close" id="member-detail-close">✕</button>
        </div>
        <div class="modal-body" id="member-detail-body"></div>
      </div>
    </div>
    <div class="modal-overlay hidden" id="member-edit-modal">
      <div class="modal">
        <div class="modal-header">
          <h3>회원 수정</h3>
          <button class="modal-close" id="member-edit-close">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label>등급</label>
              <select id="m-grade" class="form-input">
                <option value="BRONZE">BRONZE</option>
                <option value="SILVER">SILVER</option>
                <option value="GOLD">GOLD</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
            <div class="form-group">
              <label>포인트</label>
              <input type="number" id="m-point" class="form-input" />
            </div>
            <div class="form-group">
              <label>상태</label>
              <select id="m-status" class="form-input">
                <option value="ACTIVE">활성</option>
                <option value="SUSPENDED">정지</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="member-edit-cancel">취소</button>
          <button class="btn btn-primary" id="member-edit-submit">저장</button>
        </div>
      </div>
    </div>
  `;

  let currentPage = 1;
  let editingId = null;

  async function render(page = 1) {
    currentPage = page;
    const keyword = document.getElementById("member-search").value;
    const status = document.getElementById("member-status").value;
    const data = await loadMembers(page, keyword, status);
    const members = data.members ?? [];
    const pagination = data.meta?.pagination ?? {};

    const tbody = document.getElementById("member-tbody");
    tbody.innerHTML = members
      .map(
        (m) => `
      <tr>
        <td>${m.memberId}</td>
        <td>${m.username}</td>
        <td>${m.name}</td>
        <td><span class="grade grade-${m.grade?.toLowerCase()}">${m.grade}</span></td>
        <td>${m.point?.toLocaleString()}</td>
        <td><span class="status status-${m.status?.toLowerCase()}">${m.status}</span></td>
        <td>${m.createdAt?.slice(0, 10)}</td>
        <td class="td-actions">
          <button class="btn-sm" data-id="${m.id}" data-action="detail">상세</button>
          <button class="btn-sm btn-edit" data-id="${m.memberId}">수정</button>
          <button class="btn-sm btn-delete" data-id="${m.memberId}">삭제</button>
        </td>
      </tr>
    `,
      )
      .join("");

    // 페이지네이션
    const pg = document.getElementById("member-pagination");
    pg.innerHTML = "";
    for (let i = 1; i <= (pagination.totalPages ?? 1); i++) {
      const btn = document.createElement("button");
      btn.className = `page-btn ${i === page ? "active" : ""}`;
      btn.textContent = i;
      btn.addEventListener("click", () => render(i));
      pg.append(btn);
    }

    tbody.querySelectorAll("[data-action='detail']").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const member = await loadMember(btn.dataset.id);
        showDetail(member);
      });
    });

    tbody.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", () => {
        const member = members.find((m) => m.id == btn.dataset.memberId);
        openEditModal(member);
      });
    });

    tbody.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("회원을 삭제하시겠습니까?")) return;
        await deleteMember(btn.dataset.id);
        render(currentPage);
      });
    });
  }

  function showDetail(member) {
    document.getElementById("member-detail-body").innerHTML = `
      <div class="detail-grid">
        <div class="detail-item"><span>ID</span><strong>${member.id}</strong></div>
        <div class="detail-item"><span>아이디</span><strong>${member.username}</strong></div>
        <div class="detail-item"><span>이름</span><strong>${member.name}</strong></div>
        <div class="detail-item"><span>이메일</span><strong>${member.email}</strong></div>
        <div class="detail-item"><span>주소</span><strong>${member.baseAddress ?? "-"} ${member.detailAddress ?? ""}</strong></div>
        <div class="detail-item"><span>등급</span><strong>${member.grade}</strong></div>
        <div class="detail-item"><span>포인트</span><strong>${member.point?.toLocaleString()}</strong></div>
        <div class="detail-item"><span>상태</span><strong>${member.status}</strong></div>
        <div class="detail-item"><span>주문 수</span><strong>${member.orderCount ?? 0}건</strong></div>
        <div class="detail-item"><span>총 구매액</span><strong>${member.totalSpent?.toLocaleString() ?? 0}원</strong></div>
        <div class="detail-item"><span>가입일</span><strong>${member.createdAt?.slice(0, 10)}</strong></div>
      </div>
    `;
    document.getElementById("member-detail-modal").classList.remove("hidden");
  }

  function openEditModal(member) {
    editingId = member.id;
    document.getElementById("m-grade").value = member.grade;
    document.getElementById("m-point").value = member.point;
    document.getElementById("m-status").value = member.status;
    document.getElementById("member-edit-modal").classList.remove("hidden");
  }

  document
    .getElementById("member-detail-close")
    .addEventListener("click", () =>
      document.getElementById("member-detail-modal").classList.add("hidden"),
    );

  document
    .getElementById("member-edit-close")
    .addEventListener("click", () =>
      document.getElementById("member-edit-modal").classList.add("hidden"),
    );
  document
    .getElementById("member-edit-cancel")
    .addEventListener("click", () =>
      document.getElementById("member-edit-modal").classList.add("hidden"),
    );

  document
    .getElementById("member-edit-submit")
    .addEventListener("click", async () => {
      await updateMember(editingId, {
        grade: document.getElementById("m-grade").value,
        point: Number(document.getElementById("m-point").value),
        status: document.getElementById("m-status").value,
      });
      document.getElementById("member-edit-modal").classList.add("hidden");
      render(currentPage);
    });

  document.getElementById("member-search").addEventListener("keydown", (e) => {
    if (e.key === "Enter") render(1);
  });

  document
    .getElementById("member-status")
    .addEventListener("change", () => render(1));

  render();
}
