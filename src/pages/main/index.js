import { checkTokenValidity } from "/src/js/utils/checkTokenValidity.js";
import { renderHeader } from "/src/components/header/header.js";
import { renderFooter } from "/src/components/footer/footer.js";
import { renderLoginModal } from "/src/components/login-modal/loginModal.js";
import { fetchProducts } from "/src/js/api/product/index.js";
import {
  setupProductTabs,
  toCardProps,
} from "/src/components/ui/productTabs.js";
import { renderProductCards } from "/src/components/ui/product-card-list.js";
import { createCategoryCard } from "/src/components/ui/categoryCard.js";
import { createCarouselSlide } from "/src/components/ui/carouselSlide.js";
import { fetchCarousels } from "/src/js/api/carousel/index.js";

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

// ── 메인 카테고리 그리드 ──────────────────────────────────────────
const MAIN_CATEGORIES = [
  { image: "/src/assets/images/main_page_1.webp", label: "공식몰 혜택" },
  { image: "/src/assets/images/main_page_2.webp", label: "선물 추천" },
  { image: "/src/assets/images/main_page_3.webp", label: "핸드 & 네일케어" },
  { image: "/src/assets/images/main_page_4.webp", label: "핸드케어 기프트" },
  { image: "/src/assets/images/main_page_5.webp", label: "핸드케어 리필" },
  { image: "/src/assets/images/main_page_6.webp", label: "STEP 1" },
  { image: "/src/assets/images/main_page_7.webp", label: "STEP 2" },
  { image: "/src/assets/images/main_page_8.webp", label: "STEP 3" },
];

// ── 추천 제품 캐러셀 (rotating) ───────────────────────────────────
function initRotatingCarousel(initialSlides, slideSets) {
  const track = document.getElementById("rotating-track");
  const prevBtn = document.getElementById("rotating-prev");
  const nextBtn = document.getElementById("rotating-next");
  const counter = document.getElementById("rotating-counter");
  const prevLabel = document.getElementById("rotating-prev-label");
  const nextLabel = document.getElementById("rotating-next-label");

  if (!track) {
    return;
  }

  const section = track.closest("section");

  let slides = initialSlides;
  let currentVIdx = 1;

  function buildTrack(newSlides) {
    slides = Array.isArray(newSlides) ? newSlides : [];
    track.innerHTML = "";

    if (slides.length === 0) {
      track.innerHTML = `
        <div class="w-full py-16 text-center text-empress">
          등록된 배너가 없습니다.
        </div>
      `;
      counter.textContent = "0 / 0";
      prevLabel.textContent = "";
      nextLabel.textContent = "";
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return false;
    }

    if (slides.length === 1) {
      track.append(createCarouselSlide(slides[0]));
      counter.textContent = "1 / 1";
      prevLabel.textContent = "";
      nextLabel.textContent = "";
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return false;
    }

    prevBtn.disabled = false;
    nextBtn.disabled = false;

    track.append(createCarouselSlide(slides[slides.length - 1])); // 마지막 클론
    slides.forEach((s) => track.append(createCarouselSlide(s)));
    track.append(createCarouselSlide(slides[0])); // 첫번째 클론
    return true;
  }

  function renderSlides(newSlides) {
    const built = buildTrack(newSlides);
    if (!built) return;

    currentVIdx = 1;
    applyTranslate(getTranslateForIdx(currentVIdx), false);
    updateSlideStyles();
    updateNav();
  }

  const built = buildTrack(slides);

  let isDragging = false;
  let dragStartX = 0;
  let dragStartTranslate = 0;
  let currentTranslate = 0;

  function getSlideWidth() {
    const w = window.innerWidth;
    if (w >= 1280) {
      return 942;
    }
    if (w >= 1024) {
      return 914;
    }
    if (w >= 768) {
      return 450;
    }
    return Math.min(450, w * 0.9);
  }

  function getTranslateForIdx(vIdx) {
    const slideW = getSlideWidth();
    const clientW = document.documentElement.clientWidth;
    const peek = (clientW - slideW) / 2;
    return peek - vIdx * slideW;
  }

  function applyTranslate(px, animate = true) {
    track.style.transition = animate
      ? "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      : "none";
    track.style.transform = `translateX(${px}px)`;
    currentTranslate = px;
  }

  function getRealIdx() {
    if (currentVIdx === 0) {
      return slides.length - 1;
    }
    if (currentVIdx === slides.length + 1) {
      return 0;
    }
    return currentVIdx - 1;
  }

  function updateSlideStyles() {
    const isMobile = window.innerWidth < 1024;
    track.querySelectorAll(".rotating-slide").forEach((slide, i) => {
      const isActive = i === currentVIdx;
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
    const realIdx = getRealIdx();
    counter.textContent = `${realIdx + 1} / ${total}`;
    prevLabel.textContent = slides[(realIdx - 1 + total) % total].name;
    nextLabel.textContent = slides[(realIdx + 1) % total].name;
  }

  function goTo(vIdx) {
    currentVIdx = vIdx;
    applyTranslate(getTranslateForIdx(currentVIdx), true);
    updateSlideStyles();
    updateNav();

    track.addEventListener(
      "transitionend",
      () => {
        if (currentVIdx === 0) {
          currentVIdx = slides.length;
          applyTranslate(getTranslateForIdx(currentVIdx), false);
          updateSlideStyles();
        } else if (currentVIdx === slides.length + 1) {
          currentVIdx = 1;
          applyTranslate(getTranslateForIdx(currentVIdx), false);
          updateSlideStyles();
        }
      },
      { once: true },
    );
  }

  if (built) {
    applyTranslate(getTranslateForIdx(currentVIdx), false);
    updateSlideStyles();
    updateNav();
  }

  prevBtn.addEventListener("click", () => goTo(currentVIdx - 1));
  nextBtn.addEventListener("click", () => goTo(currentVIdx + 1));

  track.addEventListener("mousedown", (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartTranslate = currentTranslate;
    section.classList.add("is-dragging");
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) {
      return;
    }
    const delta = e.clientX - dragStartX;
    applyTranslate(dragStartTranslate + delta, false);
  });

  document.addEventListener("mouseup", (e) => {
    if (!isDragging) {
      return;
    }
    isDragging = false;
    section.classList.remove("is-dragging");
    const delta = e.clientX - dragStartX;
    if (delta < -60) {
      goTo(currentVIdx + 1);
    } else if (delta > 60) {
      goTo(currentVIdx - 1);
    } else {
      goTo(currentVIdx);
    }
  });

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
    if (delta < -60) {
      goTo(currentVIdx + 1);
    } else if (delta > 60) {
      goTo(currentVIdx - 1);
    } else {
      goTo(currentVIdx);
    }
  });

  let lastPosition = window.innerWidth < 1024 ? "mobile" : "sub1";

  window.addEventListener("resize", () => {
    applyTranslate(getTranslateForIdx(currentVIdx), false);
    updateSlideStyles();

    const newPosition = window.innerWidth < 1024 ? "mobile" : "sub1";
    if (newPosition !== lastPosition) {
      lastPosition = newPosition;
      renderSlides(slideSets[newPosition]);
    }
  });
}

// ── 초기화 ────────────────────────────────────────────────────────
export async function initMainPage() {
  const headerAnchor = document.getElementById("header");
  const footerAnchor = document.getElementById("footer");
  if (headerAnchor) {
    headerAnchor.replaceWith(await renderHeader());
  }
  if (footerAnchor) {
    footerAnchor.replaceWith(await renderFooter());
  }
  document.body.append(renderLoginModal());

  const carouselPosition = window.innerWidth < 1024 ? "mobile" : "sub1";

  const [page1Data, page2Data, mobileSlides, desktopSlides] = await Promise.all(
    [
      fetchProducts({ page: 1, limit: 50 }),
      fetchProducts({ page: 2, limit: 50 }),
      fetchCarousels("mobile").catch(() => []),
      fetchCarousels("sub1").catch(() => []),
    ],
  );

  const slideSets = { mobile: mobileSlides, sub1: desktopSlides };

  [...slideSets.mobile, ...slideSets.sub1].forEach(({ imageUrl }) => {
    const img = new Image();
    img.src = imageUrl;
  });

  const allProducts = [
    ...(page1Data.products ?? []),
    ...(page2Data.products ?? []),
  ];

  const almondProducts = allProducts
    .filter((p) => p.name.includes("아몬드"))
    .map(toCardProps);

  const almondContainer = document.getElementById("almond-grid");

  setupProductTabs({
    navEl: document.getElementById("almond-tabs"),
    tabs: ["모두보기", "바디 케어", "핸드 케어", "리필"],
    allProducts: almondProducts,
    filterFn: almondFilter,
    onTabChange: (filtered) => renderProductCards(filtered, almondContainer),
  });

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

  initRotatingCarousel(slideSets[carouselPosition], slideSets);
}

checkTokenValidity();
initMainPage().catch((err) => console.error("초기화 실패:", err));
