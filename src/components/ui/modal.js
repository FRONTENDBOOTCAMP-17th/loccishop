export function createModal({ title, content }) {
  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 z-[100] flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300";

  const container = document.createElement("div");
  container.className =
    "bg-white w-[90%] max-w-md rounded-lg shadow-xl transform scale-95 transition-transform duration-300 p-6";

  const header = document.createElement("div");
  header.className = "flex justify-between items-center mb-4";

  const h2 = document.createElement("h2");
  h2.className = "text-xl font-bold";
  h2.textContent = title;

  const closeBtn = document.createElement("button");
  closeBtn.className = "text-2xl cursor-pointer";
  closeBtn.innerHTML = "&times;";

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

  const close = () => {
    overlay.classList.add("opacity-0");
    container.classList.add("scale-95");
    setTimeout(() => overlay.remove(), 300);
    document.body.style.overflow = "auto";
  };

  const open = () => {
    document.body.append(overlay);
    overlay.offsetHeight;
    overlay.classList.remove("opacity-0");
    container.classList.remove("scale-95");
    container.classList.add("scale-100");
    document.body.style.overflow = "hidden";
  };

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      close();
    }
  });

  return { open, close };
}
