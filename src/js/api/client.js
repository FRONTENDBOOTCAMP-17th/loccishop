const BASE_URL = "https://api.fullstackfamily.com/api/loccishop/v1";

export async function fetchAPI(path) {
  const res = await fetch(`${BASE_URL}${path}`);

  if (!res.ok) {
    throw new Error(`API 오류: ${res.status}`);
  }

  const json = await res.json();

  if (!json.success) {
    throw new Error("서버 오류가 발생했습니다.");
  }

  return json.data;
}
