export function createCategoryCard({ href = "/", image, alt, label, liClass = "" }) {
  const li = document.createElement("li");
  if (liClass) li.className = liClass;

  const a = document.createElement("a");
  a.href = href;
  a.className = "flex flex-col gap-3 group w-full";

  const imgWrapper = document.createElement("div");
  imgWrapper.className = "overflow-hidden";

  const img = document.createElement("img");
  img.src = image;
  img.alt = alt;
  img.className =
    "h-[344px] w-full object-cover shrink-0 group-hover:scale-105 transition-transform duration-500";

  imgWrapper.append(img);

  const labelDiv = document.createElement("div");
  labelDiv.className = "flex items-center gap-1";

  const span = document.createElement("span");
  span.className =
    "text-[16px] font-normal leading-[22px] group-hover:underline text-woody-brown";
  span.textContent = label;

  const arrowImg = document.createElement("img");
  arrowImg.src = "/src/assets/icon/product-list-arrow.svg";
  arrowImg.alt = label;
  arrowImg.className = "w-2 h-2";

  labelDiv.append(span, arrowImg);
  a.append(imgWrapper, labelDiv);
  li.append(a);

  return li;
}
