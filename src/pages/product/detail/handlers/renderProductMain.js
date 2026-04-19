export function renderProductMain(product) {
  document.querySelector("#product-title").textContent = product.name;
  document.querySelector("#short-description").textContent =
    product.shortDescription;

  const priceEl = document.querySelector("#product-Price");
  const discountRateEl = document.querySelector("#product-discountRate");
  const discountPriceEl = document.querySelector("#product-discountPrice");

  if (product.discountPrice !== null && product.discountRate) {
    // 할인 있을 때
    priceEl.textContent = product.price.toLocaleString();
    discountRateEl.textContent = `${product.discountRate}%`;
    discountPriceEl.textContent = product.discountPrice.toLocaleString();
  } else {
    // 할인 없을 때
    priceEl.classList.add("hidden"); // 취소선 가격 숨김
    discountRateEl.classList.add("hidden"); // 할인율 숨김
    discountPriceEl.textContent = product.price.toLocaleString(); // 원가를 discountPrice 스타일로
  }

  document.querySelector("#product-review-count").textContent =
    product.reviewCount;

  // 데스크탑: 메인 이미지
  document.querySelector("#main-thumbnail img").src =
    product.images.representative;
  document.querySelector("#main-thumbnail img").alt =
    `${product.name} 메인 이미지`;

  // 데스크탑: 서브 이미지 그리드
  const subThumbnail = document.querySelector("#sub-thumbnail");
  subThumbnail.innerHTML = "";
  product.images.mainSlides.forEach((src) => {
    const li = document.createElement("li");
    li.className = "aspect-square overflow-hidden";

    const img = document.createElement("img");
    img.className = "bg-merino w-full h-full object-contain";
    img.src = src;
    img.alt = `${product.name} 서브 이미지`;

    li.append(img);
    subThumbnail.append(li);
  });

  // 모바일: 슬라이더
  const allImages = [
    product.images.representative,
    ...product.images.mainSlides,
  ];
  const track = document.querySelector("#slider-track");
  const dotsContainer = document.querySelector("#slider-dots");

  track.innerHTML = "";

  allImages.forEach((src, i) => {
    const slide = document.createElement("div");
    slide.className =
      "min-w-full flex-shrink-0 h-[420px] sm:h-[520px] flex items-center justify-center overflow-hidden";

    const img = document.createElement("img");
    img.className = "bg-merino w-full h-full object-contain";
    img.src = src;
    img.alt = `${product.name} 이미지 ${i + 1}`;

    slide.append(img);
    track.append(slide);
  });

  dotsContainer.innerHTML = "";
  allImages.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = `dot w-2 h-2 rounded-full ${i === 0 ? "bg-ferra" : "bg-stone-300"}`;
    dot.dataset.index = i;
    dot.type = "button";
    dot.setAttribute("aria-label", `${i + 1}번째 이미지로 이동`);
    dotsContainer.append(dot);
  });

  let current = 0;

  function goTo(index) {
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll(".dot").forEach((dot, i) => {
      dot.classList.toggle("bg-ferra", i === current);
      dot.classList.toggle("bg-stone-300", i !== current);
    });
  }

  //드래그 슬라이더
  const sliderWrapper = track.parentElement; // track을 감싸는 컨테이너

  let startX = 0;
  let isDragging = false;

  function onDragStart(x) {
    startX = x;
    isDragging = true;
    track.classList.remove(
      "transition-transform",
      "duration-300",
      "ease-in-out",
    );
  }

  function onDragEnd(x) {
    if (!isDragging) {
      return;
    }
    isDragging = false;

    const diff = startX - x;
    const threshold = sliderWrapper.offsetWidth * 0.2; // 너비의 20% 이상 드래그해야 넘김

    track.classList.add("transition-transform", "duration-300", "ease-in-out");

    if (diff > threshold) {
      // 왼쪽으로 드래그 → 다음 슬라이드
      goTo(current === allImages.length - 1 ? 0 : current + 1);
    } else if (diff < -threshold) {
      // 오른쪽으로 드래그 → 이전 슬라이드
      goTo(current === 0 ? allImages.length - 1 : current - 1);
    } else {
      // 기준 미달 → 제자리 복귀
      goTo(current);
    }
  }

  // 마우스 이벤트
  sliderWrapper.addEventListener("mousedown", (e) => onDragStart(e.clientX));
  sliderWrapper.addEventListener("mouseup", (e) => onDragEnd(e.clientX));
  sliderWrapper.addEventListener("mouseleave", (e) => onDragEnd(e.clientX)); // 영역 벗어나도 처리

  // 터치 이벤트
  sliderWrapper.addEventListener("touchstart", (e) =>
    onDragStart(e.touches[0].clientX),
  );
  sliderWrapper.addEventListener("touchend", (e) =>
    onDragEnd(e.changedTouches[0].clientX),
  );

  // 드래그 중 이미지 기본 드래그 방지
  track.querySelectorAll("img").forEach((img) => {
    img.addEventListener("dragstart", (e) => e.preventDefault());
  });

  document.querySelector("#slider-prev").addEventListener("click", () => {
    goTo(current === 0 ? allImages.length - 1 : current - 1);
  });
  document.querySelector("#slider-next").addEventListener("click", () => {
    goTo(current === allImages.length - 1 ? 0 : current + 1);
  });
  dotsContainer.querySelectorAll(".dot").forEach((dot) => {
    dot.addEventListener("click", () => goTo(Number(dot.dataset.index)));
  });
}
