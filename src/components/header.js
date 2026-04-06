export const headerComponent = () => html`
  <header class="bg-header-footer shadow p-4 w-full h-16">
    <div
      class="header-inner h-full flex items-center justify-between max-inline-360 mx-auto"
    >
      <img src="/src/assets/icon/Hamburger.svg" alt="" />
      <img src="/src/assets/logo/Logo.svg" alt="" class="" />
      <ul class="flex gap-4">
        <img src="/src/assets/icon/Location.svg" alt="" />
        <img src="/src/assets/icon/FAQ.svg" alt="" />
        <img src="/src/assets/icon/myPage.svg" alt="" />
        <img src="/src/assets/icon/Items.svg" alt="" />
      </ul>
    </div>
  </header>
`;

// js 안엔 addeventlistener같이 눌렀을때 어디로 넘어가는지도 같이
