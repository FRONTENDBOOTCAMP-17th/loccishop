import { createBadge } from "/src/components/ui/badge.js";

export function createProductCard({
  image,
  imageAlt = "",
  badgeType = null,
  badgeText = null,
  size,
  name,
  originalPrice,
  discountRate = null,
  discountPrice = null,
  isSelected = false,
  isWished = false,
  layout = "vertical",
} = {}) {
  //---------------가로형----------------
  if (layout === "horizontal") {
    const card = document.createElement("article");
    card.className = [
      "relative flex flex-row w-full max-w-[500px] lg:max-w-none min-h-[170px] h-full p-3 items-start gap-3 self-stretch mx-auto",
      "bg-rose-white rounded overflow-hidden cursor-pointer",
      isSelected
        ? "border border-woody-brown"
        : "outline-0 shadow-[0_0_6px_0_rgba(0,0,0,0.05)]",
    ].join(" ");

    const imageWrapper = document.createElement("div");
    imageWrapper.className =
      "w-[128px] h-full rounded flex-shrink-0 bg-gradient-to-b from-grey-96 to-grey-94 flex items-center justify-center overflow-hidden";

    const img = document.createElement("img");
    img.src = image;
    img.alt = imageAlt;
    img.className = "w-full h-full object-contain";
    imageWrapper.append(img);

    const infoWrapper = document.createElement("div");
    infoWrapper.className =
      "flex flex-col justify-between px-3 py-2 w-full h-full";

    const topWrapper = document.createElement("div");
    topWrapper.className = "flex flex-col gap-1";

    if (badgeText) {
      const badge = document.createElement("div");
      badge.textContent = badgeText;
      badge.className =
        "self-start text-3 leading-4 tracking-[.03rem] bg-cararra px-2 py-1 rounded-sm mb-1";
      topWrapper.append(badge);
    }

    const nameEl = document.createElement("p");
    nameEl.textContent = name;
    nameEl.className = "text-4 leading-5";

    const sizeText = document.createElement("span");
    sizeText.textContent = size;
    sizeText.className = "text-3 text-zambezi";

    const priceWrapper = document.createElement("div");
    priceWrapper.className = "flex flex-col";

    const discountRow = document.createElement("div");
    discountRow.className = "flex items-center gap-3";

    if (discountRate !== null && discountPrice !== null) {
      const originalPriceEl = document.createElement("span");
      originalPriceEl.textContent = `₩${originalPrice.toLocaleString()}`;
      originalPriceEl.className = "text-xs text-empress line-through";
      priceWrapper.append(originalPriceEl);

      const discountRateEl = document.createElement("span");
      discountRateEl.textContent = `${discountRate}%`;
      discountRateEl.className = "text-md text-burnt-orange font-semibold";
      discountRow.append(discountRateEl);

      const discountPriceEl = document.createElement("span");
      discountPriceEl.textContent = `₩${discountPrice.toLocaleString()}`;
      discountPriceEl.className = "text-lg text-woody-brown font-medium";
      discountRow.append(discountPriceEl);
    } else {
      const priceEl = document.createElement("span");
      priceEl.textContent = `₩${originalPrice.toLocaleString()}`;
      priceEl.className = "text-lg text-woody-brown font-medium";
      discountRow.append(priceEl);
    }

    priceWrapper.append(discountRow);
    topWrapper.append(nameEl, sizeText);
    infoWrapper.append(topWrapper, priceWrapper);

    const cartBtn = document.createElement("button");
    cartBtn.className =
      "absolute bottom-2 right-2 flex justify-center items-center w-7 h-7 rounded-full bg-cararra cursor-pointer";

    const cartIcon = document.createElement("img");
    cartIcon.src = "/src/assets/icon/cart.svg";
    cartIcon.alt = "장바구니 추가";
    cartIcon.className = "w-4 h-4";
    cartBtn.append(cartIcon);

    card.append(imageWrapper, infoWrapper, cartBtn);
    return card;
  }

  //---------------세로형----------------
  const card = document.createElement("article");
  card.className =
    "relative flex flex-col bg-gradient-to-b from-grey-96 to-grey-94 h-full";

  // 이미지 영역
  const imageWrapper = document.createElement("div");
  imageWrapper.className =
    "relative w-full aspect-3/4 flex-shrink-0 overflow-hidden";

  const img = document.createElement("img");
  img.src = image;
  img.alt = imageAlt;
  img.className = "w-full h-full object-cover";

  if (badgeType) {
    const badge = createBadge({ type: badgeType });
    badge.className =
      "absolute top-2 left-2 flex flex-col items-center px-2 py-1 rounded-sm text-xs text-woody-brown bg-rose-white tracking-[0.48px] leading-4";
    imageWrapper.append(badge);
  }

  const wishBtn = document.createElement("button");
  wishBtn.className =
    "absolute top-2 right-3 flex justify-center items-center w-10 h-10 rounded-full bg-white-solid/56 cursor-pointer";

  const heartIcon = document.createElement("img");
  heartIcon.src = isWished
    ? "/src/assets/icon/heart.svg"
    : "/src/assets/icon/heart-empty.svg";
  heartIcon.alt = isWished ? "찜 해제" : "찜하기";
  heartIcon.className = "w-4 h-4";

  const cartBtn = document.createElement("button");
  cartBtn.className =
    "absolute bottom-2 right-3 flex justify-center items-center w-8 h-8 rounded-full bg-white-solid/56 cursor-pointer";

  const cartIcon = document.createElement("img");
  cartIcon.src = "/src/assets/icon/cart.svg";
  cartIcon.alt = "장바구니 추가";
  cartIcon.className = "w-4 h-4";

  cartBtn.append(cartIcon);
  wishBtn.append(heartIcon);
  imageWrapper.append(img, wishBtn, cartBtn);

  // 텍스트 영역
  const infoWrapper = document.createElement("div");
  infoWrapper.className = "flex flex-col p-2 flex-1";

  const sizeRow = document.createElement("div");
  sizeRow.className = "flex items-center h-8";

  const sizeText = document.createElement("span");
  sizeText.textContent = size;
  sizeText.className = "text-xs text-woody-brown leading-4";
  sizeRow.append(sizeText);

  const nameEl = document.createElement("p");
  nameEl.textContent = name;
  nameEl.className =
    "text-base text-woody-brown leading-5 line-clamp-2 min-h-[40px]";

  const priceRow = document.createElement("div");
  priceRow.className = "flex justify-between items-center self-stretch h-8";

  const discountWrapper = document.createElement("div");
  discountWrapper.className = "flex items-center gap-1";

  if (discountRate !== null && discountPrice !== null) {
    const originalPriceEl = document.createElement("span");
    originalPriceEl.textContent = `${originalPrice.toLocaleString()}원`;
    originalPriceEl.className = "text-xs text-empress line-through";

    const discountRateEl = document.createElement("span");
    discountRateEl.textContent = `${discountRate}%`;
    discountRateEl.className = "text-sm text-burnt-orange font-semibold";

    const discountPriceEl = document.createElement("span");
    discountPriceEl.textContent = `${discountPrice.toLocaleString()}원`;
    discountPriceEl.className = "text-sm text-woody-brown font-bold";

    discountWrapper.append(discountRateEl, discountPriceEl);
    priceRow.append(originalPriceEl, discountWrapper);
  } else {
    const priceEl = document.createElement("span");
    priceEl.textContent = `${originalPrice.toLocaleString()}원`;
    priceEl.className = "text-sm text-woody-brown font-bold";
    discountWrapper.classList.add("ml-auto");
    discountWrapper.append(priceEl);
    priceRow.append(discountWrapper);
  }

  infoWrapper.append(sizeRow, nameEl, priceRow);
  card.append(imageWrapper, infoWrapper);

  return card;
}
