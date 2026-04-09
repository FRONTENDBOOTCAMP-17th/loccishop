import { fetchAPI } from "/src/js/api/client.js";

//로그인
export function loginUser(username, password) {
  return fetchAPI("/auth/login", {
    method: "POST",
    body: { username, password },
  });
}

//아이디 중복확인
export function checkId(username) {
  return fetchAPI(`/auth/check-id?username=${encodeURIComponent(username)}`);
}

//회원가입
export function signupUser(requestBody) {
  return fetchAPI("/auth/signup", {
    method: "POST",
    body: requestBody,
  });
}

//관리자 회원가입
export function signupAdmin(requestBody) {
  return fetchAPI("/auth/admin/signup", {
    method: "POST",
    body: requestBody,
  });
}

//내정보 조회
export function fetchMe() {
  return fetchAPI("/members/me");
}
