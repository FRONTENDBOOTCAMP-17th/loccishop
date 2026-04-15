import { fetchAPI, uploadImage } from "/admin/js/api.js";
import { createPagination } from "/src/components/ui/pagination.js";

export async function loadProducts(page = 1, keyword = "", categoryId = "") {
  const params = new URLSearchParams({ page, limit: 20 });
  if (keyword) params.set("keyword", keyword);
  if (categoryId) params.set("categoryId", categoryId);
  return fetchAPI(`/admin/products?${params}`);
}

export async function loadProduct(id) {
  return fetchAPI(`/products/${id}`);
}

export async function createProduct(data) {
  return fetchAPI("/admin/products", { method: "POST", body: data });
}

export async function updateProduct(id, data) {
  return fetchAPI(`/admin/products/${id}`, { method: "PATCH", body: data });
}

export async function deleteProduct(id) {
  return fetchAPI(`/admin/products/${id}`, { method: "DELETE" });
}

export function renderProductsSection(container) {
  container.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">상품 관리</h2>
      <button class="btn btn-primary" id="product-add-btn">+ 상품 등록</button>
    </div>
    <div class="search-bar">
  <input type="text" id="product-search" placeholder="상품명 검색..." class="search-input" />
  <select id="product-category-filter" class="search-input">
  <option value="">전체 카테고리</option>
  <optgroup label="핸드 케어">
    <option value="2">핸드 크림</option>
    <option value="3">핸드 워시 & 솝</option>
    <option value="4">핸드 & 네일 케어</option>
  </optgroup>
  <optgroup label="바디 케어">
    <option value="9">바디 크림 & 로션</option>
    <option value="10">바디 오일 & 세럼</option>
    <option value="11">바디 워시 & 스크럽</option>
    <option value="23">고체 솝</option>
  </optgroup>
</select>
</div>
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th><th>상품명</th><th>가격</th><th>할인가</th><th>재고</th><th>관리</th>
          </tr>
        </thead>
        <tbody id="product-tbody"></tbody>
      </table>
    </div>
    <div class="pagination" id="product-pagination"></div>

    <div class="modal-overlay hidden" id="product-modal">
      <div class="modal modal-xl">
        <div class="modal-header">
          <h3 id="product-modal-title">상품 등록</h3>
          <button class="modal-close" id="product-modal-close">✕</button>
        </div>
        <div class="modal-body">
          <div class="tab-nav">
            <button class="tab-btn active" data-tab="basic">기본 정보</button>
            <button class="tab-btn" data-tab="images">이미지</button>
            <button class="tab-btn" data-tab="info">상품 상세</button>
          </div>

          <!-- 기본 정보 -->
          <div class="tab-panel active" id="tab-basic">
            <div class="form-grid">
              <div class="form-group full">
                <label>상품명 *</label>
                <input type="text" id="p-name" class="form-input" />
              </div>
              <div class="form-group">
                <label>그룹 ID</label>
                <input type="text" id="p-group-id" class="form-input" placeholder="예: shea-hand" />
              </div>
              <div class="form-group">
                <label>옵션 라벨</label>
                <input type="text" id="p-label" class="form-input" placeholder="예: 30ml" />
              </div>
              <div class="form-group">
                <label>정가 *</label>
                <input type="number" id="p-price" class="form-input" />
              </div>
              <div class="form-group">
                <label>할인가</label>
                <input type="number" id="p-discount-price" class="form-input" placeholder="없으면 비워두기" />
              </div>
              <div class="form-group">
                <label>재고 *</label>
                <input type="number" id="p-stock" class="form-input" />
              </div>
              <div class="form-group">
                <label>카테고리 ID *</label>
                <input type="number" id="p-category" class="form-input" />
              </div>
              <div class="form-group">
                <label>뱃지</label>
                <select id="p-badge" class="form-input">
                  <option value="">없음</option>
                  <option value="NEW">NEW</option>
                  <option value="BEST">BEST</option>
                  <option value="SALE">SALE</option>
                </select>
              </div>
              <div class="form-group full">
                <label>짧은 설명</label>
                <input type="text" id="p-short-desc" class="form-input" />
              </div>
              <div class="form-group full">
                <label>상세 설명</label>
                <textarea id="p-desc" class="form-input" style="white-space: pre-wrap;" rows="4"></textarea>
              </div>
            </div>
          </div>

          <!-- 이미지 -->
          <div class="tab-panel hidden" id="tab-images">
            <div class="form-grid">
              <div class="form-group full">
                <label>대표 이미지</label>
                <input type="file" id="p-rep-file" accept="image/*" class="form-input" />
                <input type="text" id="p-rep-url" class="form-input mt-2" placeholder="또는 URL 직접 입력" />
                <div id="p-rep-preview" class="image-preview mt-2"></div>
              </div>
              <div class="form-group full">
                <label>메인 슬라이드 이미지</label>
                <input type="file" id="p-slides-file" accept="image/*" multiple class="form-input" />
                <div id="p-slides-list" class="url-list mt-2"></div>
                <button class="btn-add-url mt-2" id="p-slides-add">+ URL 직접 추가</button>
              </div>
              <div class="form-group full">
                <label>상세 콘텐츠 이미지</label>
                <input type="file" id="p-details-file" accept="image/*" multiple class="form-input" />
                <div id="p-details-list" class="url-list mt-2"></div>
                <button class="btn-add-url mt-2" id="p-details-add">+ URL 직접 추가</button>
              </div>
            </div>
          </div>

          <!-- 상품 상세 -->
          <div class="tab-panel hidden" id="tab-info">
            <div class="form-grid">
              <div class="form-group full">
                <label>사용 방법</label>
                <textarea id="p-how-to-use" class="form-input" style="white-space: pre-wrap;" rows="3"></textarea>
              </div>
              <div class="form-group full">
                <label>전성분</label>
                <textarea id="p-full-ingredients" class="form-input" style="white-space: pre-wrap;" rows="3" placeholder="정제수, 글리세린, ..."></textarea>
              </div>
              <div class="form-group full">
                <label>주요 성분</label>
                <div id="p-key-ingredients-list"></div>
                <button class="btn-add-url mt-2" id="p-key-add">+ 성분 추가</button>
              </div>
              <div class="form-group full">
                <label>상품정보 제공고시</label>
                <textarea id="p-disclosure" class="form-input" style="white-space: pre-wrap;" rows="3"></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="product-modal-cancel">취소</button>
          <button class="btn btn-primary" id="product-modal-submit">저장</button>
        </div>
      </div>
    </div>
  `;

  // 탭 전환
  container.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      container
        .querySelectorAll(".tab-btn")
        .forEach((b) => b.classList.remove("active"));
      container.querySelectorAll(".tab-panel").forEach((p) => {
        p.classList.remove("active");
        p.classList.add("hidden");
      });
      btn.classList.add("active");
      const panel = document.getElementById(`tab-${btn.dataset.tab}`);
      panel.classList.remove("hidden");
      panel.classList.add("active");
    });
  });

  // 슬라이드/상세 이미지 URL 목록
  const slidesUrls = [];
  const detailsUrls = [];

  function renderUrlList(listId, urls) {
    const list = document.getElementById(listId);
    if (!list) return;
    list.innerHTML = urls
      .map(
        (url, i) => `
      <div class="url-item">
        <span class="url-text">${url}</span>
        <button class="url-remove" data-index="${i}">✕</button>
      </div>
    `,
      )
      .join("");
    list.querySelectorAll(".url-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        urls.splice(Number(btn.dataset.index), 1);
        renderUrlList(listId, urls);
      });
    });
  }

  document.getElementById("p-slides-add").addEventListener("click", () => {
    const url = prompt("슬라이드 이미지 URL 입력:");
    if (url) {
      slidesUrls.push(url);
      renderUrlList("p-slides-list", slidesUrls);
    }
  });

  document.getElementById("p-details-add").addEventListener("click", () => {
    const url = prompt("상세 이미지 URL 입력:");
    if (url) {
      detailsUrls.push(url);
      renderUrlList("p-details-list", detailsUrls);
    }
  });

  document
    .getElementById("p-slides-file")
    .addEventListener("change", async (e) => {
      for (const file of e.target.files) {
        const url = await uploadImage(file);
        slidesUrls.push(url);
      }
      renderUrlList("p-slides-list", slidesUrls);
    });

  document
    .getElementById("p-details-file")
    .addEventListener("change", async (e) => {
      for (const file of e.target.files) {
        const url = await uploadImage(file);
        detailsUrls.push(url);
      }
      renderUrlList("p-details-list", detailsUrls);
    });

  document
    .getElementById("p-rep-file")
    .addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const url = await uploadImage(file);
      document.getElementById("p-rep-url").value = url;
      document.getElementById("p-rep-preview").innerHTML =
        `<img src="${url}" />`;
    });

  // 주요 성분
  const keyIngredients = [];

  function renderKeyIngredients() {
    const list = document.getElementById("p-key-ingredients-list");
    if (!list) return;
    list.innerHTML = keyIngredients
      .map(
        (ing, i) => `
      <div class="key-ingredient-item">
        <input type="text" class="form-input ing-name" data-index="${i}" value="${ing.name}" placeholder="성분명" />
        <input type="text" class="form-input ing-desc" data-index="${i}" value="${ing.description}" placeholder="효능 설명" />
        <button class="url-remove" data-index="${i}">✕</button>
      </div>
    `,
      )
      .join("");
    list.querySelectorAll(".ing-name").forEach((el) => {
      el.addEventListener("input", () => {
        keyIngredients[el.dataset.index].name = el.value;
      });
    });
    list.querySelectorAll(".ing-desc").forEach((el) => {
      el.addEventListener("input", () => {
        keyIngredients[el.dataset.index].description = el.value;
      });
    });
    list.querySelectorAll(".url-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        keyIngredients.splice(Number(btn.dataset.index), 1);
        renderKeyIngredients();
      });
    });
  }

  document.getElementById("p-key-add").addEventListener("click", () => {
    keyIngredients.push({ name: "", description: "" });
    renderKeyIngredients();
  });

  let currentPage = 1;
  let editingId = null;

  async function render(page = 1, keyword = "", categoryId = "") {
    currentPage = page;
    const data = await loadProducts(page, keyword, categoryId);
    const products = data.products ?? [];
    const limit = 20;

    const tbody = document.getElementById("product-tbody");
    tbody.innerHTML = products
      .map(
        (p) => `
    <tr>
      <td>${p.id}</td>
      <td class="td-name">${p.name}</td>
      <td>${p.price?.toLocaleString()}원</td>
      <td>${p.discountPrice ? p.discountPrice.toLocaleString() + "원" : "-"}</td>
      <td>${p.stock}</td>
      <td class="td-actions">
        <button class="btn-sm btn-edit" data-id="${p.id}">수정</button>
        <button class="btn-sm btn-delete" data-id="${p.id}">삭제</button>
      </td>
    </tr>
  `,
      )
      .join("");

    // 페이지네이션 — 이 블록만 있어야 함
    const pg = document.getElementById("product-pagination");
    pg.innerHTML = "";
    const hasNext = products.length === limit;
    const totalPages = hasNext ? page + 1 : page;
    if (page > 1 || hasNext) {
      const nav = createPagination({
        totalPages,
        currentPage: page,
        onPageChange: (p) =>
          render(
            p,
            document.getElementById("product-search").value,
            document.getElementById("product-category-filter").value,
          ),
      });
      pg.append(nav);
    }

    tbody.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const product = await loadProduct(btn.dataset.id);
        openModal(product);
      });
    });

    tbody.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("삭제하시겠습니까?")) return;
        await deleteProduct(btn.dataset.id);
        render(
          currentPage,
          document.getElementById("product-search").value,
          document.getElementById("product-category-filter").value,
        );
      });
    });
  }

  function openModal(product = null) {
    editingId = product?.id ?? null;

    const currentOption = product?.options?.find(
      (o) => o.current || o.isCurrent,
    );
    document.getElementById("p-label").value = currentOption?.label ?? "";

    // 탭 초기화
    container
      .querySelectorAll(".tab-btn")
      .forEach((b) => b.classList.remove("active"));
    container.querySelectorAll(".tab-panel").forEach((p) => {
      p.classList.remove("active");
      p.classList.add("hidden");
    });
    container.querySelector('[data-tab="basic"]').classList.add("active");
    document.getElementById("tab-basic").classList.remove("hidden");
    document.getElementById("tab-basic").classList.add("active");

    document.getElementById("product-modal-title").textContent = product
      ? "상품 수정"
      : "상품 등록";

    // 기본 정보
    document.getElementById("p-name").value = product?.name ?? "";
    document.getElementById("p-group-id").value = product?.groupId ?? "";
    document.getElementById("p-price").value = product?.price ?? "";
    document.getElementById("p-discount-price").value =
      product?.discountPrice ?? "";
    document.getElementById("p-stock").value = product?.stock ?? "";
    document.getElementById("p-category").value = product?.categoryId ?? "";
    document.getElementById("p-badge").value = product?.badge ?? "";
    document.getElementById("p-short-desc").value =
      product?.shortDescription ?? "";
    document.getElementById("p-desc").value = product?.description ?? "";

    // 이미지
    const repUrl = product?.images?.representative ?? "";
    document.getElementById("p-rep-url").value = repUrl;
    document.getElementById("p-rep-preview").innerHTML = repUrl
      ? `<img src="${repUrl}" />`
      : "";

    slidesUrls.length = 0;
    detailsUrls.length = 0;
    (product?.images?.mainSlides ?? []).forEach((url) => slidesUrls.push(url));
    (product?.images?.detailContents ?? []).forEach((url) =>
      detailsUrls.push(url),
    );
    renderUrlList("p-slides-list", slidesUrls);
    renderUrlList("p-details-list", detailsUrls);

    // 상품 상세
    document.getElementById("p-how-to-use").value =
      product?.productInfo?.howToUse ?? "";
    document.getElementById("p-full-ingredients").value =
      product?.productInfo?.fullIngredients ??
      product?.productInfo?.ingredients?.fullIngredients ??
      "";
    document.getElementById("p-disclosure").value =
      product?.productInfo?.productDisclosure ?? "";

    keyIngredients.length = 0;
    (product?.productInfo?.ingredients?.keyIngredients ?? []).forEach((ing) =>
      keyIngredients.push({ ...ing }),
    );
    renderKeyIngredients();

    document.getElementById("product-modal").classList.remove("hidden");
  }

  function closeModal() {
    document.getElementById("product-modal").classList.add("hidden");
    editingId = null;
  }

  document
    .getElementById("product-add-btn")
    .addEventListener("click", () => openModal());
  document
    .getElementById("product-modal-close")
    .addEventListener("click", closeModal);
  document
    .getElementById("product-modal-cancel")
    .addEventListener("click", closeModal);

  document
    .getElementById("product-modal-submit")
    .addEventListener("click", async () => {
      const repUrl = document.getElementById("p-rep-url").value;

      const body = {
        name: document.getElementById("p-name").value,
        price: Number(document.getElementById("p-price").value),
        stock: Number(document.getElementById("p-stock").value),
        categoryId: Number(document.getElementById("p-category").value),
      };

      const groupId = document.getElementById("p-group-id").value;
      if (groupId) body.groupId = groupId;

      const label = document.getElementById("p-label").value;
      if (label) body.label = label;

      const discountPrice = Number(
        document.getElementById("p-discount-price").value,
      );
      if (discountPrice) body.discountPrice = discountPrice;

      const badge = document.getElementById("p-badge").value;
      if (badge) body.badge = badge;

      const shortDesc = document.getElementById("p-short-desc").value;
      if (shortDesc) body.shortDescription = shortDesc;

      const desc = document.getElementById("p-desc").value;
      if (desc) body.description = desc;

      // 이미지
      if (repUrl || slidesUrls.length || detailsUrls.length) {
        body.images = {};
        if (repUrl) body.images.representative = repUrl;
        if (slidesUrls.length) body.images.mainSlides = [...slidesUrls];
        if (detailsUrls.length) body.images.detailContents = [...detailsUrls];
      }

      // 상품 상세
      const howToUse = document.getElementById("p-how-to-use").value;
      const fullIngredients =
        document.getElementById("p-full-ingredients").value;
      const disclosure = document.getElementById("p-disclosure").value;
      const validIngredients = keyIngredients.filter((i) => i.name);

      if (
        howToUse ||
        fullIngredients ||
        disclosure ||
        validIngredients.length
      ) {
        body.productInfo = {};
        if (howToUse) body.productInfo.howToUse = howToUse;
        if (fullIngredients) body.productInfo.fullIngredients = fullIngredients;
        if (disclosure) body.productInfo.productDisclosure = disclosure;
        if (validIngredients.length)
          body.productInfo.keyIngredients = validIngredients;
      }

      try {
        if (editingId) {
          await updateProduct(editingId, body);
        } else {
          await createProduct(body);
        }
        closeModal();
        render(
          currentPage,
          document.getElementById("product-search").value,
          document.getElementById("product-category-filter").value,
        );
      } catch (err) {
        alert("저장 실패: " + err.message);
      }
    });

  document
    .getElementById("product-category-filter")
    .addEventListener("change", (e) => {
      render(
        1,
        document.getElementById("product-search").value,
        e.target.value,
      );
    });

  document.getElementById("product-search").addEventListener("keydown", (e) => {
    if (e.key === "Enter")
      render(
        1,
        e.target.value,
        document.getElementById("product-category-filter").value,
      );
  });

  render();
}
