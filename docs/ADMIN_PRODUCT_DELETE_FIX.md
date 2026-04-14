# 관리자 상품 삭제 버그 수정 안내

## 문제

`DELETE /api/loccishop/v1/admin/products/{id}` 호출 후 삭제가 정상 처리되었지만,
`GET /api/loccishop/v1/admin/products` 에서 삭제한 상품이 계속 목록에 표시되던 문제가 수정되었습니다.

## 수정 후 동작

1. `DELETE /admin/products/{id}` 호출 → 상품이 soft delete 처리됨 (status: HIDE)
2. `GET /admin/products` 호출 → **삭제된 상품이 목록에서 제외됨**

---

## 사용법

### 상품 삭제

```js
const token = localStorage.getItem("lcs-token");

async function deleteProduct(productId) {
  const response = await fetch(
    `https://api.fullstackfamily.com/api/loccishop/v1/admin/products/${productId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  const result = await response.json();

  if (result.success) {
    console.log("삭제 완료:", result.data.id);
    // 상품 목록 새로고침
    loadProducts();
  }
}
```

### 삭제 후 상품 목록 조회

```js
async function loadProducts(page = 1, limit = 10) {
  const response = await fetch(
    `https://api.fullstackfamily.com/api/loccishop/v1/admin/products?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  const result = await response.json();

  if (result.success) {
    // 삭제된 상품은 자동으로 제외됩니다
    result.data.products.forEach(function (product) {
      console.log(product.id, product.name, product.status);
    });
  }
}
```

---

## API 문서 페이지

https://www.fullstackfamily.com/loccishop/api-docs
