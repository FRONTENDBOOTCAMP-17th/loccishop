export function setValid(errorIcon, checkIcon, errorText) {
  if (errorIcon) errorIcon.style.display = "none";
  checkIcon.style.display = "block";
  if (errorText) errorText.style.display = "none";
}

export function setError(errorIcon, checkIcon, errorText) {
  if (errorIcon) errorIcon.style.display = "block";
  checkIcon.style.display = "none";
  if (errorText) errorText.style.display = "block";
}

export function clearState(errorIcon, checkIcon, errorText) {
  if (errorIcon) errorIcon.style.display = "none";
  checkIcon.style.display = "none";
  if (errorText) errorText.style.display = "none";
}
