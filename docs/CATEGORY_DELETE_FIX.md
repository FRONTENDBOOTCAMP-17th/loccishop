# 카테고리 삭제 버그 수정 안내

## 문제

`DELETE /api/loccishop/v1/admin/categories/{id}` 호출 시 하위 카테고리가 없음에도 에러가 발생하던 문제.

원인: 해당 카테고리에 삭제된(HIDE) 상품이 남아있어 FK 제약 조건 위반이 발생했습니다.

## 수정 후 동작

| 상황 | 결과 |
|------|------|
| 하위 카테고리 있음 | 400 — "하위 카테고리가 있어 삭제할 수 없습니다." |
| 활성 상품 있음 (ON_SALE 등) | 400 — "해당 카테고리에 등록된 상품이 ��어 삭제할 수 없습니다." |
| 삭제된(HIDE) 상품만 있음 | **성공** — HIDE 상품과 관련 데이터를 자동 정리 후 카테고리 삭제 |
| 하위 카테고리도 상품도 없음 | **성공** — 즉시 삭제 |

---

## 사용법

```js
const token = localStorage.getItem("lcs-token");

async function deleteCategory(categoryId) {
  const response = await fetch(
    `https://api.fullstackfamily.com/api/loccishop/v1/admin/categories/${categoryId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  const result = await response.json();

  if (result.success) {
    console.log("카���고리 삭제 완료:", result.data.id);
    // 카테고리 목록 새로고침
  } else {
    // 에러 처리
    alert(result.message);
    // "하위 카테고리가 있어 삭제할 수 없습니다."
    // "해당 카테고리에 등록된 상품이 있어 삭제할 수 ���습니다."
  }
}
```

---

## API 문서 페이지

https://www.fullstackfamily.com/loccishop/api-docs
