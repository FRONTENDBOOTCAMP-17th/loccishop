export const headerComponent = () => html`
  <header class="bg-header-footer shadow p-4 w-full h-16">
    <div
      class="header-inner h-full flex items-center justify-between max-inline-360 mx-auto"
    >
      <img
        src="/src/assets/icon/Hamburger.svg"
        alt=""
        class="hamburger-btn cursor-pointer"
      />
      <img src="/src/assets/logo/Loccitane.svg" alt="" class="" />
      <ul class="flex gap-4">
        <img src="/src/assets/icon/myPage.svg" alt="" />
        <img src="/src/assets/icon/Items.svg" alt="" />
      </ul>
    </div>
  </header>
`;
