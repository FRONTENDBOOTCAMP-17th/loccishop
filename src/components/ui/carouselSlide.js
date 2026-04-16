export function createCarouselSlide({ imageUrl, name }) {
  const el = document.createElement("div");
  el.className =
    "rotating-slide flex-shrink-0 select-none w-[min(450px,90vw)] md:w-[450px] lg:w-[914px] xl:w-[942px]";
  el.style.transition = "transform 0.45s ease, opacity 0.45s ease";

  const figure = document.createElement("figure");
  figure.className =
    "w-full aspect-[450/638] md:h-[638px] md:[aspect-ratio:auto] lg:h-[457px] xl:h-[471px] overflow-hidden shadow-sm bg-[#f4f1ea]";

  const img = document.createElement("img");
  img.src = imageUrl ?? "";
  img.alt = name ?? "";
  img.className =
    "w-full h-full object-contain md:object-cover pointer-events-none";
  img.draggable = false;

  figure.append(img);
  el.append(figure);
  return el;
}
