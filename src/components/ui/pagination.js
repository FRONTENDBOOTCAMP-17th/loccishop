export function createPagination({
  totalPages,
  currentPage = 1,
  onPageChange,
}) {
  const nav = document.createElement("nav");
  nav.className = "flex items-center gap-1 mt-6";
  nav.setAttribute("aria-label", "페이지 네비게이션");

  function render(activePage) {
    nav.innerHTML = "";

    // 이전 버튼
    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.textContent = "<";
    prevBtn.className =
      "w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-sm hover:bg-zambezi hover:text-rose-white disabled:opacity-30 disabled:cursor-not-allowed";
    prevBtn.disabled = activePage === 1;
    prevBtn.addEventListener("click", () => {
      if (activePage > 1) {
        render(activePage - 1);
        onPageChange(activePage - 1);
      }
    });
    nav.append(prevBtn);

    // 페이지 번호 버튼
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement("button");
      pageBtn.type = "button";
      pageBtn.textContent = i;
      pageBtn.className = `w-8 h-8 flex items-center justify-center rounded text-sm font-medium
        ${i === activePage ? "bg-zambezi text-rose-white" : "border border-gray-300 hover:bg-gray-100"}`;
      pageBtn.addEventListener("click", () => {
        render(i);
        onPageChange(i);
      });
      nav.append(pageBtn);
    }

    // 다음 버튼
    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.textContent = ">";
    nextBtn.className =
      "w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-sm hover:bg-zambezi hover:text-rose-white disabled:opacity-30 disabled:cursor-not-allowed";
    nextBtn.disabled = activePage === totalPages;
    nextBtn.addEventListener("click", () => {
      if (activePage < totalPages) {
        render(activePage + 1);
        onPageChange(activePage + 1);
      }
    });
    nav.append(nextBtn);
  }

  render(currentPage);
  return nav;
}
