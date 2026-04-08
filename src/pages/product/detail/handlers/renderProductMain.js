export function renderProductMain(product) {
  document.querySelector("#product-title").textContent = product.name;
  document.querySelector("#short-description").textContent =
    product.shortDescription;
  document.querySelector("#product-Price").textContent =
    product.price.toLocaleString();
  document.querySelector("#product-discountRate").textContent =
    `${product.discountRate}%`;
  document.querySelector("#product-discountPrice").textContent =
    product.discountPrice.toLocaleString();
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
    img.className = "bg-merino w-full h-full object-cover";
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
    slide.className = "min-w-full aspect-3/4 overflow-hidden flex-shrink-0";

    const img = document.createElement("img");
    img.className = "bg-merino w-full h-full object-cover";
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
    document.querySelectorAll(".dot").forEach((dot, i) => {
      dot.classList.toggle("bg-ferra", i === current);
      dot.classList.toggle("bg-stone-300", i !== current);
    });
  }

  document.querySelector("#slider-prev").addEventListener("click", () => {
    goTo(current === 0 ? allImages.length - 1 : current - 1);
  });
  document.querySelector("#slider-next").addEventListener("click", () => {
    goTo(current === allImages.length - 1 ? 0 : current + 1);
  });
  document.querySelectorAll(".dot").forEach((dot) => {
    dot.addEventListener("click", () => goTo(Number(dot.dataset.index)));
  });
}
