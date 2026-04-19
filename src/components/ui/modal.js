export function createModal({ title, content }) {
  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 z-[100] flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300";

  const container = document.createElement("div");
  container.className =
    "bg-white w-[90%] max-w-md rounded-lg shadow-xl transform scale-95 transition-transform duration-300 p-6";

  container.setAttribute("role", "dialog");
  container.setAttribute("aria-modal", "true");
  container.setAttribute("aria-label", title);

  const header = document.createElement("div");
  header.className = "flex justify-between items-center mb-4";

  const h2 = document.createElement("h2");
  h2.className = "text-xl font-bold";
  h2.textContent = title;

  const closeBtn = document.createElement("button");
  closeBtn.className = "text-2xl cursor-pointer";
  closeBtn.innerHTML = "\u00D7";
  closeBtn.setAttribute("aria-label", "닫기");

  header.append(h2, closeBtn);

  // 콘텐츠 영역
  const contentBody = document.createElement("div");
  if (typeof content === "string") {
    contentBody.textContent = content;
  } else {
    contentBody.append(content);
  }

  container.append(header, contentBody);
  overlay.append(container);

  let previousFocus = null;

  const close = () => {
    overlay.classList.add("opacity-0");
    container.classList.add("scale-95");
    setTimeout(() => overlay.remove(), 300);
    document.body.style.overflow = "";
    if (previousFocus) {
      previousFocus.focus();
    }
  };

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  overlay.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      close();
    }

    // 포커스 트랩: Tab 키가 모달 밖으로 나가지 못하게
    if (e.key === "Tab") {
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  const open = () => {
    previousFocus = document.activeElement;

    document.body.append(overlay);
    overlay.offsetHeight;
    overlay.classList.remove("opacity-0");
    container.classList.remove("scale-95");
    container.classList.add("scale-100");
    document.body.style.overflow = "hidden";

    const firstFocusable = container.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (firstFocusable) {
      firstFocusable.focus();
    }
  };
  return { open, close };
}
