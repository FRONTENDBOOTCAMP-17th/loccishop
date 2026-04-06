const variantClass = {
  primary:
    "min-w-16 rounded bg-woody-brown border border-transparent text-white hover:bg-dark-woody",
  outline: "border border-empress rounded-sm text-woody-brown hover:bg-merino",
};

const sizeClass = {
  sm: "px-4 py-2.5 text-sm", //옵션 버튼 기준
  md: "py-4 text-sm", //장바구니추가 버튼 기준
};

export function createButton({
  text,
  variant = "primary",
  size = "md",
  fullWidth = false,
} = {}) {
  const button = document.createElement("button");
  button.textContent = text;

  button.className = [
    "cursor-pointer transition-colors duration-200",
    variantClass[variant],
    sizeClass[size],
    fullWidth ? "w-full" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return button;
}
