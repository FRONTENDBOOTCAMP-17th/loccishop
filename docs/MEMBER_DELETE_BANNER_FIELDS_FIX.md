# 회원 삭제 + 배너 응답 필드 버그 수정 안내

## 수정 1: 회원 삭제 후 목록에서 제외

### 문제
`DELETE /admin/members/{id}` 호출 시 성공 응답이 반환되었지만, `GET /admin/members`에서 삭제한 회원이 계속 표시되던 문제.

### 수정 후
삭제된 회원은 관리자 회원 목록에서 **즉시 제외**됩니다.

### 사용법

```js
const token = localStorage.getItem("lcs-token");

// 회원 삭제
async function deleteMember(memberId) {
  const response = await fetch(
    `https://api.fullstackfamily.com/api/loccishop/v1/admin/members/${memberId}`,
    {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    }
  );
  const result = await response.json();

  if (result.success) {
    console.log("삭제 완료:", result.data.id);
    // 회원 목록 새로고침 — 삭제된 회원은 자동으로 제외됩니다
    loadMembers();
  }
}

// 회원 목록 조회
async function loadMembers(page = 1) {
  const response = await fetch(
    `https://api.fullstackfamily.com/api/loccishop/v1/admin/members?page=${page}&limit=20`,
    {
      headers: { Authorization: "Bearer " + token },
    }
  );
  const result = await response.json();

  if (result.success) {
    console.log("전체 회원 수:", result.data.totalMembers);
    result.data.members.forEach(function (member) {
      console.log(member.memberId, member.username, member.status);
    });
  }
}
```

---

## 수정 2: 배너 조회 응답에 날짜/정렬 필드 추가

### 문제
`GET /banners` 응답에 `startDate`, `endDate`, `sortOrder` 필드가 포함되지 않아 프론트엔드에서 렌더링이 불가했던 문제.

### 수정 후 응답

```json
{
  "success": true,
  "data": {
    "banners": [
      {
        "id": 12,
        "title": "배너 제목",
        "description": "배너 설명",
        "imageUrl": "https://example.com/banner.jpg",
        "linkUrl": "https://example.com",
        "sortOrder": 1,
        "startDate": "2026-04-14",
        "endDate": "2026-04-29"
      }
    ]
  }
}
```

### 추가된 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `sortOrder` | number | 표시 순서 (낮을수록 먼저) |
| `startDate` | string | 시작일 (YYYY-MM-DD) |
| `endDate` | string | 종료일 (YYYY-MM-DD) |

### 사용법

```js
// 배너 목록 조회 (인증 불필요)
async function loadBanners() {
  const response = await fetch(
    "https://api.fullstackfamily.com/api/loccishop/v1/banners"
  );
  const result = await response.json();

  if (result.success) {
    // sortOrder 순으로 정렬 (서버에서 이미 정렬됨)
    result.data.banners.forEach(function (banner) {
      console.log("제목:", banner.title);
      console.log("이미지:", banner.imageUrl);
      console.log("순서:", banner.sortOrder);
      console.log("기간:", banner.startDate, "~", banner.endDate);
    });
  }
}
```

---

## API 문서 페이지

https://www.fullstackfamily.com/loccishop/api-docs
