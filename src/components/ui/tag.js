const stateClass = {
  active: "bg-ferra text-spring-wood border border-ferra",
  default: "bg-spring-wood text-woody-brown border border-empress",
};

export function createTag({ text, state = "default" } = {}) {
  const tag = document.createElement("button");
  tag.textContent = text;

  tag.className = [
    "min-w-16 rounded px-2.5 py-1.5 text-sm text-center font-normal leading-5 cursor-pointer transition-colors duration-200",
    stateClass[state],
  ].join(" ");

  tag.setState = (newState) => {
    tag.classList.remove(...stateClass.active.split(" "));
    tag.classList.remove(...stateClass.default.split(" "));
    tag.classList.add(...stateClass[newState].split(" "));
  };

  return tag;
}
