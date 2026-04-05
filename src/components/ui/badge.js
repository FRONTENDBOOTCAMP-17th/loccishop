const badgeClass = {
  NEW: "bg-cararra text-woody-brown",
  SALE: "bg-burnt-orange text-white",
  BEST: "bg-teal-green text-white",
};

export function createBadge({ type = "NEW" } = {}) {
  const badge = document.createElement("strong");
  badge.textContent = type;

  badge.className = [
    "text-xs px-2 py-1 rounded-sm uppercase",
    badgeClass[type],
  ].join(" ");

  return badge;
}
