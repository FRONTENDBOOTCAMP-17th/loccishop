import { fetchMe } from "/src/js/api/auth/index.js";

export function checkTokenValidity() {
  if (localStorage.getItem("token")) {
    fetchMe().catch(() => {});
  }
}
