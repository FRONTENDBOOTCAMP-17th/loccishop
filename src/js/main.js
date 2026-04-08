import "/src/styles/style.css";
import { renderHeader } from "/src/components/header/header.js";
import { renderFooter } from "/src/components/footer/footer.js";
import { createProductCard } from "/src/components/ui/product-card.js";
import { createButton } from "/src/components/ui/button.js";
import { createTag } from "/src/components/ui/tag.js";

// ── 헤더 / 푸터 마운트 ────────────────────────────────────────────
document.getElementById("header").replaceWith(renderHeader());
document.getElementById("footer").replaceWith(renderFooter());

// ════════════════════════════════════════════════════════════════
//  롤링 배너
// ════════════════════════════════════════════════════════════════
(function initBanner() {
  const TOTAL = 3;
  const AUTOPLAY_MS = 4000;

  const track = document.getElementById("banner-track");
  const dotsNav = document.getElementById("banner-dots");
  const prevBtn = document.getElementById("banner-prev");
  const nextBtn = document.getElementById("banner-next");

  if (!track || !dotsNav) return;

  let current = 0;
  let timer = null;
  const slides = track.querySelectorAll("li");

  // 도트 버튼 생성
  const dotBtns = Array.from({ length: TOTAL }, (_, i) => {
    const btn = document.createElement("button");
    btn.className = "w-2 h-2 rounded-full transition-all duration-300 cursor-pointer";
    btn.setAttribute("aria-label", `슬라이드 ${i + 1}로 이동`);
    btn.addEventListener("click", () => goTo(i));
    dotsNav.append(btn);
    return btn;
  });

  function updateUI() {
    // 트랙 이동: 각 슬라이드 너비 = 100/TOTAL %
    track.style.transform = `translateX(-${current * (100 / TOTAL)}%)`;

    // aria-hidden 갱신
    slides.forEach((li, i) =>
      li.setAttribute("aria-hidden", i !== current ? "true" : "false"),
    );

    // 도트 활성 상태 갱신
    dotBtns.forEach((btn, i) => {
      btn.classList.toggle("bg-white", i === current);
      btn.classList.toggle("bg-white/40", i !== current);
    });
  }

  function goTo(index) {
    current = (index + TOTAL) % TOTAL;
    updateUI();
    resetTimer();
  }

  function startTimer() {
    timer = setInterval(() => goTo(current + 1), AUTOPLAY_MS);
  }

  function resetTimer() {
    clearInterval(timer);
    startTimer();
  }

  // 이전 / 다음 버튼
  prevBtn?.addEventListener("click", () => goTo(current - 1));
  nextBtn?.addEventListener("click", () => goTo(current + 1));

  // 호버 시 일시 정지
  const section = document.getElementById("hero-banner");
  section?.addEventListener("mouseenter", () => clearInterval(timer));
  section?.addEventListener("mouseleave", startTimer);

  // 터치 스와이프
  let touchStartX = 0;
  section?.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  section?.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  }, { passive: true });

  // 초기화
  updateUI();
  startTimer();
})();

// ════════════════════════════════════════════════════════════════
//  아몬드 컬렉션 데이터
// ════════════════════════════════════════════════════════════════
const almondProducts = [
  {
    image: "/src/assets/images/product1_0.webp",
    imageAlt: "아몬드 소프트닝 샤워 오일",
    badgeType: null,
    size: "500 ml",
    name: "아몬드 소프트닝 샤워 오일",
    originalPrice: 73000,
    discountRate: 10,
    discountPrice: 66000,
    isWished: false,
    category: "바디 케어",
  },
  {
    image: "/src/assets/images/product1_1.webp",
    imageAlt: "아몬드 슈퍼 익스트랙트",
    badgeType: "NEW",
    size: "200 ml",
    name: "아몬드 슈퍼 익스트랙트",
    originalPrice: 110000,
    discountRate: 11,
    discountPrice: 98000,
    isWished: false,
    category: "바디 케어",
  },
  {
    image: "/src/assets/images/product1_2.webp",
    imageAlt: "아몬드 밀크 컨센트레이트",
    badgeType: null,
    size: "200 ml",
    name: "아몬드 밀크 컨센트레이트",
    originalPrice: 88000,
    discountRate: 5,
    discountPrice: 83600,
    isWished: false,
    category: "리필",
  },
  {
    image: "/src/assets/images/product1_3.webp",
    imageAlt: "아몬드 핸드크림",
    badgeType: "BEST",
    size: "75 ml",
    name: "아몬드 핸드크림",
    originalPrice: 32000,
    discountRate: null,
    discountPrice: null,
    isWished: true,
    category: "핸드 케어",
  },
  {
    image: "/src/assets/images/product1_4.webp",
    imageAlt: "아몬드 바디 로션",
    badgeType: null,
    size: "250 ml",
    name: "아몬드 바디 로션",
    originalPrice: 65000,
    discountRate: 8,
    discountPrice: 59800,
    isWished: false,
    category: "바디 케어",
  },
  {
    image: "/src/assets/images/product1_5.webp",
    imageAlt: "아몬드 핸드 워시",
    badgeType: null,
    size: "300 ml",
    name: "아몬드 핸드 워시",
    originalPrice: 45000,
    discountRate: null,
    discountPrice: null,
    isWished: false,
    category: "핸드 케어",
  },
  {
    image: "/src/assets/images/product1_6.webp",
    imageAlt: "아몬드 리필 바디 밀크",
    badgeType: "NEW",
    size: "500 ml",
    name: "아몬드 리필 바디 밀크",
    originalPrice: 55000,
    discountRate: 10,
    discountPrice: 49500,
    isWished: false,
    category: "리필",
  },
  {
    image: "/src/assets/images/product1_7.webp",
    imageAlt: "아몬드 딜라이트풀 바디 버터",
    badgeType: "BEST",
    size: "200 ml",
    name: "아몬드 딜라이트풀 바디 버터",
    originalPrice: 72000,
    discountRate: 12,
    discountPrice: 63360,
    isWished: false,
    category: "바디 케어",
  },
];

// ════════════════════════════════════════════════════════════════
//  기프트 데이터
// ════════════════════════════════════════════════════════════════
const giftProducts = [
  {
    image: "/src/assets/images/list_handcaregift.webp",
    imageAlt: "핸드케어 기프트 세트",
    badgeType: "NEW",
    size: "",
    name: "핸드케어 기프트 세트",
    originalPrice: 45000,
    discountRate: 13,
    discountPrice: 39000,
    isWished: false,
    priceRange: "3만원대",
  },
  {
    image: "/src/assets/images/list_handcream.webp",
    imageAlt: "핸드크림 트리오 세트",
    badgeType: null,
    size: "",
    name: "핸드크림 트리오 세트",
    originalPrice: 28000,
    discountRate: null,
    discountPrice: null,
    isWished: false,
    priceRange: "2만원대",
  },
  {
    image: "/src/assets/images/list_handwash&soap.webp",
    imageAlt: "핸드워시 & 솝 세트",
    badgeType: "BEST",
    size: "",
    name: "핸드워시 & 솝 세트",
    originalPrice: 50000,
    discountRate: 10,
    discountPrice: 45000,
    isWished: false,
    priceRange: "5만원대",
  },
  {
    image: "/src/assets/images/list_hand&nailcare.webp",
    imageAlt: "핸드 & 네일 케어 세트",
    badgeType: null,
    size: "",
    name: "핸드 & 네일 케어 세트",
    originalPrice: 38000,
    discountRate: 13,
    discountPrice: 33000,
    isWished: false,
    priceRange: "3만원대",
  },
  {
    image: "/src/assets/images/list_handcarerefill.webp",
    imageAlt: "핸드케어 리필 세트",
    badgeType: null,
    size: "",
    name: "핸드케어 리필 세트",
    originalPrice: 105000,
    discountRate: 10,
    discountPrice: 94500,
    isWished: false,
    priceRange: "10만원대",
  },
];

// ════════════════════════════════════════════════════════════════
//  공통 헬퍼
// ════════════════════════════════════════════════════════════════

/** createProductCard 컴포넌트로 li 목록 렌더링 */
function renderProducts(products, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  products.forEach((product) => {
    const li = document.createElement("li");
    li.append(createProductCard(product));
    container.append(li);
  });
}

/**
 * createTag 컴포넌트로 탭 필터 렌더링
 * @param {{ navId, tabs, allProducts, containerId, filterKey }} opts
 */
function setupTabs({ navId, tabs, allProducts, containerId, filterKey }) {
  const nav = document.getElementById(navId);
  if (!nav) return;

  const tagEls = [];

  function setActive(index) {
    tagEls.forEach((tag, i) => {
      if (i === index) {
        tag.classList.remove("bg-spring-wood", "text-woody-brown", "border-empress");
        tag.classList.add("bg-ferra", "text-spring-wood", "border-ferra");
      } else {
        tag.classList.remove("bg-ferra", "text-spring-wood", "border-ferra");
        tag.classList.add("bg-spring-wood", "text-woody-brown", "border-empress");
      }
    });
  }

  tabs.forEach((label, i) => {
    const tag = createTag({ text: label, state: i === 0 ? "active" : "default" });
    tag.addEventListener("click", () => {
      setActive(i);
      const filtered =
        label === "모두보기"
          ? allProducts
          : allProducts.filter((p) => p[filterKey] === label);
      renderProducts(filtered, containerId);
    });
    tagEls.push(tag);
    nav.append(tag);
  });
}

// ════════════════════════════════════════════════════════════════
//  아몬드 컬렉션 — 탭 + 렌더링
// ════════════════════════════════════════════════════════════════
setupTabs({
  navId: "almond-tabs",
  tabs: ["모두보기", "바디 케어", "핸드 케어", "리필"],
  allProducts: almondProducts,
  containerId: "almond-grid",
  filterKey: "category",
});
renderProducts(almondProducts, "almond-grid");

// ════════════════════════════════════════════════════════════════
//  기프트 섹션 — 탭 + 렌더링
// ════════════════════════════════════════════════════════════════
setupTabs({
  navId: "gift-tabs",
  tabs: ["모두보기", "2만원대", "3만원대", "5만원대", "10만원대"],
  allProducts: giftProducts,
  containerId: "gift-grid",
  filterKey: "priceRange",
});
renderProducts(giftProducts, "gift-grid");

// ════════════════════════════════════════════════════════════════
//  CTA 버튼 마운트 — createButton 컴포넌트 사용
// ════════════════════════════════════════════════════════════════

// 추천 제품 섹션
const featuredBtnEl = document.getElementById("featured-btn");
if (featuredBtnEl) {
  featuredBtnEl.append(
    createButton({ text: "자세히 보기", variant: "outline", size: "sm" }),
  );
}

// Refill 섹션 (어두운 배경 위 흰 버튼)
const refillBtnEl = document.getElementById("refill-btn");
if (refillBtnEl) {
  const btn = createButton({ text: "자세히 알아보기", variant: "primary", size: "sm" });
  btn.classList.replace("bg-woody-brown", "bg-white");
  btn.classList.replace("text-white", "text-woody-brown");
  btn.classList.add("hover:bg-gray-100");
  refillBtnEl.append(btn);
}
