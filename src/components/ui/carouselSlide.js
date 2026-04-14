export function createCarouselSlide({ imageUrl, name, desc }) {
  const el = document.createElement("div");
  el.className = "rotating-slide flex-shrink-0 select-none";
  el.style.width = "68vw";
  el.style.transition = "transform 0.45s ease, opacity 0.45s ease";
  el.innerHTML = `
    <div class="flex flex-col lg:flex-row lg:h-[480px] overflow-hidden shadow-sm mx-1">
      <figure class="w-full h-[260px] lg:w-1/2 lg:h-full flex-shrink-0 overflow-hidden">
        <img
          src="${imageUrl}"
          alt="${name}"
          class="w-full h-full object-cover pointer-events-none"
          draggable="false"
        />
      </figure>
      <div class="rotating-text w-full lg:w-1/2 lg:h-full bg-cararra flex flex-col items-center justify-center text-center px-10 gap-5 py-8 lg:py-0">
        <h2 class="text-[18px] md:text-[28px] font-medium text-woody-brown leading-snug whitespace-pre-line">${name}</h2>
        <p class="text-[14px] md:text-[16px] font-normal text-empress leading-5 whitespace-pre-line">${desc}</p>
        <a href="#" class="text-[14px] md:text-[16px] font-normal text-woody-brown tracking-[0.64px] border-b border-woody-brown pb-0.5 hover:opacity-60 transition-opacity">
          지금 쇼핑하기
        </a>
      </div>
    </div>
  `;
  return el;
}
