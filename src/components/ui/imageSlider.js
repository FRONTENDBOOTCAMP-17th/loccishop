export function createImageSlider(items) {
  const container = document.createElement("div");
  container.className = "flex flex-col";

  const wrapper = document.createElement("div");
  wrapper.className = "relative overflow-hidden w-full";

  const track = document.createElement("div");
  track.className = "flex transition-transform duration-300 ease-in-out";

  items.forEach((item) => {
    const slide = document.createElement("div");
    slide.className = "min-w-full flex flex-col items-center gap-3 px-4 py-4";

    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.alt;
    img.className = "w-40 h-40 object-cover rounded-md bg-merino";

    const name = document.createElement("p");
    name.className = "text-sm font-medium text-center";
    name.textContent = item.name;

    // 가격 영역 - 할인가 있으면 할인가 표시
    const priceWrapper = document.createElement("div");
    priceWrapper.className = "flex items-center gap-2 text-sm text-center";

    if (item.discountRate > 0) {
      const originalPrice = document.createElement("span");
      originalPrice.className = "text-zambezi line-through text-xs";
      originalPrice.textContent = `₩${item.price.toLocaleString()}`;

      const discountPrice = document.createElement("span");
      discountPrice.className = "font-bold text-woody-brown";
      discountPrice.textContent = `₩${item.discountPrice.toLocaleString()}`;

      priceWrapper.append(originalPrice, discountPrice);
    } else {
      const price = document.createElement("span");
      price.className = "text-zambezi";
      price.textContent = `${item.option ? item.option + " · " : ""}₩${item.price.toLocaleString()}`;
      priceWrapper.append(price);
    }

    slide.append(img, name, priceWrapper);
    track.append(slide);
  });

  // 이전/다음 버튼
  const prevBtn = document.createElement("button");
  prevBtn.type = "button";
  prevBtn.className =
    "absolute left-2 top-1/3 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/80 rounded-full shadow";
  prevBtn.textContent = "‹";

  const nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.className =
    "absolute right-2 top-1/3 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/80 rounded-full shadow";
  nextBtn.textContent = "›";

  // 도트
  const dotsContainer = document.createElement("div");
  dotsContainer.className = "flex justify-center gap-2 py-2";

  items.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = `w-2 h-2 rounded-full ${i === 0 ? "bg-ferra" : "bg-stone-300"}`;
    dot.setAttribute("aria-label", `${i + 1}번째 슬라이드`);
    dotsContainer.append(dot);
  });

  wrapper.append(track, prevBtn, nextBtn);
  container.append(wrapper, dotsContainer);

  let current = 0;

  function goTo(index) {
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll("button").forEach((dot, i) => {
      dot.classList.toggle("bg-ferra", i === current);
      dot.classList.toggle("bg-stone-300", i !== current);
    });
  }

  prevBtn.addEventListener("click", () =>
    goTo(current === 0 ? items.length - 1 : current - 1),
  );
  nextBtn.addEventListener("click", () =>
    goTo(current === items.length - 1 ? 0 : current + 1),
  );
  dotsContainer.querySelectorAll("button").forEach((dot, i) => {
    dot.addEventListener("click", () => goTo(i));
  });

  if (items.length <= 1) {
    prevBtn.classList.add("hidden");
    nextBtn.classList.add("hidden");
    dotsContainer.classList.add("hidden");
  }

  return container;
}
