import { fetchAPI } from "/src/js/api/client.js";

export function loginUser(username, password) {
  return fetchAPI("/auth/login", {
    method: "POST",
    body: { username, password },
  });
}

export function checkId(username) {
  return fetchAPI(`/auth/check-id?username=${encodeURIComponent(username)}`);
}

export function signupUser(requestBody) {
  return fetchAPI("/auth/signup", {
    method: "POST",
    body: requestBody,
  });
}

export function signupAdmin(requestBody) {
  return fetchAPI("/auth/admin/signup", {
    method: "POST",
    body: requestBody,
  });
}
