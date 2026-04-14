# 상품 옵션(변형) 관리 가이드

## 이미 지원됩니다!

상품 옵션(30ml, 75ml 등)은 별도의 `options` 필드 없이 **`groupId`와 `label`** 조합으로 관리됩니다.
같은 `groupId`를 가진 상품들이 자동으로 옵션으로 묶여서 상세 페이지에 표시됩니다.

---

## 동작 원리

```
상품 A (id: 133, groupId: "shea-hand", label: "30ml")
상품 B (id: 134, groupId: "shea-hand", label: "75ml")
                     ↓ 같은 groupId!
GET /products/133 응답의 options:
[
  { "id": 133, "label": "30ml", "isCurrent": true },
  { "id": 134, "label": "75ml", "isCurrent": false }
]
```

---

## 1. 어드민에서 옵션 상품 등록하기

같은 `groupId`를 넣어서 상품을 등록하면 자동으로 옵션이 연결됩니다.

```js
const token = localStorage.getItem("lcs-token");
const BASE = "https://api.fullstackfamily.com/api/loccishop/v1";

// 상품 A 등록 (30ml)
await fetch(BASE + "/admin/products", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  },
  body: JSON.stringify({
    groupId: "shea-hand",           // ← 옵션 그룹 ID (자유롭게 정하면 됩니다)
    label: "30ml",                  // ← 옵션 표시명
    categoryId: 9,
    name: "시어 버터 핸드크림 30ml",
    price: 17000,
    stock: 100,
    status: "ON_SALE",
  }),
});

// 상품 B 등록 (75ml) — 같은 groupId!
await fetch(BASE + "/admin/products", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  },
  body: JSON.stringify({
    groupId: "shea-hand",           // ← 같은 groupId!
    label: "75ml",                  // ← 다른 label
    categoryId: 9,
    name: "시어 버터 핸드크림 75ml",
    price: 29000,
    stock: 50,
    status: "ON_SALE",
  }),
});

// → 이제 두 상품이 자동으로 옵션으로 연결됩니다!
```

---

## 2. 기존 상품에 옵션 그룹 지정하기

이미 등록된 상품에 `groupId`를 수정하면 옵션 그룹에 추가할 수 있습니다.

```js
// 상품 13번에 groupId 지정
await fetch(BASE + "/admin/products/13", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  },
  body: JSON.stringify({
    groupId: "shea-hand",
    label: "30ml",
  }),
});

// 상품 18번에 같은 groupId 지정
await fetch(BASE + "/admin/products/18", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  },
  body: JSON.stringify({
    groupId: "shea-hand",
    label: "75ml",
  }),
});
```

---

## 3. 프론트엔드에서 옵션 표시하기

상품 상세 조회 응답에 `options` 배열이 자동으로 포함됩니다.

```js
async function loadProductDetail(productId) {
  const response = await fetch(BASE + "/products/" + productId);
  const result = await response.json();

  if (result.success) {
    const product = result.data;

    // 옵션이 있으면 렌더링
    if (product.options && product.options.length > 0) {
      product.options.forEach(function (option) {
        console.log(option.label);     // "30ml", "75ml"
        console.log(option.id);        // 상품 ID (페이지 이동용)
        console.log(option.isCurrent); // 현재 보고 있는 상품인지
      });
    }
  }
}
```

### 옵션 응답 예시

```json
{
  "success": true,
  "data": {
    "id": 133,
    "name": "시어 버터 핸드크림 30ml",
    "price": 17000,
    "options": [
      {
        "id": 133,
        "label": "30ml",
        "url": "/product/detail/133",
        "isCurrent": true
      },
      {
        "id": 134,
        "label": "75ml",
        "url": "/product/detail/134",
        "isCurrent": false
      }
    ]
  }
}
```

---

## 4. 옵션 UI 구현 예시

```js
// 옵션 버튼 렌더링
function renderOptions(options, containerId) {
  const container = document.getElementById(containerId);

  options.forEach(function (option) {
    const button = document.createElement("button");
    button.textContent = option.label;

    if (option.isCurrent) {
      // 현재 선택된 옵션 스타일
      button.className = "px-4 py-2 border-2 border-black bg-black text-white rounded";
    } else {
      // 다른 옵션 스타일 + 클릭 시 이동
      button.className = "px-4 py-2 border border-gray-300 rounded hover:border-black";
      button.addEventListener("click", function () {
        window.location.href = "/product/detail/" + option.id;
      });
    }

    container.appendChild(button);
  });
}
```

---

## 요약

| 항목 | 값 |
|------|-----|
| 옵션 연결 방법 | 같은 `groupId`를 가진 상품 → 자동 연결 |
| 옵션 표시명 | `label` 필드 (예: "30ml", "75ml") |
| 등록 API | `POST /admin/products` (body에 `groupId`, `label` 포함) |
| 수정 API | `PATCH /admin/products/{id}` (body에 `groupId`, `label` 포함) |
| 조회 응답 | `GET /products/{id}` → `options` 배열 자동 포함 |

---

## API 문서 페이지

https://www.fullstackfamily.com/loccishop/api-docs
