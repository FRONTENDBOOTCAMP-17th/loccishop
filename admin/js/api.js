const BASE_URL = "https://api.fullstackfamily.com/api/loccishop/v1";

export function getToken() {
  return localStorage.getItem("adminToken");
}

export function setToken(token) {
  localStorage.setItem("adminToken", token);
}

export function removeToken() {
  localStorage.removeItem("adminToken");
}

export async function fetchAPI(path, options = {}) {
  const token = getToken();

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

  if (res.status === 401 || res.status === 403) {
    removeToken();
    window.location.href = "/admin";
    return;
  }

  const json = await res.json();
  if (!json.success) throw new Error(json.message ?? "서버 오류");
  return json.data ?? json;
}

export async function uploadImage(file) {
  const token = getToken();
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/admin/images`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const json = await res.json();
  if (!json.success) throw new Error("이미지 업로드 실패");
  return json.data.imageUrl;
}

export async function fetchAPIWithMeta(path, options = {}) {
  const token = getToken();

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

  if (res.status === 401 || res.status === 403) {
    removeToken();
    window.location.href = "/admin";
    return;
  }

  const json = await res.json();
  if (!json.success) throw new Error(json.message ?? "서버 오류");
  return { data: json.data, meta: json.meta };
}
