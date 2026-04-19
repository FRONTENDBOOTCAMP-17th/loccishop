# 코드 리뷰 - 록시탄 쇼핑몰 프로젝트

> 리뷰 일자: 2026-04-09
> 대상: develop 브랜치 최신 코드 전체

---

## 목차

1. [전체 평가](#1-전체-평가)
2. [잘한 점](#2-잘한-점)
3. [개선이 필요한 점](#3-개선이-필요한-점)
   - 3.1 [회원가입 코드 90% 중복](#31-심각도-높음--회원가입-코드-90-중복)
   - 3.2 [에러 메시지 문자열 파싱](#32-심각도-높음--에러-메시지-문자열-파싱)
   - 3.3 [innerHTML 사용 (XSS 위험)](#33-심각도-높음--innerhtml-사용-xss-위험)
   - 3.4 [main.js의 거대 함수](#34-심각도-중간--mainjs의-거대-함수)
   - 3.5 [전역 상태 관리](#35-심각도-중간--전역-상태-관리)
   - 3.6 [매직 넘버 하드코딩](#36-심각도-중간--매직-넘버-하드코딩)
   - 3.7 [CSS와 TailwindCSS 혼용](#37-심각도-중간--css와-tailwindcss-혼용)
   - 3.8 [에러 처리 누락](#38-심각도-중간--에러-처리-누락)
   - 3.9 [cart/index.js의 이중 직렬화](#39-심각도-높음--cartindexjs의-이중-직렬화)
   - 3.10 [모달 접근성](#310-심각도-낮음--모달-접근성)
4. [파일별 요약](#4-파일별-요약)

---

## 1. 전체 평가

초보 수준에서 **매우 잘 작성된 프로젝트**입니다. 컴포넌트를 나누려는 시도, API 모듈 분리, TailwindCSS 활용 등 좋은 구조적 감각이 보입니다. 아래 리뷰는 "더 나은 개발자로 성장하기 위한 피드백"입니다. 실수를 지적하는 것이 아니라, 같은 패턴을 반복하지 않도록 돕는 가이드입니다.

---

## 2. 잘한 점

### API 모듈 분리
```
src/js/api/
├── client.js         ← 공통 fetch 래퍼
├── auth/index.js     ← 인증 관련 API
├── cart/index.js     ← 장바구니 API
├── product/index.js  ← 상품 API
└── review/index.js   ← 리뷰 API
```
API 호출을 한 곳에 모아두고, `client.js`에서 토큰 처리/에러 처리를 공통화한 것은 좋은 설계입니다.

### UI 컴포넌트 분리
`button.js`, `badge.js`, `tag.js`, `drawer.js`, `modal.js`, `pagination.js` 등 **재사용 가능한 UI 컴포넌트**를 함수로 분리한 것은 훌륭합니다.

### 유효성 검사 모듈화
`signupUtils/validation.js`와 `signupUtils/ui.js`로 검증 로직과 UI 표시 로직을 분리한 것은 좋은 시도입니다.

### 접근성 고려
- `aria-label` 사용 (페이지네이션, 슬라이더 도트)
- `sr-only` 클래스 사용 (카테고리 타이틀)
- `role="img"` + `aria-label` (별점 표시)

### TailwindCSS 활용
대부분의 스타일링을 TailwindCSS 유틸리티 클래스로 처리하고 있어 일관성이 좋습니다.

---

## 3. 개선이 필요한 점

### 3.1 [심각도: 높음] 회원가입 코드 90% 중복

**파일**: `src/pages/signup/user/index.js` vs `src/pages/admin/signup/index.js`

두 파일을 비교해보면 거의 **복사-붙여넣기** 수준입니다.

| 함수명 | user/index.js | admin/signup/index.js | 동일? |
|--------|:---:|:---:|:---:|
| `getElements()` | O | O | 90% (admin은 `adminToken` 추가) |
| `initUI()` | O | O | 90% (admin은 `tokenErrorIcon` 추가) |
| `bindPasswordToggle()` | O | O | **100%** |
| `bindIdValidation()` | O | O | **100%** |
| `bindPasswordValidation()` | O | O | **100%** |
| `bindFieldValidations()` | O | O | 80% (admin은 `adminToken` 추가) |
| `handleSubmit()` | O | O | 85% (admin은 `adminToken` 검증 추가) |

**왜 문제인가?**
- 버그를 고치면 **두 파일 모두** 수정해야 합니다 (하나를 빼먹기 쉬움)
- 새 필드를 추가하면 **두 곳** 모두 변경해야 합니다
- 이것을 **"응집도는 낮고, 결합도가 높은"** 코드라고 합니다

> **해결 방법**: `code-review-solutions.md` 문서의 [3.1 해결](#) 참고

---

### 3.2 [심각도: 높음] 에러 메시지 문자열 파싱

**파일**: `src/js/api/cart/index.js` (11~24행)

```javascript
// 현재 코드
catch (e) {
  if (e.message.includes("401")) {     // ← 문자열에서 숫자를 찾는 방식
    alert("로그인이 필요한 서비스입니다.");
    return null;
  }
  if (e.message.includes("400")) {
    alert("재고가 부족합니다.");
    return null;
  }
}
```

**왜 문제인가?**
- `e.message`가 `"API 오류: 401"` 형태라는 것을 **가정**하고 있습니다
- 만약 `client.js`의 에러 메시지 형식이 바뀌면 모든 catch 블록이 깨집니다
- `"4010"` 같은 숫자가 포함된 다른 에러와 혼동될 수 있습니다

> **해결 방법**: `code-review-solutions.md` 문서의 [3.2 해결](#) 참고

---

### 3.3 [심각도: 높음] innerHTML 사용 (XSS 위험)

**파일**: `src/js/main.js` (214~231행)

```javascript
el.innerHTML = `
  <div class="flex h-[480px] ...">
    <figure class="w-1/2 ...">
      <img src="${slide.image}" alt="${slide.name}" ... />
    </figure>
    <div class="w-1/2 ...">
      <h2 ...>${slide.name}</h2>      <!-- ← 변수를 직접 삽입 -->
      <p ...>${slide.desc}</p>          <!-- ← 변수를 직접 삽입 -->
    </div>
  </div>
`;
```

**왜 문제인가?**
- 현재는 `ROTATING_SLIDES`가 하드코딩된 데이터라 괜찮지만, 나중에 API에서 데이터를 받아올 경우 **XSS 공격에 노출**됩니다
- `slide.name`에 `<script>alert('해킹!')</script>` 같은 값이 들어오면 실행될 수 있습니다

**같은 파일의 다른 부분(`detail/index.js` 24행)**도 동일합니다:
```javascript
container.innerHTML = await res.text();  // ← 서버 응답을 그대로 삽입
```

> **해결 방법**: `code-review-solutions.md` 문서의 [3.3 해결](#) 참고

---

### 3.4 [심각도: 중간] main.js의 거대 함수

**파일**: `src/js/main.js`

| 함수명 | 줄 수 | 책임 |
|--------|:---:|------|
| `setupSection()` | 43줄 | 탭 생성 + 필터링 + 캐러셀 + 이벤트 바인딩 |
| `initRotatingCarousel()` | 143줄 | DOM 생성 + 드래그 + 터치 + 리사이즈 |

**왜 문제인가?**
- **단일 책임 원칙(SRP)** 위반: 한 함수가 여러 가지를 동시에 처리합니다
- 읽기 어렵고, 테스트하기 어렵고, 수정하기 어렵습니다
- `initRotatingCarousel()`은 마우스 드래그, 터치 드래그, 리사이즈 처리를 모두 포함합니다

> **해결 방법**: `code-review-solutions.md` 문서의 [3.4 해결](#) 참고

---

### 3.5 [심각도: 중간] 전역 상태 관리

**파일**: `src/pages/product/detail/handlers/initReviews.js` (6~10행)

```javascript
let currentPage = 1;          // ← 모듈 전역
let currentSort = "latest";   // ← 모듈 전역
let currentProductId = null;  // ← 모듈 전역
let totalPages = 1;           // ← 모듈 전역
let currentRating = null;     // ← 모듈 전역
```

**왜 문제인가?**
- 5개의 변수가 여러 함수(`initReviews`, `initSortButtons`, `initPagination`, `initFilterButton`)에서 읽고 쓰입니다
- 함수 호출 순서에 따라 결과가 달라질 수 있습니다 (예: `initPagination`이 `initReviews`보다 먼저 호출되면 `totalPages`가 1)
- 디버깅할 때 "현재 값이 뭔지" 추적하기 어렵습니다

> **해결 방법**: `code-review-solutions.md` 문서의 [3.5 해결](#) 참고

---

### 3.6 [심각도: 중간] 매직 넘버 하드코딩

**파일**: `src/js/main.js`

```javascript
// 212행: 슬라이드 너비
el.style.width = "68vw";                           // ← 68이 뭘 의미하지?

// 243행
return window.innerWidth * 0.68;                    // ← 또 0.68

// 312-313행: 드래그 임계값
if (delta < -60) goTo(currentIdx + 1);              // ← 60이 뭘 의미하지?
else if (delta > 60) goTo(currentIdx - 1);          // ← 또 60
```

**왜 문제인가?**
- 나중에 이 코드를 읽는 사람(미래의 나 포함)은 `68`, `0.68`, `60`이 무엇을 의미하는지 알 수 없습니다
- 값을 변경하려면 파일 전체를 검색해야 합니다

> **해결 방법**: `code-review-solutions.md` 문서의 [3.6 해결](#) 참고

---

### 3.7 [심각도: 중간] CSS와 TailwindCSS 혼용

**파일**: `src/styles/style.css` (70~127행)

```css
/* style.css에 순수 CSS로 작성된 부분들 */
.years-gradient {
  background: linear-gradient(to right, #1a0e00 0%, #7a3c04 20%, ...);
}

.swiper-btn {
  display: flex;
  align-items: center;           /* ← Tailwind: flex items-center */
  justify-content: center;       /* ← Tailwind: justify-center */
  width: 2.5rem;                 /* ← Tailwind: w-10 */
  height: 2.5rem;                /* ← Tailwind: h-10 */
  border-radius: 9999px;         /* ← Tailwind: rounded-full */
  background-color: #ffffff;     /* ← Tailwind: bg-white */
  border: 1px solid #e5e7eb;     /* ← Tailwind: border border-gray-200 */
  cursor: pointer;               /* ← Tailwind: cursor-pointer */
}
```

**왜 문제인가?**
- `.swiper-btn`의 대부분 속성은 TailwindCSS 클래스로 대체할 수 있습니다
- 두 곳에서 스타일을 관리하면 **어디를 봐야 하는지** 혼란스럽습니다
- 그라데이션처럼 TailwindCSS로 표현하기 복잡한 것만 CSS에 남겨야 합니다

> **해결 방법**: `code-review-solutions.md` 문서의 [3.7 해결](#) 참고

---

### 3.8 [심각도: 중간] 에러 처리 누락

**파일**: `src/pages/product/detail/index.js` (18~25행)

```javascript
async function loadHTML(selector, url) {
  const container = document.querySelector(selector);
  if (!container) return;
  const res = await fetch(url);         // ← 네트워크 에러 시?
  container.innerHTML = await res.text(); // ← 404 응답이면?
}
```

**왜 문제인가?**
- 인터넷이 끊기면 `fetch`가 에러를 던지고 페이지가 깨집니다
- 서버가 404를 응답하면 에러 HTML이 페이지에 삽입됩니다
- 사용자는 **빈 화면**만 보게 됩니다

> **해결 방법**: `code-review-solutions.md` 문서의 [3.8 해결](#) 참고

---

### 3.9 [심각도: 높음] cart/index.js의 이중 직렬화

**파일**: `src/js/api/cart/index.js` (6~10행)

```javascript
export async function addToCart(productId, quantity) {
  try {
    return await fetchAPI("/members/me/cart/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),  // ← 여기서 직렬화
    });
```

그런데 `client.js`를 보면:

```javascript
// client.js 14행
...(options.body && { body: JSON.stringify(options.body) }),  // ← 여기서도 직렬화!
```

**결과**: `body`가 **이중으로 JSON.stringify** 됩니다!
```
실제 전송: "\"{ \\\"productId\\\": 1, \\\"quantity\\\": 1 }\""
기대하는 것: "{ \"productId\": 1, \"quantity\": 1 }"
```

서버가 이걸 파싱하지 못해 에러가 날 수 있습니다. `cart/index.js`에서는 `body`를 **객체 그대로** 전달해야 합니다.

> **해결 방법**: `code-review-solutions.md` 문서의 [3.9 해결](#) 참고

---

### 3.10 [심각도: 낮음] 모달 접근성

**파일**: `src/components/ui/modal.js`

```javascript
const close = () => {
  overlay.classList.add("opacity-0");
  container.classList.add("scale-95");
  setTimeout(() => overlay.remove(), 300);
  document.body.style.overflow = "auto";  // ← 이전 값이 "auto"가 아닐 수도 있음
};
```

**누락된 것들**:
- 모달 열 때 **포커스 트랩**(Tab 키로 모달 밖으로 나가지 못하게)
- 모달 닫을 때 **이전 포커스 복원**
- `Escape` 키로 닫기
- `role="dialog"` 및 `aria-modal="true"` 속성

> **해결 방법**: `code-review-solutions.md` 문서의 [3.10 해결](#) 참고

---

## 4. 파일별 요약

| 파일 | 잘한 점 | 개선 포인트 |
|------|---------|------------|
| `src/js/api/client.js` | 공통 fetch 래퍼, 토큰 자동 주입 | 에러 객체에 상태 코드 포함 필요 |
| `src/js/api/auth/index.js` | 깔끔한 API 함수 분리 | - |
| `src/js/api/cart/index.js` | 에러별 사용자 메시지 | 이중 직렬화, 문자열 에러 파싱 |
| `src/js/main.js` | 탭+캐러셀 통합 설계 | 거대 함수, 매직 넘버, innerHTML |
| `src/pages/signup/user/index.js` | 유효성 검사 분리 | admin과 90% 코드 중복 |
| `src/pages/admin/signup/index.js` | 유효성 검사 분리 | user와 90% 코드 중복 |
| `src/pages/login/index.js` | 간결한 로그인 로직 | localStorage에 토큰 저장 |
| `src/pages/product/detail/index.js` | 핸들러 모듈 분리 | loadHTML 에러 처리, 순차적 await |
| `src/pages/product/detail/handlers/initReviews.js` | createElement 사용 (안전) | 전역 상태 5개 |
| `src/components/ui/modal.js` | 오버레이 클릭 닫기 | 접근성 부족 |
| `src/components/ui/cartDrawer.js` | 연관 상품 + 슬라이더 연동 | 함수 크기 큼 |
| `src/components/ui/imageSlider.js` | aria-label 사용 | - |
| `src/components/ui/pagination.js` | aria-label 사용 | - |
| `src/styles/style.css` | 커스텀 테마 색상 잘 정의 | Tailwind로 대체 가능한 CSS |
| `src/js/signupUtils/validation.js` | 깔끔한 정규식 분리 | - |
| `src/js/signupUtils/ui.js` | 상태 토글 함수화 | - |

---

## 핵심 메시지

1. **코드 중복은 버그의 온상입니다** - 같은 코드가 두 곳에 있으면 한 곳을 고칠 때 다른 곳을 놓치기 쉽습니다.
2. **함수는 한 가지만 하세요** - 함수가 길어지면 "이 함수가 뭘 하는 거지?" 싶어집니다. 이름만 보고 뭘 하는지 알 수 있어야 합니다.
3. **innerHTML보다 createElement를** - XSS 공격을 원천 차단할 수 있습니다. `initReviews.js`의 `createReviewCard()`처럼요!
4. **에러는 숫자(상태 코드)로, 메시지는 사람에게** - 에러를 문자열로 파싱하면 언제든 깨질 수 있습니다.
5. **TailwindCSS를 쓰기로 했으면 일관되게** - CSS 파일에 Tailwind로 충분한 속성을 넣으면 두 곳을 관리해야 합니다.
