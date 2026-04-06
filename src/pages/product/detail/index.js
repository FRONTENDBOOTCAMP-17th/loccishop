import { createButton } from "/src/components/ui/button.js";
import { createBadge } from "/src/components/ui/badge.js";
import { createProductCard } from "/src/components/ui/product-card.js";
import { createDrawer } from "/src/components/ui/drawer.js";

async function initProductPage() {
  const container = document.querySelector("#detail-main");
  if (!container) return;

  // detail-main 로드
  const res = await fetch(
    "/src/pages/product/detail/components/detail-main.html",
  );
  container.innerHTML = await res.text();

  //배지
  const badge = createBadge({ type: "NEW" });
  document.querySelector("#badge").replaceWith(badge);

  // 장바구니 추가 버튼 로드
  const cartBtn = createButton({
    text: "장바구니에 추가",
    variant: "primary",
    size: "md",
    fullWidth: true,
  });

  cartBtn.addEventListener("click", () => {
    console.log("장바구니 추가!");
  });

  document.querySelector("#cart-button").append(cartBtn);

  // detail-info 로드
  const infoRes = await fetch(
    "/src/pages/product/detail/components/detail-info.html",
  );
  document.querySelector("#product-info").innerHTML = await infoRes.text();

  // 드로어 초기화
  const usageDrawer = createDrawer({ title: "사용 방법", position: "right" });
  usageDrawer.content.innerHTML = "<p>사용 방법 내용</p>";
  document.querySelector("#howToUse").addEventListener("click", () => {
    usageDrawer.open();
  });

  const ingredientsDrawer = createDrawer({ title: "원료", position: "right" });
  ingredientsDrawer.content.innerHTML = "<p>원료 내용</p>";
  document.querySelector("#ingredients").addEventListener("click", () => {
    ingredientsDrawer.open();
  });

  const disclosureDrawer = createDrawer({
    title: "상품정보 제공고시",
    position: "right",
  });
  disclosureDrawer.content.innerHTML = "<p>상품정보 내용</p>";
  document.querySelector("#productDisclosure").addEventListener("click", () => {
    disclosureDrawer.open();
  });

  // best-reveiw 로드
  const bestRes = await fetch(
    "/src/pages/product/detail/components/detail-best-review.html",
  );
  document.querySelector("#product-best-review").innerHTML =
    await bestRes.text();
}

document.addEventListener("DOMContentLoaded", initProductPage);
