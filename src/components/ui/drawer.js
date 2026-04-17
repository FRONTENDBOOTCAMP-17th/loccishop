export function createDrawer({
  title,
  position = "right",
  width = "w-80",
} = {}) {
  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 bg-black/30 backdrop-blur-sm z-40 opacity-0 transition-opacity duration-300";

  const isMobile = window.innerWidth < 768;

  const drawer = document.createElement("div");

  if (isMobile) {
    drawer.className =
      "fixed bottom-0 left-0 right-0 w-full z-50 flex flex-col h-[75vh] bg-spring-wood transition-transform duration-300 translate-y-full rounded-t-2xl overflow-hidden";
  } else {
    // 데스크탑: 기존 오른쪽/왼쪽 드로어
    drawer.className = [
      `fixed top-0 z-50 flex flex-col ${width} h-full bg-spring-wood transition-transform duration-300`,
      position === "left"
        ? "left-0 -translate-x-full"
        : "right-0 translate-x-full",
    ].join(" ");
  }

  // 헤더
  const header = document.createElement("div");
  header.className =
    "flex items-center justify-between px-4 py-3 border-b border-empress/30 h-16";

  const titleEl = document.createElement("h2");
  titleEl.textContent = title;
  titleEl.className = "text-sm font-medium text-woody-brown";

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✕";
  closeBtn.className =
    "text-sm text-empress cursor-pointer hover:text-woody-brown transition-colors duration-200";

  header.append(titleEl, closeBtn);

  const content = document.createElement("div");
  content.className = "flex-1 overflow-y-auto overflow-x-hidden px-4 py-8 ";

  drawer.append(header, content);

  function open() {
    document.body.append(overlay, drawer);

    requestAnimationFrame(() => {
      overlay.classList.replace("opacity-0", "opacity-100");

      if (isMobile) {
        drawer.classList.replace("translate-y-full", "translate-y-0");
      } else {
        drawer.classList.replace(
          position === "left" ? "-translate-x-full" : "translate-x-full",
          "translate-x-0",
        );
      }
    });

    document.documentElement.style.overflow = "hidden";
  }

  function close() {
    overlay.classList.replace("opacity-100", "opacity-0");

    if (isMobile) {
      drawer.classList.replace("translate-y-0", "translate-y-full");
    } else {
      drawer.classList.replace(
        "translate-x-0",
        position === "left" ? "-translate-x-full" : "translate-x-full",
      );
    }

    setTimeout(() => {
      overlay.remove();
      drawer.remove();
      document.documentElement.style.overflow = "";
    }, 300);
  }

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", close);

  return { open, close, content, titleEl };
}
