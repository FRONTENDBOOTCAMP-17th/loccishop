import { fetchAPI } from "/src/js/api/client.js";

//배송지 목록 조회
export async function fetchAddresses() {
  return await fetchAPI(`/members/me/addresses`);
}

//배송지 등록
export async function addAddress(data) {
  return await fetchAPI(`/members/me/addresses`, {
    method: "POST",
    body: data,
  });
}

//배송지 수정
export async function updateAddress(addressId, data) {
  return await fetchAPI(`/members/me/addresses/${addressId}`, {
    method: "PUT",
    body: data,
  });
}

//배송지 삭제
export async function deleteAddress(addressId) {
  return await fetchAPI(`/members/me/addresses/${addressId}`, {
    method: "DELETE",
  });
}
