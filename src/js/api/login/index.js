import { fetchAPI } from "/src/js/api/client.js";

export function loginUser(username, password) {
  return fetchAPI("/auth/login", {
    method: "POST",
    body: { username, password },
  });
}
