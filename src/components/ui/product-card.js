import { createBadge } from "/src/components/ui/badge.js";

export function createProductCard({
  image,
  imageAlt = "",
  badgeType = null,
  badgeText = null, // 가로형에서 "1 단계" 같은 텍스트 배지
  size,
  name,
  originalPrice,
  discountRate = null,
  isSelected = false, // 가로형 - 현재 선택된 상품
  isWished = false,
  layout = "vertical", //"vertical" | "horizontal"
} = {}) {
  const discountPrice = Math.floor(originalPrice * (1 - discountRate / 100));

  //---------------가로형----------------
  if (layout === "horizontal") {
    const card = document.createElement("article");
    card.className = [
      "relative flex flex-row w-[420px] min-h-[170px] h-full p-3 items-start gap-3 self-stretch grow shrink-0 basis-0",
      "bg-rose-white rounded overflow-hidden cursor-pointer ",
      isSelected
        ? "border border-woody-brown"
        : "outline-0 shadow-[0_0_6px_0_rgba(0,0,0,0.05)]",
    ].join(" ");

    //이미지 영역
    const imageWrapper = document.createElement("div");
    imageWrapper.className =
      " w-[128px] h-full rounded flex-shrink-0 bg-gradient-to-b from-grey-96 to-grey-94 flex items-center justify-center overflow-hidden";

    const img = document.createElement("img");
    img.src = image;
    img.alt = imageAlt;
    img.className = "w-full h-full object-contain";

    imageWrapper.append(img);

    // 텍스트 영역
    const infoWrapper = document.createElement("div");
    infoWrapper.className =
      "flex flex-col justify-between px-3 py-2 w-full h-full";

    const topWrapper = document.createElement("div");
    topWrapper.className = "flex flex-col gap-1";

    //단계 배지
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

    // 가격 영역 wrapper
    const priceWrapper = document.createElement("div");
    priceWrapper.className = "flex flex-col";

    // 상시가
    const originalPriceEl = document.createElement("span");
    originalPriceEl.textContent = `₩${originalPrice.toLocaleString()}`;
    originalPriceEl.className = "text-xs text-empress line-through";

    // 할인율 + 할인가
    const discountRow = document.createElement("div");
    discountRow.className = "flex items-center gap-3";

    if (discountRate) {
      const discountRateEl = document.createElement("span");
      discountRateEl.textContent = `${discountRate}%`;
      discountRateEl.className = "text-md text-burnt-orange font-semibold";
      discountRow.append(discountRateEl);
    }

    const discountPriceEl = document.createElement("span");
    discountPriceEl.textContent = `₩${(discountPrice ?? originalPrice).toLocaleString()}`;
    discountPriceEl.className = "text-lg text-woody-brown font-medium";
    discountRow.append(discountPriceEl);

    priceWrapper.append(originalPriceEl, discountRow);
    topWrapper.append(nameEl, sizeText);
    infoWrapper.append(topWrapper, priceWrapper);

    // 장바구니 버튼 (우측 하단 절대 위치)
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
    "relative flex flex-col w-[312px] bg-gradient-to-b from-grey-96 to-grey-94";

  // 이미지 영역
  const imageWrapper = document.createElement("div");
  imageWrapper.className =
    "relative w-[312px] h-[390px] flex-shrink-0 overflow-hidden";

  const img = document.createElement("img");
  img.src = image;
  img.alt = imageAlt;
  img.className = "w-full h-full object-cover";

  // 배지
  if (badgeType) {
    const badge = createBadge({ type: badgeType });
    badge.className =
      "absolute top-2 left-2 flex flex-col items-center px-2 py-1 rounded-sm text-xs text-woody-brown bg-rose-white tracking-[0.48px] leading-4";
    imageWrapper.append(badge);
  }

  // 찜 버튼 — 이미지 우측 상단
  const wishBtn = document.createElement("button");
  wishBtn.className =
    "absolute top-2 right-3 flex justify-center items-center w-10 h-10 rounded-full bg-white-solid/56 cursor-pointer";

  const heartIcon = document.createElement("img");
  heartIcon.src = isWished
    ? "/src/assets/icon/heart.svg"
    : "/src/assets/icon/heart-empty.svg";
  heartIcon.alt = isWished ? "찜 해제" : "찜하기";
  heartIcon.className = "w-4 h-4";

  // 장바구니 버튼 — 이미지 우측 하단
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
  infoWrapper.className = "flex flex-col p-2";

  // 용량 행
  const sizeRow = document.createElement("div");
  sizeRow.className = "flex items-center h-8";

  const sizeText = document.createElement("span");
  sizeText.textContent = size;
  sizeText.className = "text-xs text-woody-brown leading-4";

  sizeRow.append(sizeText);

  // 상품명
  const nameEl = document.createElement("p");
  nameEl.textContent = name;
  nameEl.className = "text-base text-woody-brown leading-5";

  // 가격 영역
  const priceRow = document.createElement("div");
  priceRow.className = "flex justify-between items-center self-stretch h-8";

  const originalPriceEl = document.createElement("span");
  originalPriceEl.textContent = `${originalPrice.toLocaleString()}원`;
  originalPriceEl.className = "text-xs text-empress line-through";

  const discountWrapper = document.createElement("div");
  discountWrapper.className = "flex items-center gap-1";

  const discountRateEl = document.createElement("span");
  discountRateEl.textContent = `${discountRate}%`;
  discountRateEl.className = "text-sm text-burnt-orange font-semibold";

  const discountPriceEl = document.createElement("span");
  discountPriceEl.textContent = `${discountPrice.toLocaleString()}원`;
  discountPriceEl.className = "text-sm text-woody-brown";

  discountWrapper.append(discountRateEl, discountPriceEl);
  priceRow.append(originalPriceEl, discountWrapper);

  infoWrapper.append(sizeRow, nameEl, priceRow);
  card.append(imageWrapper, infoWrapper);

  return card;
}
