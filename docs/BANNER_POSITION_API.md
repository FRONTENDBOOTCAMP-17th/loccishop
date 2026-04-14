# 배너 position 필드 추가 안내

## 변경 요약

배너에 `position` 필드가 추가되어 메인/서브/모바일 위치별로 배너를 분리 관리할 수 있습니다.

### position 허용 값

| 값 | 설명 |
|-----|------|
| `main` | 메인 배너 (기본값) |
| `sub1` | 서브 배너 1 |
| `sub2` | 서브 배너 2 |
| `mobile` | 모바일 전용 배너 |

---

## 1. 배너 조회 — position 필터링

```
GET /api/loccishop/v1/banners                 → 전체 활성 배너
GET /api/loccishop/v1/banners?position=main   → 메인 배너만
GET /api/loccishop/v1/banners?position=sub1   → 서브1 배너만
GET /api/loccishop/v1/banners?position=mobile → 모바일 배너만
```

### JavaScript 코드

```js
// 메인 배너만 가져오기
async function getMainBanners() {
  const response = await fetch(
    "https://api.fullstackfamily.com/api/loccishop/v1/banners?position=main"
  );
  const result = await response.json();

  if (result.success) {
    result.data.banners.forEach(function (banner) {
      console.log(banner.title, banner.position, banner.imageUrl);
    });
  }
}

// 모바일 배너만 가져오기
async function getMobileBanners() {
  const response = await fetch(
    "https://api.fullstackfamily.com/api/loccishop/v1/banners?position=mobile"
  );
  const result = await response.json();
  return result.data.banners;
}
```

### 응답 예시

```json
{
  "success": true,
  "data": {
    "banners": [
      {
        "id": 12,
        "title": "봄 세일 이벤트",
        "description": "최대 30% 할인",
        "imageUrl": "https://example.com/banner.jpg",
        "linkUrl": "/products?badge=SALE",
        "sortOrder": 1,
        "position": "main",
        "startDate": "2026-04-14",
        "endDate": "2026-04-29"
      }
    ]
  }
}
```

---

## 2. 배너 등록 — position 지정

```js
const token = localStorage.getItem("lcs-token");

async function createBanner() {
  const response = await fetch(
    "https://api.fullstackfamily.com/api/loccishop/v1/admin/banners",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        title: "모바일 전용 배너",
        description: "모바일에서만 보이는 배너",
        imageUrl: "https://example.com/mobile-banner.jpg",
        linkUrl: "/products",
        position: "mobile",
        sortOrder: 1,
        isVisible: true,
        startDate: "2026-04-14",
        endDate: "2026-12-31",
      }),
    }
  );
  const result = await response.json();

  if (result.success) {
    console.log("배너 생성:", result.data.id);
  }
}
```

> `position`을 안 보내면 기본값 `"main"`이 적용됩니다.

---

## 3. 배너 수정 — position 변경

```js
async function updateBannerPosition(bannerId, newPosition) {
  const response = await fetch(
    `https://api.fullstackfamily.com/api/loccishop/v1/admin/banners/${bannerId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        position: newPosition, // "main", "sub1", "sub2", "mobile"
      }),
    }
  );
  const result = await response.json();

  if (result.success) {
    console.log("수정 완료:", result.data.id);
  }
}
```

---

## 에러 응답

| 상황 | 코드 | 메시지 |
|------|------|--------|
| 잘못된 position 값 | 400 | 유효하지 않은 position입니다. (main, sub1, sub2, mobile) |
| 인증 없음 | 401 | 인증이 필요합니다 |
| 관리자 아님 | 403 | 권한이 없습니다 |

---

## API 문서 페이지

https://www.fullstackfamily.com/loccishop/api-docs
