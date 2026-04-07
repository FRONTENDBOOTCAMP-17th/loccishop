export function renderHeader() {
  const header = document.createElement("header");
  header.className = "bg-header-footer shadow p-4 w-full h-16";

  header.innerHTML = `
    <div class="header-inner h-full flex items-center justify-between max-inline-360 mx-auto">
      <img src="/src/assets/icon/Hamburger.svg" alt="" class="hamburger-btn cursor-pointer" />
      <img src="/src/assets/logo/Loccitane.svg" alt="" />
      <ul class="flex gap-4">
        <img src="/src/assets/icon/myPage.svg" alt="" />
        <img src="/src/assets/icon/heart-empty.svg" alt="" />
        <img src="/src/assets/icon/cart.svg" alt="" />
      </ul>
    </div>
  `;

  return header;
}
