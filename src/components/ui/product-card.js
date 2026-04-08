import { createBadge } from "/src/components/ui/badge.js";

export function createProductCard({
  image,
  imageAlt = "",
  badgeType = null,
  size,
  name,
  originalPrice,
  discountRate,
  discountPrice,
  isWished = false,
} = {}) {
  const card = document.createElement("article");
  card.className =
    "relative flex flex-col w-full bg-gradient-to-b from-grey-96 to-grey-94";

  const imageWrapper = document.createElement("div");
  imageWrapper.className =
    "relative w-full aspect-[4/5] flex-shrink-0 overflow-hidden bg-stone-100";

  const img = document.createElement("img");
  img.src = image;
  img.alt = imageAlt;
  img.className = "w-full h-full object-cover";

  if (badgeType) {
    const badge = createBadge({ type: badgeType });
    badge.className =
      "absolute top-2 left-2 flex flex-col items-center px-2 py-1 rounded-sm text-xs text-woody-brown bg-rose-white tracking-[0.48px] leading-4 z-[1]";
    imageWrapper.append(badge);
  }

  const wishBtn = document.createElement("button");
  wishBtn.className =
    "absolute top-2 right-3 flex justify-center items-center w-10 h-10 rounded-full bg-white-solid/56 cursor-pointer z-[1]";

  const heartIcon = document.createElement("img");
  heartIcon.src = isWished
    ? "/src/assets/icon/heart.svg"
    : "/src/assets/icon/heart-empty.svg";
  heartIcon.alt = isWished ? "찜 해제" : "찜하기";
  heartIcon.className = "w-4 h-4";

  const cartBtn = document.createElement("button");
  cartBtn.className =
    "absolute bottom-2 right-3 flex justify-center items-center w-8 h-8 rounded-full bg-white-solid/56 cursor-pointer z-[1]";

  const cartIcon = document.createElement("img");
  cartIcon.src = "/src/assets/icon/cart.svg";
  cartIcon.alt = "장바구니 추가";
  cartIcon.className = "w-4 h-4";

  cartBtn.append(cartIcon);
  wishBtn.append(heartIcon);
  imageWrapper.append(img, wishBtn, cartBtn);

  const infoWrapper = document.createElement("div");
  infoWrapper.className = "flex flex-col p-2";

  const sizeRow = document.createElement("div");
  sizeRow.className = "flex items-center h-8";

  const sizeText = document.createElement("span");
  sizeText.textContent = size;
  sizeText.className = "text-xs text-woody-brown leading-4";

  sizeRow.append(sizeText);

  const nameEl = document.createElement("p");
  nameEl.textContent = name;
  nameEl.className = "text-base text-woody-brown leading-5 line-clamp-2 h-10";

  const priceRow = document.createElement("div");
  priceRow.className = "flex justify-between items-center self-stretch h-8";

  const originalPriceEl = document.createElement("span");
  originalPriceEl.textContent = `${originalPrice.toLocaleString()}원`;
  originalPriceEl.className = "text-xs text-empress line-through";

  const discountWrapper = document.createElement("div");
  discountWrapper.className = "flex items-center gap-1";

  const discountRateEl = document.createElement("span");
  if (discountRate > 0) {
    discountRateEl.textContent = `${discountRate}%`;
    discountRateEl.className = "text-sm text-burnt-orange font-semibold";
    discountWrapper.append(discountRateEl);
  }

  const discountPriceEl = document.createElement("span");
  discountPriceEl.textContent = `${discountPrice.toLocaleString()}원`;
  discountPriceEl.className = "text-sm text-woody-brown";

  discountWrapper.append(discountPriceEl);
  priceRow.append(originalPriceEl, discountWrapper);

  infoWrapper.append(sizeRow, nameEl, priceRow);
  card.append(imageWrapper, infoWrapper);

  return card;
}
