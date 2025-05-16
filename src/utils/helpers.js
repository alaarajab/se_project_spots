export function setButtonText(btn, isLoading, defaultText, loadingText) {
  btn.textContent = isLoading ? loadingText : defaultText;
}
