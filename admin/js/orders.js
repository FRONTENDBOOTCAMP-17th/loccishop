import { fetchAPI, fetchAPIWithMeta } from "./api.js";

const STATUS_MAP = {
  PAID: { text: "결제 완료", className: "status-active" },
  PREPARING: { text: "준비 중", className: "status-suspended" },
  SHIPPING: { text: "배송 중", className: "status-suspended" },
  DELIVERED: { text: "배송 완료", className: "status-withdrawn" },
  CANCELLED: { text: "취소", className: "status-withdrawn" },
};

const STATUS_OPTIONS = [
  "PAID",
  "PREPARING",
  "SHIPPING",
  "DELIVERED",
  "CANCELLED",
];

let currentPage = 1;
let currentStatus = "";
let currentKeyword = "";
let totalItems = 0;
const LIMIT = 20;

export async function renderOrdersSection(container) {
  container.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">주문 관리</h2>
    </div>

    <div class="search-bar">
      <select class="search-select" id="order-status-filter">
        <option value="">전체 상태</option>
        ${STATUS_OPTIONS.map((s) => `<option value="${s}">${STATUS_MAP[s].text}</option>`).join("")}
      </select>
      <input
        type="text"
        class="search-input"
        id="order-keyword"
        placeholder="주문번호 또는 회원명 검색"
      />
      <button class="btn btn-secondary" id="order-search-btn">검색</button>
    </div>

    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>주문번호</th>
            <th>아이디</th>
            <th>회원명</th>
            <th>주문일시</th>
            <th>상품 수</th>
            <th>결제금액</th>
            <th>상태</th>
            <th>상태 변경</th>
          </tr>
        </thead>
        <tbody id="order-tbody"></tbody>
      </table>
    </div>
    <div class="pagination" id="order-pagination"></div>
  `;

  document.getElementById("order-search-btn").addEventListener("click", () => {
    currentKeyword = document.getElementById("order-keyword").value.trim();
    currentStatus = document.getElementById("order-status-filter").value;
    currentPage = 1;
    loadOrders();
  });

  document
    .getElementById("order-status-filter")
    .addEventListener("change", () => {
      currentStatus = document.getElementById("order-status-filter").value;
      currentPage = 1;
      loadOrders();
    });

  loadOrders();
}

async function loadOrders() {
  const tbody = document.getElementById("order-tbody");
  tbody.innerHTML = `<tr><td colspan="8" class="empty">불러오는 중...</td></tr>`;

  const params = new URLSearchParams({ page: currentPage, limit: LIMIT });
  if (currentStatus) params.set("status", currentStatus);
  if (currentKeyword) params.set("keyword", currentKeyword);

  try {
    const res = await fetchAPIWithMeta(`/admin/orders?${params}`);
    const orders = res.data?.orders ?? [];

    // TODO: API에 meta.pagination 추가되면 아래 주석 해제하고 임시 코드 제거
    // const pagination = res.meta?.pagination;
    const hasNext = orders.length === LIMIT;
    const hasPrev = currentPage > 1;
    const pagination = {
      hasNext,
      hasPrev,
      totalPages: hasNext ? currentPage + 1 : currentPage,
    };

    if (orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="empty">주문 내역이 없습니다.</td></tr>`;
      renderPagination(pagination);
      return;
    }

    tbody.innerHTML = "";
    orders.forEach((order, index) => {
      const statusInfo = STATUS_MAP[order.status] ?? {
        text: order.status,
        className: "",
      };
      const date = order.createdAt?.split("T")[0].replace(/-/g, ".") ?? "-";
      const rowNumber = (currentPage - 1) * LIMIT + index + 1;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${rowNumber}</td>
        <td>${order.orderNumber}</td>
        <td>${order.memberId}</td>
        <td>${order.memberName}</td>
        <td>${date}</td>
        <td>${order.itemCount}개</td>
        <td>${order.totalAmount.toLocaleString()}원</td>
        <td><span class="status ${statusInfo.className}">${statusInfo.text}</span></td>
        <td>
          <div class="td-actions" style="justify-content:center">
            <select class="search-select status-change-select" data-id="${order.orderId}" data-member-id="${order.memberId ?? ""}" style="padding:4px 8px;font-size:12px">
              ${STATUS_OPTIONS.map((s) => `<option value="${s}" ${s === order.status ? "selected" : ""}>${STATUS_MAP[s].text}</option>`).join("")}
            </select>
            <button class="btn-sm btn-edit status-change-btn" data-id="${order.orderId}" data-amount="${order.totalAmount}" data-member-id="${order.memberId ?? ""}">변경</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    document.querySelectorAll(".status-change-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const orderId = Number(btn.dataset.id);
        const totalAmount = Number(btn.dataset.amount);
        const memberId = btn.dataset.memberId; // TODO: API에 memberId 추가되면 사용
        const select = document.querySelector(
          `.status-change-select[data-id="${orderId}"]`,
        );
        const newStatus = select.value;

        if (
          !confirm(
            `주문 상태를 "${STATUS_MAP[newStatus].text}"(으)로 변경하시겠습니까?`,
          )
        )
          return;

        try {
          await fetchAPI(`/admin/orders/${orderId}/status`, {
            method: "PATCH",
            body: { status: newStatus },
          });

          if (newStatus === "DELIVERED" && memberId) {
            await grantDeliveredPoint(memberId, totalAmount);
          }

          alert("주문 상태가 변경되었습니다.");
          loadOrders();
        } catch (e) {
          console.error("상태 변경 오류:", e);
          alert("상태 변경에 실패했습니다.");
        }
      });
    });

    renderPagination(pagination);
  } catch (e) {
    console.error("주문 목록 로딩 오류:", e);
    tbody.innerHTML = `<tr><td colspan="8" class="empty">데이터를 불러오는 중 오류가 발생했습니다.</td></tr>`;
  }
}

// TODO: API에 memberId 추가되면 주문 상세 조회 없이 바로 사용 가능
async function grantDeliveredPoint(memberId, totalAmount) {
  try {
    const pointToAdd = Math.floor(totalAmount * 0.05);

    const member = await fetchAPI(`/admin/members/${memberId}`);
    const currentPoint = member.point ?? 0;

    await fetchAPI(`/admin/members/${memberId}`, {
      method: "PATCH",
      body: { point: currentPoint + pointToAdd },
    });

    alert(`배송 완료! ${pointToAdd.toLocaleString()}P가 적립되었습니다.`);
  } catch (e) {
    console.error("포인트 적립 오류:", e);
  }
}

function renderPagination(pagination) {
  const container = document.getElementById("order-pagination");
  container.innerHTML = "";

  if (!pagination || pagination.totalPages <= 1) return;

  const prevBtn = document.createElement("button");
  prevBtn.className = "page-btn";
  prevBtn.textContent = "이전";
  prevBtn.disabled = !pagination.hasPrev;
  prevBtn.addEventListener("click", () => {
    currentPage--;
    loadOrders();
  });
  container.appendChild(prevBtn);

  for (let i = 1; i <= pagination.totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = `page-btn ${i === currentPage ? "active" : ""}`;
    btn.textContent = i;
    btn.addEventListener("click", () => {
      currentPage = i;
      loadOrders();
    });
    container.appendChild(btn);
  }

  const nextBtn = document.createElement("button");
  nextBtn.className = "page-btn";
  nextBtn.textContent = "다음";
  nextBtn.disabled = !pagination.hasNext;
  nextBtn.addEventListener("click", () => {
    currentPage++;
    loadOrders();
  });
  container.appendChild(nextBtn);
}
