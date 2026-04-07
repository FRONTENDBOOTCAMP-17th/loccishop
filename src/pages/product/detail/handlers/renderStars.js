export function renderStars(average, container, size = "") {
  const percent = (average / 5) * 100;
  const starImg = (src) =>
    `<img src="${src}" alt="" aria-hidden="true" ${size ? `class="${size}"` : ""} />`;

  container.innerHTML = `
    <div class="relative inline-flex">
      <div class="flex">
        ${starImg("/src/assets/icon/star-empty.svg").repeat(5)}
      </div>
      <div class="absolute inset-0 overflow-hidden flex" style="width: ${percent}%">
        ${starImg("/src/assets/icon/star.svg").repeat(5)}
      </div>
    </div>
  `;
  container.setAttribute("aria-label", `별점 5점 만점에 ${average}점`);
}
