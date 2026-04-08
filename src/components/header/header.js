export function renderHeader() {
  const header = document.createElement("header");
  header.className =
    "fixed top-0 left-0 z-50 bg-header-footer shadow p-4 w-full h-16"; // 상단 고정을 위해 fixed 추가

  header.innerHTML = `
    <div class="header-inner h-full flex items-center justify-between max-inline-360 mx-auto">
      <img src="/src/assets/icon/Hamburger.svg" alt="메뉴 열기" id="menu-open" class="hamburger-btn cursor-pointer" />
      <img src="/src/assets/logo/Loccitane.svg" alt="로고" />
      <ul class="flex gap-4">
        <img src="/src/assets/icon/myPage.svg" alt="마이페이지" />
        <img src="/src/assets/icon/heart-empty.svg" alt="위시리스트" />
        <img src="/src/assets/icon/cart.svg" alt="장바구니" />
      </ul>
    </div>

    <div id="drawer" class="fixed inset-0 z-[60] translate-x-full transition-transform duration-300 ease-in-out">
      <div id="drawer-overlay" class="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 pointer-events-none"></div>
      
      <nav class="relative w-80 h-full bg-white ml-auto shadow-2xl p-6">
        <div class="flex justify-end mb-8">
          <button id="menu-close" class="text-2xl">✕</button>
        </div>
        <ul class="space-y-6 text-lg font-bold text-gray-800">
          <li><a href="#" class="hover:text-woody-brown">베스트셀러</a></li>
          <li><a href="#" class="hover:text-woody-brown">기프트</a></li>
          <li><a href="#" class="hover:text-woody-brown">바디 케어</a></li>
          <li><a href="#" class="hover:text-woody-brown">브랜드 스토리</a></li>
        </ul>
      </nav>
    </div>
  `;

  return header;
}
