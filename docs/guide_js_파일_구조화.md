# JavaScript 파일 구조화 가이드

> 이 문서는 loccishop 프로젝트의 실제 코드를 기반으로, JS 파일을 **어떻게 나누고**, **어디에 두고**, **어떻게 연결하는지** 설명합니다.

---

## 목차

1. [왜 파일을 나눠야 할까?](#1-왜-파일을-나눠야-할까)
2. [우리 프로젝트 폴더 구조 한눈에 보기](#2-우리-프로젝트-폴더-구조-한눈에-보기)
3. [폴더별 역할 설명](#3-폴더별-역할-설명)
4. [JS 파일을 나누는 기준](#4-js-파일을-나누는-기준)
5. [실전 예시: 상품 상세 페이지](#5-실전-예시-상품-상세-페이지)
6. [실전 예시: 회원가입 페이지 리팩토링](#6-실전-예시-회원가입-페이지-리팩토링)
7. [import/export 사용법](#7-importexport-사용법)
8. [UI 컴포넌트 만드는 패턴](#8-ui-컴포넌트-만드는-패턴)
9. [API 코드 분리하는 방법](#9-api-코드-분리하는-방법)
10. [새 페이지를 추가할 때 따라할 체크리스트](#10-새-페이지를-추가할-때-따라할-체크리스트)
11. [자주 하는 실수와 해결법](#11-자주-하는-실수와-해결법)
12. [파일을 나눌지 말지 판단하는 기준](#12-파일을-나눌지-말지-판단하는-기준)

---

## 1. 왜 파일을 나눠야 할까?

하나의 파일에 모든 코드를 넣으면 이런 문제가 생깁니다:

| 문제 | 설명 |
|------|------|
| **찾기 어려움** | "장바구니 버튼 코드가 어디있지?" 500줄짜리 파일에서 찾아야 합니다 |
| **충돌 많음** | 팀원 3명이 같은 파일을 수정하면 Git 충돌이 자주 발생합니다 |
| **재사용 불가** | 다른 페이지에서도 쓰고 싶은 코드가 특정 페이지에 묶여있습니다 |
| **수정이 무서움** | 하나를 바꾸면 다른 곳이 깨질까 걱정됩니다 |

**파일을 잘 나누면:**
- 파일 이름만 보고 원하는 코드를 바로 찾을 수 있습니다
- 각자 다른 파일을 수정하니 충돌이 줄어듭니다
- 버튼, 카드 같은 UI를 여러 페이지에서 재사용할 수 있습니다

---

## 2. 우리 프로젝트 폴더 구조 한눈에 보기

```
src/
├── js/                    ← 🔵 공통 JavaScript (어디서든 쓰는 코드)
│   ├── main.js            ← 앱 시작점 (헤더, 푸터 렌더링)
│   └── api/               ← 서버와 통신하는 코드
│       ├── client.js      ← API 호출의 기본 설정
│       └── product/
│           └── index.js   ← 상품 관련 API 함수들
│
├── components/            ← 🟢 재사용 가능한 UI 부품
│   ├── ui/                ← 작은 UI 부품 (버튼, 뱃지, 카드...)
│   │   ├── button.js
│   │   ├── badge.js
│   │   ├── tag.js
│   │   ├── drawer.js
│   │   ├── product-card.js
│   │   └── product-card-list.js
│   ├── header/            ← 헤더 컴포넌트
│   │   ├── header.html
│   │   └── header.js
│   └── footer/            ← 푸터 컴포넌트
│       ├── footer.html
│       └── footer.js
│
├── pages/                 ← 🟡 페이지별 고유 코드
│   ├── login/
│   │   ├── index.html
│   │   └── index.js
│   ├── signup/
│   │   ├── index.html
│   │   └── index.js
│   └── product/
│       ├── list/
│       │   ├── index.html
│       │   └── index.js
│       └── detail/
│           ├── components/        ← 이 페이지 전용 HTML 조각
│           │   ├── detail-main.html
│           │   ├── detail-review.html
│           │   └── detail-recommended.html
│           ├── handlers/          ← 이 페이지의 기능별 JS
│           │   ├── renderProductMain.js
│           │   ├── initReviews.js
│           │   ├── initBestReview.js
│           │   ├── initRecommendedList.js
│           │   └── renderStars.js
│           ├── index.html
│           └── index.js           ← 페이지 진입점 (조립하는 역할)
│
├── styles/
│   └── style.css
│
└── assets/
    ├── icon/
    ├── images/
    └── logo/
```

### 핵심 원칙: 3개의 층으로 나눈다

```
┌─────────────────────────────────────────────┐
│  pages/        → 특정 페이지에서만 쓰는 코드    │  🟡 페이지 전용
├─────────────────────────────────────────────┤
│  components/   → 여러 페이지에서 재사용하는 UI   │  🟢 공용 부품
├─────────────────────────────────────────────┤
│  js/           → API, 유틸리티 등 공통 로직      │  🔵 공통 기반
└─────────────────────────────────────────────┘
```

**비유하면:**
- `js/` = 건물의 **기초 공사** (전기, 수도 같은 인프라)
- `components/` = **가구** (의자, 테이블 — 어느 방에든 놓을 수 있음)
- `pages/` = **각 방** (거실, 침실 — 각 방만의 배치와 용도가 있음)

---

## 3. 폴더별 역할 설명

### 🔵 `src/js/` — 공통 JavaScript

모든 페이지에서 공유하는 코드를 넣는 곳입니다.

| 파일 | 역할 | 사용처 |
|------|------|--------|
| `main.js` | 앱 시작할 때 헤더, 푸터를 렌더링 | 모든 페이지 |
| `api/client.js` | API 호출의 기본 함수 (BASE_URL, 에러 처리) | 모든 API 호출 |
| `api/product/index.js` | 상품 관련 API (상품 조회, 리뷰 조회 등) | 상품 페이지들 |

**우리 프로젝트의 실제 코드:**

```js
// src/js/api/client.js — 모든 API의 기초
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
```

```js
// src/js/api/product/index.js — client.js를 활용하는 상품 API
import { fetchAPI } from "/src/js/api/client.js";

export function fetchProduct(id) {
  return fetchAPI(`/products/${id}`);
}

export function fetchRelatedProducts(id, limit = 10) {
  return fetchAPI(`/products/${id}/related?limit=${limit}`);
}
```

> **포인트:** `client.js`가 BASE_URL과 에러 처리를 담당하니까, 각 API 함수는 경로만 넘기면 됩니다. 만약 서버 주소가 바뀌면 `client.js` 한 곳만 수정하면 됩니다.

---

### 🟢 `src/components/` — 재사용 가능한 UI

여러 페이지에서 쓸 수 있는 UI 부품을 넣는 곳입니다.

**구분 기준:**

```
components/
├── ui/          ← 범용 UI 부품 (어떤 페이지든 사용 가능)
│   ├── button.js       → 버튼
│   ├── badge.js        → NEW, SALE 같은 뱃지
│   ├── drawer.js       → 슬라이드 패널
│   └── product-card.js → 상품 카드
│
├── header/      ← 레이아웃 컴포넌트 (모든 페이지 공통)
│   ├── header.html
│   └── header.js
│
└── footer/      ← 레이아웃 컴포넌트 (모든 페이지 공통)
    ├── footer.html
    └── footer.js
```

**구분하는 기준이 뭘까요?**

- `ui/` 폴더: "이 부품을 **여러 곳**에서 다른 데이터로 사용할 수 있는가?"
  - 버튼은 장바구니 버튼, 리뷰 더보기 버튼 등 어디서든 쓰임 → `ui/` 에 둠
  - 상품 카드도 목록, 추천, 검색결과 등 어디서든 쓰임 → `ui/` 에 둠

- `header/`, `footer/` 폴더: "모든 페이지에 공통으로 보이는 **레이아웃 영역**인가?"
  - 헤더, 푸터는 항상 같은 형태로 나타남 → 별도 폴더에 html + js를 함께 둠

---

### 🟡 `src/pages/` — 페이지별 고유 코드

각 페이지에서만 쓰는 코드를 넣는 곳입니다.

```
pages/product/detail/
├── components/                ← 이 페이지 전용 HTML 조각
│   ├── detail-main.html       → 상품 메인 정보 레이아웃
│   ├── detail-review.html     → 리뷰 섹션 레이아웃
│   └── detail-recommended.html → 추천 상품 섹션 레이아웃
│
├── handlers/                  ← 기능별로 나눈 JS 파일들
│   ├── renderProductMain.js   → 상품 메인 이미지, 가격, 슬라이더
│   ├── initReviews.js         → 리뷰 목록 렌더링, 정렬
│   ├── initBestReview.js      → 베스트 리뷰 1개 표시
│   ├── initRecommendedList.js → 추천 상품 목록
│   └── renderStars.js         → 별점 표시 (★★★☆☆)
│
├── index.html                 ← 페이지 HTML
└── index.js                   ← 페이지 진입점 (모든 handler를 조립)
```

**왜 `handlers/` 폴더를 따로 만들까요?**

상품 상세 페이지의 `index.js`가 하는 일이 많습니다:
- 상품 메인 정보 표시
- 옵션 버튼 만들기
- 장바구니 버튼 만들기
- 드로어(서랍 메뉴) 만들기
- 리뷰 목록 표시
- 베스트 리뷰 표시
- 추천 상품 표시

이걸 전부 한 파일에 넣으면 500줄이 넘어갑니다. 그래서 **기능 단위로 쪼개서** `handlers/` 폴더에 넣습니다.

---

## 4. JS 파일을 나누는 기준

### 기준 1: "이 코드는 어디서 쓰이는가?"

```
질문: "이 코드를 다른 페이지에서도 쓸 수 있을까?"

YES → components/ui/ 또는 js/에 둔다
NO  → 해당 pages/폴더에 둔다
```

| 코드 | 다른 페이지에서 재사용? | 어디에 둘까? |
|------|------------------------|-------------|
| `createButton()` | YES - 어디서든 버튼 필요 | `components/ui/button.js` |
| `fetchAPI()` | YES - 모든 API 호출에 필요 | `js/api/client.js` |
| `initReviews()` | NO - 상품 상세에서만 사용 | `pages/product/detail/handlers/` |
| `renderStars()` | 애매함 - 지금은 상세에서만 사용 | 일단 `handlers/`에 두고, 나중에 다른 곳에서도 필요하면 `components/ui/`로 이동 |

### 기준 2: "이 코드는 무슨 역할인가?"

코드의 **역할**에 따라 파일을 나눕니다:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   API 통신 코드   │     │   UI 렌더링 코드   │     │   이벤트 처리 코드  │
│ (서버와 대화)     │     │ (화면에 그리기)    │     │ (클릭, 입력 등)    │
│                 │     │                  │     │                 │
│ js/api/         │     │ components/ui/   │     │ pages/handlers/ │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

**예시: 리뷰 관련 코드가 3곳에 나뉘어 있습니다**

```
1. 서버에서 리뷰 데이터 가져오기  → js/api/product/index.js  (fetchProductReviews)
2. 별점을 화면에 그리기          → handlers/renderStars.js   (renderStars)
3. 리뷰 목록 초기화 + 정렬       → handlers/initReviews.js   (initReviews)
```

왜 이렇게 나눌까요?
- API 함수는 다른 페이지에서도 리뷰를 불러올 때 재사용할 수 있습니다
- 별점 렌더링도 다른 곳에서 쓸 수 있는 가능성이 있습니다
- 리뷰 목록 초기화는 이 페이지만의 로직이라 `handlers/`에 둡니다

### 기준 3: "이 파일이 100줄을 넘어가는가?"

100줄은 대략적인 기준이지, 엄격한 규칙은 아닙니다. 하지만 한 파일이 100줄을 넘어가기 시작하면, 나눌 수 있는지 생각해보세요.

```
📄 signup/index.js (297줄) — 나누기 전
   ├── 유효성 검사 함수들 (isValidUsername, isValidPassword, isValidEmail)
   ├── UI 상태 변경 함수들 (setValid, setError, clearState)
   ├── 실시간 검증 이벤트 리스너들
   └── 폼 제출 처리

이걸 나누면:

📁 signup/
   ├── index.js              ← 진입점 (이벤트 연결만)
   ├── handlers/
   │   ├── validators.js     ← 유효성 검사 함수들
   │   ├── formUI.js         ← UI 상태 변경 (아이콘 표시/숨김)
   │   └── submitHandler.js  ← 폼 제출 API 호출
   └── index.html
```

---

## 5. 실전 예시: 상품 상세 페이지

우리 프로젝트에서 가장 잘 구조화된 페이지가 **상품 상세 페이지**입니다. 이 구조를 자세히 살펴봅시다.

### index.js — "조립하는 사람" (컨트롤러 역할)

```js
// src/pages/product/detail/index.js
import { fetchProduct } from "/src/js/api/product/index.js";       // API
import { createButton } from "/src/components/ui/button.js";       // 공용 UI
import { createBadge } from "/src/components/ui/badge.js";         // 공용 UI
import { createDrawer } from "/src/components/ui/drawer.js";       // 공용 UI
import { renderProductMain } from "./handlers/renderProductMain.js"; // 페이지 전용
import { initBestReview } from "./handlers/initBestReview.js";      // 페이지 전용
import { initReviews } from "./handlers/initReviews.js";            // 페이지 전용
import { initRecommendedList } from "./handlers/initRecommendedList.js"; // 페이지 전용

async function initProductPage() {
  // 1. 데이터 가져오기
  const id = getProductId();
  const product = await fetchProduct(id);

  // 2. 각 섹션을 순서대로 초기화
  await loadHTML("#detail-main", ".../detail-main.html");
  renderProductMain(product);        // handler 호출
  initBadge();                       // 로컬 함수
  intiOptionButtons(product.options); // 로컬 함수
  initCartButton();                  // 로컬 함수

  // 3. 리뷰 섹션
  await loadHTML("#detail-reviews", ".../detail-review.html");
  await initReviews(id);             // handler 호출

  // 4. 추천 상품
  await loadHTML("#detail-recommended", ".../detail-recommended.html");
  await initRecommendedList(id);     // handler 호출
}
```

**`index.js`의 역할을 보세요:**
- 직접 복잡한 일을 하지 않습니다
- 대신 **각 handler를 불러와서 순서대로 실행**합니다
- 마치 **요리 레시피**처럼 "1단계 → 2단계 → 3단계"를 조율합니다

### handler 파일 — "실제로 일하는 사람"

```js
// handlers/initBestReview.js — 베스트 리뷰 표시
import { fetchProductReviews } from "/src/js/api/product/index.js";

export async function initBestReview(productId) {
  // 1. API로 최고 평점 리뷰 1개 가져오기
  const { reviews } = await fetchProductReviews(productId, {
    page: 1, limit: 1, sort: "rating_high",
  });

  // 2. 없으면 섹션 제거
  if (!reviews || reviews.length === 0) {
    document.querySelector("#best-review-section")?.remove();
    return;
  }

  // 3. 화면에 표시
  const review = reviews[0];
  document.querySelector("#review-title").textContent = review.title ?? "";
  document.querySelector("#review-content").textContent = review.content;
  document.querySelector("#author").textContent = review.author;
}
```

**이 handler의 특징:**
- **한 가지 일**만 합니다 (베스트 리뷰 표시)
- 파일 이름(`initBestReview.js`)만 봐도 무슨 일을 하는지 알 수 있습니다
- 27줄밖에 안 되니까 읽기 편합니다

### 이 구조의 장점

```
팀원 A: "리뷰 정렬이 안 돼요"
→ handlers/initReviews.js 만 보면 됨

팀원 B: "추천 상품이 안 나와요"
→ handlers/initRecommendedList.js 만 보면 됨

팀원 C: "상품 이미지 슬라이더가 이상해요"
→ handlers/renderProductMain.js 만 보면 됨
```

모든 코드가 `index.js` 하나에 있었다면, 500줄짜리 파일에서 관련 코드를 찾아야 했을 겁니다.

---

## 6. 실전 예시: 회원가입 페이지 리팩토링

현재 `signup/index.js`는 297줄짜리 하나의 파일입니다. 잘 동작하지만, 만약 더 복잡해진다면 나누는 것이 좋습니다. 어떻게 나눌 수 있는지 살펴봅시다.

### 현재 구조 (Before)

```
signup/
├── index.html
└── index.js        ← 297줄 (유효성검사 + UI상태 + 이벤트 + API호출 전부 여기에)
```

### 나눈 구조 (After)

```
signup/
├── index.html
├── index.js                  ← 진입점 (약 40줄)
└── handlers/
    ├── validators.js         ← 유효성 검사 (약 15줄)
    ├── formUI.js             ← 아이콘/에러 표시 (약 25줄)
    └── submitHandler.js      ← 폼 제출 + API (약 50줄)
```

### 나누는 과정을 단계별로 보여드리겠습니다

**Step 1: 유효성 검사 함수를 분리한다**

현재 `index.js`에 있는 이 함수들:
```js
function isValidUsername(value) { ... }
function isValidPassword(value) { ... }
function isValidEmail(value) { ... }
```

이 함수들은 **순수 함수**입니다. DOM을 건드리지 않고, 값을 받아서 true/false만 리턴합니다.
이런 함수들은 독립적으로 꺼내기 가장 쉽습니다.

```js
// handlers/validators.js
export function isValidUsername(value) {
  return value.length >= 4 && value.length <= 20;
}

export function isValidPassword(value) {
  return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(value);
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
```

**Step 2: UI 상태 변경 함수를 분리한다**

```js
// handlers/formUI.js
export function setValid(errorIcon, checkIcon, errorText) {
  if (errorIcon) errorIcon.style.display = "none";
  checkIcon.style.display = "block";
  if (errorText) errorText.style.display = "none";
}

export function setError(errorIcon, checkIcon, errorText) {
  if (errorIcon) errorIcon.style.display = "block";
  checkIcon.style.display = "none";
  if (errorText) errorText.style.display = "block";
}

export function clearState(errorIcon, checkIcon, errorText) {
  if (errorIcon) errorIcon.style.display = "none";
  checkIcon.style.display = "none";
  if (errorText) errorText.style.display = "none";
}
```

**Step 3: index.js에서 import해서 사용한다**

```js
// signup/index.js (리팩토링 후)
import { isValidUsername, isValidPassword, isValidEmail } from "./handlers/validators.js";
import { setValid, setError, clearState } from "./handlers/formUI.js";

window.addEventListener("DOMContentLoaded", () => {
  // DOM 요소 가져오기
  const form = document.getElementById("signupForm");
  const userId = document.getElementById("userId");
  // ... 나머지 동일

  // 이제 import한 함수를 그대로 사용
  userId.addEventListener("input", () => {
    if (!userId.value) return clearState(idErrorIcon, idCheckIcon, idErrorText);
    isValidUsername(userId.value)
      ? setValid(idErrorIcon, idCheckIcon, idErrorText)
      : setError(idErrorIcon, idCheckIcon, idErrorText);
  });
  // ...
});
```

> **핵심:** 같은 동작을 하지만, 각 파일의 역할이 명확해집니다.
> - `validators.js` → "이 값이 올바른지 검사"
> - `formUI.js` → "아이콘과 에러 메시지 보이기/숨기기"
> - `index.js` → "이벤트를 연결하고 흐름을 조율"

---

## 7. import/export 사용법

파일을 나누면 **export**와 **import**로 연결해야 합니다. 이것이 ES6 모듈 시스템입니다.

### 기본 문법

```js
// ─── 내보내기 (export) ───
// button.js
export function createButton({ text, variant }) {
  // ...
}

// ─── 가져오기 (import) ───
// 다른 파일에서
import { createButton } from "/src/components/ui/button.js";
```

### Named Export (이름 붙여서 내보내기) — 우리 프로젝트에서 사용하는 방식

한 파일에서 여러 개를 내보낼 수 있습니다:

```js
// handlers/initReviews.js
export async function initReviews(productId) { ... }
export function initSortButtons(productId) { ... }
```

```js
// 가져올 때 — 필요한 것만 골라서 가져올 수 있습니다
import { initReviews, initSortButtons } from "./handlers/initReviews.js";
```

### 경로 작성 규칙

우리 프로젝트에서는 **두 가지 경로 방식**을 사용합니다:

```js
// 1. 절대 경로 — 공용 코드를 가져올 때 (다른 폴더에 있는 파일)
import { fetchProduct } from "/src/js/api/product/index.js";
import { createButton } from "/src/components/ui/button.js";

// 2. 상대 경로 — 같은 폴더 안의 파일을 가져올 때
import { renderProductMain } from "./handlers/renderProductMain.js";
import { renderStars } from "./renderStars.js";
```

| 상황 | 경로 방식 | 예시 |
|------|----------|------|
| `components/`, `js/` 가져올 때 | 절대 경로 (`/src/...`) | `import { createButton } from "/src/components/ui/button.js"` |
| 같은 `handlers/` 폴더 내 | 상대 경로 (`./`) | `import { renderStars } from "./renderStars.js"` |

> **왜 절대 경로를 쓸까요?** 파일이 이동해도 경로가 깨지지 않고, `../../..` 같은 복잡한 상대 경로를 쓰지 않아도 되기 때문입니다. Vite가 절대 경로를 자동으로 처리해줍니다.

---

## 8. UI 컴포넌트 만드는 패턴

우리 프로젝트에서는 **팩토리 함수 패턴**을 사용합니다. "팩토리(factory)"란 "물건을 만드는 공장"이라는 뜻입니다.

### 패턴: `create___()` 함수

```js
// components/ui/button.js
export function createButton({ text, variant = "primary", size = "md", fullWidth = false }) {
  const button = document.createElement("button");
  // ... 옵션에 따라 스타일 적용
  button.textContent = text;
  return button;  // ← DOM 요소를 리턴!
}
```

**사용하는 곳:**
```js
// 장바구니 버튼으로 사용
const cartBtn = createButton({
  text: "장바구니에 추가",
  variant: "primary",
  size: "md",
  fullWidth: true,
});
document.querySelector("#cart-button").append(cartBtn);

// 리뷰 더보기 버튼으로도 사용
const moreBtn = createButton({
  text: "리뷰 더보기",
  variant: "outline",
  size: "sm",
});
document.querySelector("#more-reviews").append(moreBtn);
```

### 새 컴포넌트를 만들 때 따라할 템플릿

```js
// components/ui/[컴포넌트이름].js

export function create컴포넌트이름({ 옵션1, 옵션2 = "기본값" } = {}) {
  // 1. 요소 만들기
  const element = document.createElement("태그");

  // 2. 스타일 적용 (Tailwind CSS 클래스)
  element.className = "클래스들...";

  // 3. 옵션에 따라 분기
  if (옵션1 === "어떤값") {
    element.classList.add("추가클래스");
  }

  // 4. 내용 설정
  element.textContent = 옵션2;

  // 5. DOM 요소 리턴
  return element;
}
```

**실제 예시 — badge.js:**
```js
export function createBadge({ type = "NEW" } = {}) {
  const badge = document.createElement("span");
  badge.textContent = type;
  badge.className = "text-xs font-medium px-2 py-1 rounded-sm";

  // type에 따라 다른 색상
  const styles = {
    NEW: "bg-rose-white text-woody-brown",
    SALE: "bg-burnt-orange text-white",
    BEST: "bg-ferra text-spring-wood",
  };
  badge.classList.add(...(styles[type] || styles.NEW).split(" "));

  return badge;
}
```

### 어떤 걸 컴포넌트로 만들어야 할까?

```
✅ 컴포넌트로 만들어야 하는 경우:
- 2곳 이상에서 같은 UI가 반복될 때 (버튼, 카드, 뱃지)
- 옵션만 다르고 모양이 비슷한 UI가 여러 개일 때

❌ 컴포넌트로 만들지 않아도 되는 경우:
- 딱 한 곳에서만 쓰는 UI
- 너무 단순해서 함수로 만들 필요 없는 것 (예: <p> 하나)
```

---

## 9. API 코드 분리하는 방법

### 구조

```
js/api/
├── client.js           ← 기본 설정 (BASE_URL, 공통 에러 처리)
├── product/
│   └── index.js        ← 상품 관련 API
├── auth/
│   └── index.js        ← 인증 관련 API (로그인, 회원가입)
├── cart/
│   └── index.js        ← 장바구니 관련 API
└── review/
    └── index.js        ← 리뷰 관련 API (현재는 product에 포함)
```

### client.js — 모든 API의 기초

```js
// js/api/client.js
const BASE_URL = "https://api.fullstackfamily.com/api/loccishop/v1";

export async function fetchAPI(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API 오류: ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error("서버 오류가 발생했습니다.");
  return json.data;
}
```

이 파일이 하는 일:
1. 서버 주소를 한 곳에서 관리
2. HTTP 상태 코드 확인
3. API 응답의 success 필드 확인
4. data만 꺼내서 리턴

### 도메인별 API 파일

```js
// js/api/product/index.js — 상품 API
import { fetchAPI } from "/src/js/api/client.js";

export function fetchProduct(id) {
  return fetchAPI(`/products/${id}`);
}

export function fetchRelatedProducts(id, limit = 10) {
  return fetchAPI(`/products/${id}/related?limit=${limit}`);
}

export function fetchProductReviews(productId, { page, limit, sort } = {}) {
  const params = new URLSearchParams({ page, limit, sort });
  return fetchAPI(`/products/${productId}/reviews?${params}`);
}
```

### 새 API를 추가할 때

예를 들어 장바구니 API를 추가한다면:

```js
// js/api/cart/index.js — 새로 만든 파일
import { fetchAPI } from "/src/js/api/client.js";

export function fetchCart() {
  return fetchAPI("/cart");
}

export function addToCart(productId, quantity) {
  // POST 요청이 필요하면 client.js에 postAPI를 추가하거나,
  // 여기서 직접 fetch를 사용할 수 있습니다
}
```

> **주의:** 현재 `signup/index.js`에서는 `client.js`를 사용하지 않고 직접 `fetch`를 호출하고 있습니다. API가 늘어나면 `client.js`를 통해 통일하는 것이 좋습니다.

---

## 10. 새 페이지를 추가할 때 따라할 체크리스트

예: "마이페이지"를 새로 만든다고 합시다.

### Step 1: 폴더와 기본 파일 만들기

```
src/pages/mypage/
├── index.html
└── index.js
```

### Step 2: HTML에 script 태그 추가

```html
<!-- src/pages/mypage/index.html -->
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>마이페이지 - LOCCISHOP</title>
  <script type="module" src="/src/js/main.js"></script>       <!-- 공통 -->
  <script type="module" src="/src/pages/mypage/index.js"></script> <!-- 이 페이지 전용 -->
</head>
<body>
  <div id="header"></div>
  <main>
    <!-- 페이지 내용 -->
  </main>
  <div id="footer"></div>
</body>
</html>
```

### Step 3: vite.config.js에 엔트리 추가

```js
// vite.config.js
input: {
  main: "index.html",
  productDetail: "src/pages/product/detail/index.html",
  productList: "src/pages/product/list/index.html",
  login: "src/pages/login/index.html",
  signup: "src/pages/signup/index.html",
  mypage: "src/pages/mypage/index.html",  // ← 추가!
}
```

### Step 4: index.js 작성

```js
// src/pages/mypage/index.js

// 필요한 API 가져오기
import { fetchAPI } from "/src/js/api/client.js";

// 필요한 UI 컴포넌트 가져오기
import { createButton } from "/src/components/ui/button.js";

document.addEventListener("DOMContentLoaded", async () => {
  // 페이지 초기화 로직
});
```

### Step 5: 코드가 길어지면 handlers/ 분리

코드가 100줄 이상 되면:

```
src/pages/mypage/
├── handlers/
│   ├── initProfile.js
│   ├── initOrderHistory.js
│   └── initWishlist.js
├── index.html
└── index.js
```

### Step 6 (선택): 페이지 전용 HTML 조각이 필요하면 components/ 추가

```
src/pages/mypage/
├── components/
│   ├── profile-section.html
│   └── order-list.html
├── handlers/
│   ├── initProfile.js
│   └── initOrderHistory.js
├── index.html
└── index.js
```

---

## 11. 자주 하는 실수와 해결법

### 실수 1: 한 파일에 전부 때려넣기

```
❌ signup/index.js (297줄)
   - 유효성 검사
   - UI 상태 변경
   - 이벤트 리스너 20개
   - API 호출
   - 폼 제출 처리
```

**해결:** 역할별로 분리

```
✅ signup/
   ├── index.js            (이벤트 연결, 흐름 조율)
   └── handlers/
       ├── validators.js   (유효성 검사)
       ├── formUI.js       (UI 상태 변경)
       └── submitHandler.js (API 호출)
```

### 실수 2: API URL을 여러 파일에 하드코딩

```js
// ❌ signup/index.js에서 직접 URL 작성
const API_URL = "https://api.fullstackfamily.com/api/loccishop/v1/auth/signup";
```

**해결:** `client.js`를 통해 통일

```js
// ✅ js/api/auth/index.js
import { fetchAPI } from "/src/js/api/client.js";

export function signup(data) {
  return fetchAPI("/auth/signup", { method: "POST", body: data });
}
```

> 서버 주소가 바뀌면 `client.js`만 수정하면 모든 API가 한번에 바뀝니다.

### 실수 3: 상대 경로 지옥

```js
// ❌ 읽기 어렵고, 파일 위치 바뀌면 깨짐
import { fetchAPI } from "../../../js/api/client.js";
```

```js
// ✅ 절대 경로 사용
import { fetchAPI } from "/src/js/api/client.js";
```

### 실수 4: 파일 이름으로 역할을 알 수 없음

```
❌ helpers.js     → 뭘 돕는 건지 알 수 없음
❌ utils.js       → 온갖 잡다한 것의 모음이 될 위험
❌ functions.js   → 모든 JS 파일이 함수를 가지고 있음
```

```
✅ validators.js       → 유효성 검사 함수들
✅ renderStars.js      → 별점 렌더링
✅ initReviews.js      → 리뷰 초기화
✅ submitHandler.js    → 폼 제출 처리
```

### 실수 5: export 안 하고 import하려 함

```js
// ❌ export가 빠져있음!
function isValidEmail(value) { ... }
```

```js
// ✅ export 키워드를 반드시 붙여야 함
export function isValidEmail(value) { ... }
```

---

## 12. 파일을 나눌지 말지 판단하는 기준

모든 코드를 무조건 나눌 필요는 없습니다. 아래 체크리스트로 판단하세요:

### 나눠야 할 때

- [ ] 파일이 150줄을 넘어간다
- [ ] 한 파일에서 3가지 이상 다른 역할의 코드가 있다 (API + UI + 이벤트)
- [ ] 팀원 2명 이상이 같은 파일을 동시에 수정하려 한다
- [ ] 같은 코드를 복사-붙여넣기하고 있다 (재사용 가능한 컴포넌트 후보)

### 나누지 않아도 될 때

- [ ] 파일이 50줄 이하로 짧다
- [ ] 한 가지 일만 하고 있다
- [ ] 이 파일의 코드가 다른 곳에서 쓰일 일이 없다
- [ ] 나누면 오히려 파일만 많아져서 복잡해진다

### 실전 판단 예시

| 상황 | 판단 | 이유 |
|------|------|------|
| `renderStars.js` (17줄) | 나눔 O | 짧지만 다른 곳에서도 쓸 수 있는 독립 기능 |
| `initBestReview.js` (27줄) | 나눔 O | 명확한 하나의 기능, 다른 handler와 독립 |
| `signup/index.js` (297줄) | 나눔 권장 | 길고, 여러 역할이 섞여 있음 |
| `client.js` (17줄) | 유지 | 짧고 한 가지 역할만 함 |
| 5줄짜리 helper 함수 1개 | 나누지 않음 | 파일로 만들면 오히려 복잡 |

---

## 요약: 파일 구조화 3가지 핵심 원칙

```
1️⃣  역할별로 나눠라
    API는 api/에, UI는 components/에, 페이지 로직은 pages/에

2️⃣  이름만 보고 찾을 수 있게 하라
    initReviews.js > helpers.js
    validators.js > utils.js

3️⃣  index.js는 조립만 하라
    직접 복잡한 로직을 쓰지 말고,
    handler를 import해서 순서대로 호출하라
```

---

## 부록: 빠른 참조표

### 이 코드는 어디에 둘까?

| 코드 종류 | 위치 | 예시 |
|-----------|------|------|
| 서버 API 호출 | `js/api/[도메인]/index.js` | fetchProduct, fetchCart |
| API 공통 설정 | `js/api/client.js` | BASE_URL, fetchAPI |
| 재사용 UI 부품 | `components/ui/[이름].js` | createButton, createBadge |
| 레이아웃 영역 | `components/[이름]/` | header/, footer/ |
| 페이지 진입점 | `pages/[페이지]/index.js` | 이벤트 연결, handler 호출 |
| 페이지 전용 기능 | `pages/[페이지]/handlers/` | initReviews, renderProductMain |
| 페이지 전용 HTML | `pages/[페이지]/components/` | detail-main.html |
| 전역 스타일 | `styles/style.css` | Tailwind CSS |
| 이미지, 아이콘 | `assets/icon/`, `assets/images/` | star.svg, product1.webp |

### 파일 이름 규칙

| 패턴 | 의미 | 예시 |
|------|------|------|
| `create[이름].js` | UI 요소를 만들어 리턴하는 함수 | `createButton`, `createDrawer` |
| `render[이름].js` | 데이터를 받아 화면에 그리는 함수 | `renderProductMain`, `renderStars` |
| `init[이름].js` | API 호출 + 렌더링을 함께 하는 초기화 함수 | `initReviews`, `initBestReview` |
| `index.js` | 그 폴더의 진입점 | 모든 pages, api 폴더 |
