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
    li.innerHTML = `<img class="bg-merino w-full h-full object-cover" src="${src}" alt="서브이미지" />`;
    subThumbnail.append(li);
  });

  // 모바일: 슬라이더
  const allImages = [
    product.images.representative,
    ...product.images.mainSlides,
  ];
  const track = document.querySelector("#slider-track");
  const dotsContainer = document.querySelector("#slider-dots");

  track.innerHTML = allImages
    .map(
      (src, i) => `
    <div class="min-w-full aspect-3/4 overflow-hidden flex-shrink-0">
      <img class="bg-merino w-full h-full object-cover" src="${src}" alt="${product.name} 이미지 ${i + 1}" />
    </div>
  `,
    )
    .join("");

  dotsContainer.innerHTML = allImages
    .map(
      (_, i) => `
    <button class="dot w-2 h-2 rounded-full ${i === 0 ? "bg-ferra" : "bg-stone-300"}" data-index="${i}"></button>
  `,
    )
    .join("");

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
