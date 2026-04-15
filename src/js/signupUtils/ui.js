export function setValid(field) {
  field.errorIcon?.classList.add("hidden");
  field.checkIcon.classList.remove("hidden");
  field.errorMessage?.classList.add("hidden");
}

export function setError(field) {
  field.errorIcon?.classList.remove("hidden");
  field.checkIcon.classList.add("hidden");
  field.errorMessage?.classList.remove("hidden");
}

export function clearState(field) {
  field.errorIcon?.classList.add("hidden");
  field.checkIcon.classList.add("hidden");
  field.errorMessage?.classList.add("hidden");
}

export function showOnlyErrorIcon(field) {
  field.errorIcon?.classList.remove("hidden");
  field.checkIcon.classList.add("hidden");
}
