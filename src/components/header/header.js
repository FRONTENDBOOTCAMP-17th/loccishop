export function renderHeader() {
  const nav = document.createElement("nav");
  nav.className = "bg-spring-wood shadow p-4 w-full h-16";

  nav.innerHTML = `
    <div class="header-inner h-full flex items-center justify-between max-inline-360 mx-auto">
      <button type="button" class="hamburger-btn cursor-pointer" aria-label="메뉴 열기">
        <img src="/src/assets/icon/Hamburger.svg" alt="" aria-hidden="true" />
      </button>
      <a href="/">
        <img src="/src/assets/logo/Loccitane.svg" alt="L'Occitane 홈으로" />
      </a>
      <ul class="flex gap-4">
        <li><a href="#"><img src="/src/assets/icon/myPage.svg" alt="마이페이지" /></a></li>
        <li><a href="#"><img src="/src/assets/icon/heart-empty.svg" alt="위시리스트" /></a></li>
        <li><a href="#"><img src="/src/assets/icon/cart.svg" alt="장바구니" /></a></li>
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

  return nav;
}
