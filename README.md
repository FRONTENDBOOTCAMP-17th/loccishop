# 협업 규칙

## 📁 브랜치 전략

```
main
  └── develop
        └── feature/#이슈번호-작업내용
        └── fix/#이슈번호-작업내용
        └── docs/#이슈번호-작업내용
        └── style/#이슈번호-작업내용
        └── refactor/#이슈번호-작업내용
        └── chore/#이슈번호-작업내용
```

- `main` : 최종 배포 브랜치 — 직접 push 금지
- `develop` : 개발 통합 브랜치
- `feature` : 기능 개발 브랜치
- `fix` : 버그 수정 브랜치
- `docs` : 문서 작업 브랜치
- `style` : CSS 수정, 코드 포맷 브랜치
- `refactor` : 코드 리팩토링 브랜치
- `chore` : 설정, 파일 구조 변경 브랜치

### 브랜치 이름 규칙

```
feature/#이슈번호-작업내용
```

```
# 예시
feature/#1-epic-product-detail
feature/#2-product-main
feature/#6-review
feature/#7-footer
```

## 🗑️ 브랜치 관리

- `feature` 브랜치는 머지 후 반드시 삭제

---

## ✏️ 커밋 메시지 규칙

```
타입: 작업 내용 (#이슈번호)
```

| 타입       | 설명                                 |
| ---------- | ------------------------------------ |
| `feat`     | 새로운 기능 구현                     |
| `fix`      | 버그 수정                            |
| `style`    | CSS 수정, 코드 포맷 (로직 변경 없음) |
| `refactor` | 코드 리팩토링                        |
| `docs`     | 문서 수정                            |
| `chore`    | 설정, 파일 구조 변경                 |

```
# 예시
feat: 리뷰 목록 출력 구현 (#12)
feat: 별점 컴포넌트 구현 (#24)
fix: 모바일 메뉴 닫힘 버그 수정 (#33)
style: 상품 카드 간격 조정(#32)
```

---

## 🏷️ 이슈 라벨

| 라벨      | 색상      | 설명                 |
| --------- | --------- | -------------------- |
| `epic`    | `#8B5CF6` | 큰 단위 작업 묶음    |
| `feature` | `#22C55E` | 새로운 기능 구현     |
| `bug`     | `#EF4444` | 버그 수정            |
| `docs`    | `#F59E0B` | 문서 작업            |
| `chore`   | `#6B7280` | 설정, 파일 구조 변경 |

---

## 📝 이슈 등록 규칙

### 제목

```
Epic: 상품 상세페이지 구현
feat: 리뷰 영역 구현
bug: 모바일 메뉴 닫힘 버그
```

### Epic 이슈

- 큰 작업 단위 시작 전 Epic 이슈 먼저 등록
- 하위 feat 이슈 등록 후 Epic 이슈에 번호 업데이트

### feat 이슈

- Epic 이슈 번호 반드시 연결
- 작업 목록 체크리스트로 작성

---

## 🔀 PR 규칙

- `feature` → `develop` 으로만 PR
- PR 제목은 이슈 제목과 동일하게 작성
- 본인 PR 본인 머지 금지 — 팀원 1명 이상 리뷰 후 머지
- PR 본문에 관련 이슈 번호 반드시 연결

```
# PR 본문 예시
## 작업 내용
- 리뷰 목록 출력
- 별점 컴포넌트
- 더보기 버튼

## 관련 이슈
resolved #6
```

---

## 💻 코드 작성 규칙

### 경로

- 모든 파일 경로는 **절대경로** 사용

```html
<!-- ❌ -->
src="../../assets/icon/star.svg"

<!-- ✅ -->
src="/src/assets/icon/star.svg"
```

### HTML 기본 구조

- `<script>` 태그는 `<head>` 안에만 위치
- 스타일은 `<link>` 태그 대신 `main.js`에서 import
- `id`는 페이지 내 중복 사용 금지

```html
<!-- ✅ 올바른 예시 -->
<head>
  <script type="module" src="/src/js/main.js"></script>
</head>

<!-- ❌ body 하단 script 금지 -->
<body>
  ...
  <script src="/src/js/main.js"></script>
</body>
```

```js
// main.js에서 스타일 import
import "/src/styles/style.css";
```

---

## 🗂️ 파일 구조

```
LOCCISHOP/
├── .github/
│
├── docs/
│   └── api/
│
├── reviews/
│
├── src/
│   ├── assets/
│   │   ├── icon/
│   │   └── images/
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   └── badge.js
│   │   │
│   │   ├── header/
│   │   │   ├── header.html
│   │   │   └── header.js
│   │   └── footer/
│   │       ├── footer.html
│   │       └── footer.js
│   │
│   ├── pages/
│   │   ├── main/
│   │   │   ├── index.html
│   │   │   └── index.js
│   │   ├── login/
│   │   │   ├── index.html
│   │   │   └── index.js
│   │   ├── signup/
│   │   │   ├── index.html
│   │   │   └── index.js
│   │   ├── product/
│   │   │   ├── list/
│   │   │   │   ├── index.html
│   │   │   │   └── index.js
│   │   │   └── detail/
│   │   │       ├── components/
│   │   │       │   ├── detail-main.html
│   │   │       │   ├── detail-review.html
│   │   │       │   └── detail-recommend.html
│   │   │       ├── index.html
│   │   │       └── index.js
│   │   ├── cart/
│   │   │   ├── components/
│   │   │   │   ├── cart-list.html
│   │   │   │   └── cart-summary.html
│   │   │   ├── index.html
│   │   │   └── index.js
│   │   ├── order/
│   │   │   ├── components/
│   │   │   │   ├── order-shipping.html
│   │   │   │   └── order-payment.html
│   │   │   ├── index.html
│   │   │   └── index.js
│   │   ├── mypage/
│   │   │   ├── index.html
│   │   │   └── index.js
│   │   └── admin/
│   │       ├── index.html
│   │       └── index.js
│   │
│   ├── styles/
│   │   └── style.css
│   │
│   └── js/
│       └── main.js
│
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
└── vite.config.js

```

---

## ⚙️ 작업 순서

```
1. 이슈 등록
2. 담당자 지정
3. 브랜치 생성 (feature/#이슈번호-작업내용)
4. 작업 후 커밋
5. develop으로 PR
6. 팀원 리뷰
```
