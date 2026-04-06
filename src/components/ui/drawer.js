export function createDrawer({ title, position = "right" } = {}) {
  // 오버레이
  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 bg-black/30 backdrop-blur-sm  z-40 opacity-0 transition-opacity duration-300";

  // 드로어
  const drawer = document.createElement("div");
  drawer.className = [
    "fixed top-0 z-50 flex flex-col w-80 h-full bg-spring-wood transition-transform duration-300",
    position === "left"
      ? "left-0 -translate-x-full"
      : "right-0 translate-x-full",
  ].join(" ");

  // 헤더
  const header = document.createElement("div");
  header.className =
    "flex items-center justify-between px-4 py-3 border-b border-empress/30";

  const titleEl = document.createElement("h2");
  titleEl.textContent = title;
  titleEl.className = "text-sm font-medium text-woody-brown";

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✕";
  closeBtn.className =
    "text-sm text-empress cursor-pointer hover:text-woody-brown transition-colors duration-200";

  header.append(titleEl, closeBtn);

  // 콘텐츠 영역
  const content = document.createElement("div");
  content.className = "flex-1 overflow-y-auto p-4";

  drawer.append(header, content);

  // 열기
  function open() {
    document.body.append(overlay, drawer);

    // 애니메이션을 위해 다음 프레임에서 클래스 변경
    requestAnimationFrame(() => {
      overlay.classList.replace("opacity-0", "opacity-100");
      drawer.classList.replace(
        position === "left" ? "-translate-x-full" : "translate-x-full",
        "translate-x-0",
      );
    });

    document.body.style.overflow = "hidden";
  }

  // 닫기
  function close() {
    overlay.classList.replace("opacity-100", "opacity-0");
    drawer.classList.replace(
      "translate-x-0",
      position === "left" ? "-translate-x-full" : "translate-x-full",
    );

    // 애니메이션 끝나고 DOM에서 제거
    setTimeout(() => {
      overlay.remove();
      drawer.remove();
      document.body.style.overflow = "";
    }, 300);
  }

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", close);

  return { open, close, content };
}
