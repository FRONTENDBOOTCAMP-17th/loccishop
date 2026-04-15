export function setValid(field) {
  if (field.errorIcon) { field.errorIcon.style.display = "none"; }
  field.checkIcon.style.display = "block";
  if (field.errorMessage) { field.errorMessage.style.display = "none"; }
}

export function setError(field) {
  if (field.errorIcon) { field.errorIcon.style.display = "block"; }
  field.checkIcon.style.display = "none";
  if (field.errorMessage) { field.errorMessage.style.display = "block"; }
}

export function clearState(field) {
  if (field.errorIcon) { field.errorIcon.style.display = "none"; }
  field.checkIcon.style.display = "none";
  if (field.errorMessage) { field.errorMessage.style.display = "none"; }
}
