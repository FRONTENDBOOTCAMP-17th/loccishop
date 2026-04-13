import { openLoginModal } from "/src/components/login-modal/loginModal.js";

const BASE_URL = "https://api.fullstackfamily.com/api/loccishop/v1";

export async function fetchAPI(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? "GET",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...(options.body && { body: JSON.stringify(options.body) }),
  });

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("token"); // 만료된 토큰 제거
      localStorage.removeItem("role");
      localStorage.removeItem("member");
      alert("로그인이 필요한 서비스입니다.");
      openLoginModal();
      return;
    }
    throw new Error(`API 오류: ${res.status}`);
  }

  const json = await res.json();

  if (!json.success) {
    throw new Error("서버 오류가 발생했습니다.");
  }

  return json.data;
}

// FormData 전용 (이미지 업로드)
export async function fetchAPIWithFormData(path, formData) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("token"); // 만료된 토큰 제거
      localStorage.removeItem("role");
      localStorage.removeItem("member");
      alert("로그인이 필요한 서비스입니다.");
      openLoginModal();
      return;
    }
    throw new Error(`API 오류: ${res.status}`);
  }
  const json = await res.json();
  if (!json.success) {
    throw new Error("서버 오류가 발생했습니다.");
  }
  return json.data;
}
