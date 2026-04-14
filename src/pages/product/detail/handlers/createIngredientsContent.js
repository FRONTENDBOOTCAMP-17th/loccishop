export function createIngredientsContent(ingredients) {
  const wrapper = document.createElement("div");

  if (ingredients.keyIngredients?.length) {
    const ul = document.createElement("ul");
    ul.className = "mb-4";

    ingredients.keyIngredients.forEach((ing) => {
      const li = document.createElement("li");
      li.className = "mb-3";

      const name = document.createElement("strong");
      name.className = "text-sm font-semibold";
      name.textContent = ing.name; // ← textContent라 XSS 없음

      const desc = document.createElement("p");
      desc.className = "text-sm text-zambezi mt-1";
      desc.textContent = ing.description;

      li.append(name, desc);
      ul.append(li);
    });

    const hr = document.createElement("hr");
    hr.className = "mb-5 border-merino";

    wrapper.append(ul, hr);
  }

  const fullIngredients = document.createElement("p");
  fullIngredients.className = "whitespace-pre-wrap text-sm";
  fullIngredients.textContent = ingredients.fullIngredients;

  wrapper.append(fullIngredients);
  return wrapper;
}
