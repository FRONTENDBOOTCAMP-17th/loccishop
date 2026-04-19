import { renderHeader } from "/src/components/header/header.js";
import { renderFooter } from "/src/components/footer/footer.js";
import { renderLoginModal } from "/src/components/login-modal/loginModal.js";

const headerAnchor = document.getElementById("header");
const footerAnchor = document.getElementById("footer");
if (headerAnchor) {
  headerAnchor.replaceWith(await renderHeader());
}
if (footerAnchor) {
  footerAnchor.replaceWith(await renderFooter());
}
document.body.append(renderLoginModal());
