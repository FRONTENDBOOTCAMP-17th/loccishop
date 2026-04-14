import "/src/styles/style.css";
import { renderHeader } from "/src/components/header/header.js";
import { renderFooter } from "/src/components/footer/footer.js";
import { renderLoginModal } from "/src/components/login-modal/loginModal.js";
import { createTag } from "/src/components/ui/tag.js";
import { fetchProducts } from "/src/js/api/product/index.js";
import { fetchMe } from "/src/js/api/auth/index.js";
import {
  setupProductTabs,
  toCardProps,
} from "/src/components/ui/productTabs.js";
import { renderProductCards } from "/src/components/ui/product-card-list.js";
import { createCategoryCard } from "/src/components/ui/categoryCard.js";
import { createCarouselSlide } from "/src/components/ui/carouselSlide.js";
import { fetchCarousels } from "/src/js/api/carousel/index.js";

// ── 토큰 유효성 사전 검증 ────────────────────────────────────────
// 토큰이 있으면 /members/me 호출로 만료 여부 확인
// 만료됐을 경우 fetchAPI 내부에서 token/role/member를 자동 제거
if (localStorage.getItem("token")) {
  fetchMe().catch(() => {});
}

// ── 헤더 / 푸터 / 로그인 모달 마운트 ─────────────────────────────
const headerAnchor = document.getElementById("header");
const footerAnchor = document.getElementById("footer");
if (headerAnchor) headerAnchor.replaceWith(renderHeader());
if (footerAnchor) footerAnchor.replaceWith(renderFooter());
document.body.append(renderLoginModal());

// ── 상품 렌더링 ───────────────────────────────────────────────────
function renderProducts(products, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  renderProductCards(products, container);
}

// ── 탭 활성 스타일 토글 ───────────────────────────────────────────
const ACTIVE_CLASSES = ["bg-ferra", "text-spring-wood", "border-ferra"];
const DEFAULT_CLASSES = [
  "bg-spring-wood",
  "text-woody-brown",
  "border-empress",
];

function setActive(btn) {
  btn.classList.remove(...DEFAULT_CLASSES);
  btn.classList.add(...ACTIVE_CLASSES);
}
function setDefault(btn) {
  btn.classList.remove(...ACTIVE_CLASSES);
  btn.classList.add(...DEFAULT_CLASSES);
}

// ── 섹션 통합 설정 (탭 + 캐러셀) ─────────────────────────────────
function setupSection({
  navId,
  prevId,
  nextId,
  containerId,
  tabs,
  allProducts,
  visibleCount,
  filterFn,
}) {
  let currentProducts = [...allProducts];
  let offset = 0;

  function show() {
    renderProducts(
      currentProducts.slice(offset, offset + visibleCount),
      containerId,
    );
  }

  // 탭 생성 및 필터링
  const nav = document.getElementById(navId);
  if (nav) {
    tabs.forEach((label, idx) => {
      const btn = createTag({
        text: label,
        state: idx === 0 ? "active" : "default",
      });

      btn.addEventListener("click", () => {
        nav.querySelectorAll("button").forEach(setDefault);
        setActive(btn);

        currentProducts =
          label === "모두보기"
            ? [...allProducts]
            : filterFn(allProducts, label);
        offset = 0;
        show();
      });

      nav.append(btn);
    });
  }

  // 캐러셀 버튼
  document.getElementById(prevId)?.addEventListener("click", () => {
    if (offset <= 0) return;
    offset = Math.max(0, offset - visibleCount);
    show();
  });

  document.getElementById(nextId)?.addEventListener("click", () => {
    if (offset + visibleCount >= currentProducts.length) return;
    offset += visibleCount;
    show();
  });

  show();
}

// ── 필터 함수 ─────────────────────────────────────────────────────

// 아몬드 컬렉션: 상품명 키워드로 필터
function almondFilter(products, label) {
  if (label === "핸드 케어") {
    return products.filter((p) => p.name.includes("핸드"));
  }
  if (label === "리필") {
    return products.filter((p) => p.name.includes("리필"));
  }
  if (label === "바디 케어") {
    return products.filter(
      (p) => !p.name.includes("핸드") && !p.name.includes("리필"),
    );
  }
  return products;
}

// 기프트: 가격대로 필터
const PRICE_RANGES = {
  "2만원대": [20000, 29999],
  "3만원대": [30000, 39999],
  "5만원대": [50000, 59999],
  "10만원대": [100000, 109999],
};

function giftFilter(products, label) {
  const range = PRICE_RANGES[label];
  if (!range) return products;
  const [min, max] = range;
  return products.filter((p) => {
    const price = p.discountPrice ?? p.price;
    return price >= min && price <= max;
  });
}

// ── 초기 렌더링 ───────────────────────────────────────────────────
async function init() {
  const [almondData, giftData, carouselSlides] = await Promise.all([
    fetchProducts({ limit: 16 }),
    fetchProducts({ limit: 15 }),
    fetchCarousels().catch(() => []),
  ]);

  const almondProducts = (almondData.products ?? []).map(toCardProps);
  const giftProducts = giftData.products ?? [];

  // 아몬드 컬렉션 탭 + 가로 스크롤
  const almondContainer = document.getElementById("almond-grid");

  setupProductTabs({
    navEl: document.getElementById("almond-tabs"),
    tabs: ["모두보기", "바디 케어", "핸드 케어", "리필"],
    allProducts: almondProducts,
    filterFn: almondFilter,
    onTabChange: (filtered) => renderProductCards(filtered, almondContainer),
  });

  setupSection({
    navId: "gift-tabs",
    prevId: "gift-prev",
    nextId: "gift-next",
    containerId: "gift-grid",
    tabs: ["모두보기", "2만원대", "3만원대", "5만원대", "10만원대"],
    allProducts: giftProducts,
    visibleCount: 5,
    filterFn: giftFilter,
  });

  initRotatingCarousel(carouselSlides?.length ? carouselSlides : FALLBACK_SLIDES);
}

init().catch((err) => console.error("초기화 실패:", err));

// ── 메인 카테고리 그리드 ──────────────────────────────────────────
const MAIN_CATEGORIES = [
  { image: "/src/assets/images/main_page_1.webp", label: "공식몰 혜택" },
  { image: "/src/assets/images/main_page_2.webp", label: "선물 추천" },
  {
    image: "/src/assets/images/main_page_3.webp",
    label: "핸드 & 네일케어",
  },
  {
    image: "/src/assets/images/main_page_4.webp",
    label: "핸드케어 기프트",
  },
  {
    image: "/src/assets/images/main_page_5.webp",
    label: "핸드케어 리필",
  },
  { image: "/src/assets/images/main_page_6.webp", label: "STEP 1" },
  { image: "/src/assets/images/main_page_7.webp", label: "STEP 2" },
  { image: "/src/assets/images/main_page_8.webp", label: "STEP 3" },
];

const mainCategoryList = document.getElementById("main-category-list");
if (mainCategoryList) {
  MAIN_CATEGORIES.forEach((item) => {
    mainCategoryList.append(
      createCategoryCard({
        image: item.image,
        alt: item.label,
        label: item.label,
        liClass: "odd:pt-9 md:odd:pt-0",
      }),
    );
  });
}

// ── 추천 제품 캐러셀 (rotating) ───────────────────────────────────

// API 미구현 시 사용할 임시 데이터 (API 연동 후 제거)
const FALLBACK_SLIDES = [
  {
    imageUrl: "/src/assets/images/product1_1.webp",
    name: "아몬드 수딩 밀크 컨센트레이트 (아맹드 쉬블리므)",
    desc: "풍부한 아몬드 오일이 피부에 깊은 보습을 선사하며\n부드럽고 촉촉한 피부로 가꿔드립니다.",
  },
  {
    imageUrl: "/src/assets/images/product1_0.webp",
    name: "아몬드 서플 스킨 오일 (아맹드 쉬블리므)",
    desc: "바디 리추얼의 새로운 기준, 수분은 잡고 탄력은\n깨우는 바디 케어를 경험해보세요.",
  },
  {
    imageUrl: "/src/assets/images/handcareHero.webp",
    name: "시어 버터 핸드크림 (로즈 ET 리엔)",
    desc: "프로방스에서 자란 시어 버터가 손 피부를\n촉촉하고 부드럽게 가꿔드립니다.",
  },
  {
    imageUrl: "/src/assets/images/handcare_1.webp",
    name: "아몬드 핸드 크림 (아맹드 쉬블리므)",
    desc: "달콤한 아몬드 향과 함께 손을 감싸는\n깊은 보습 케어를 경험해보세요.",
  },
];

function initRotatingCarousel(slides) {
  const track = document.getElementById("rotating-track");
  const prevBtn = document.getElementById("rotating-prev");
  const nextBtn = document.getElementById("rotating-next");
  const counter = document.getElementById("rotating-counter");
  const prevLabel = document.getElementById("rotating-prev-label");
  const nextLabel = document.getElementById("rotating-next-label");

  if (!track) return;

  const section = track.closest("section");

  // 슬라이드 생성
  slides.forEach((slide) => {
    track.append(createCarouselSlide(slide));
  });

  let currentIdx = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartTranslate = 0;
  let currentTranslate = 0;

  function getSlideWidth() {
    return window.innerWidth * 0.68;
  }

  function getTranslateForIdx(idx) {
    const slideW = getSlideWidth();
    const peek = (window.innerWidth - slideW) / 2;
    return peek - idx * slideW;
  }

  function applyTranslate(px, animate = true) {
    track.style.transition = animate
      ? "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      : "none";
    track.style.transform = `translateX(${px}px)`;
    currentTranslate = px;
  }

  // 슬라이드별 scale/opacity 적용 (중앙=1, 양쪽=0.78)
  // 1024px 미만에서는 비활성 슬라이드의 텍스트 영역 숨김
  function updateSlideStyles() {
    const isMobile = window.innerWidth < 1024;
    track.querySelectorAll(".rotating-slide").forEach((slide, i) => {
      const isActive = i === currentIdx;
      slide.style.transform = isActive ? "scale(1)" : "scale(0.78)";
      slide.style.opacity = isActive ? "1" : "0.5";

      const textDiv = slide.querySelector(".rotating-text");
      if (textDiv) {
        textDiv.style.display = isMobile && !isActive ? "none" : "";
      }
    });
  }

  function updateNav() {
    const total = slides.length;
    counter.textContent = `${currentIdx + 1} / ${total}`;
    prevLabel.textContent =
      currentIdx > 0 ? slides[currentIdx - 1].name : "";
    nextLabel.textContent =
      currentIdx < total - 1 ? slides[currentIdx + 1].name : "";
    prevBtn.style.visibility = currentIdx > 0 ? "visible" : "hidden";
    nextBtn.style.visibility = currentIdx < total - 1 ? "visible" : "hidden";
  }

  function goTo(idx) {
    currentIdx = Math.max(0, Math.min(slides.length - 1, idx));
    applyTranslate(getTranslateForIdx(currentIdx), true);
    updateSlideStyles();
    updateNav();
  }

  // 초기 렌더링
  goTo(0);

  // 버튼
  prevBtn.addEventListener("click", () => goTo(currentIdx - 1));
  nextBtn.addEventListener("click", () => goTo(currentIdx + 1));

  // 마우스 드래그
  track.addEventListener("mousedown", (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartTranslate = currentTranslate;
    section.classList.add("is-dragging");
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartX;
    applyTranslate(dragStartTranslate + delta, false);
  });

  document.addEventListener("mouseup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    section.classList.remove("is-dragging");
    const delta = e.clientX - dragStartX;
    if (delta < -60) goTo(currentIdx + 1);
    else if (delta > 60) goTo(currentIdx - 1);
    else goTo(currentIdx);
  });

  // 터치 드래그
  track.addEventListener(
    "touchstart",
    (e) => {
      dragStartX = e.touches[0].clientX;
      dragStartTranslate = currentTranslate;
    },
    { passive: true },
  );

  track.addEventListener(
    "touchmove",
    (e) => {
      const delta = e.touches[0].clientX - dragStartX;
      applyTranslate(dragStartTranslate + delta, false);
    },
    { passive: true },
  );

  track.addEventListener("touchend", (e) => {
    const delta = e.changedTouches[0].clientX - dragStartX;
    if (delta < -60) goTo(currentIdx + 1);
    else if (delta > 60) goTo(currentIdx - 1);
    else goTo(currentIdx);
  });

  // 리사이즈 시 위치 재계산 + 텍스트 표시 여부 갱신
  window.addEventListener("resize", () => {
    applyTranslate(getTranslateForIdx(currentIdx), false);
    updateSlideStyles();
  });
}

