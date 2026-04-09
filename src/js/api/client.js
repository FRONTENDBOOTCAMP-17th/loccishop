const BASE_URL = "https://api.fullstackfamily.com/api/loccishop/v1";

export async function fetchAPI(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? "GET",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }), // ← 토큰 추가
      ...options.headers,
    },
    ...(options.body && { body: JSON.stringify(options.body) }),
  });

  if (!res.ok) {
    throw new Error(`API 오류: ${res.status}`);
  }

  const json = await res.json();

  if (!json.success) {
    throw new Error("서버 오류가 발생했습니다.");
  }

  return json.data;
}
