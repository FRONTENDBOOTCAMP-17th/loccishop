<div align="center">

# 🌿 LocciShop

### L'Occitane 코리아 쇼핑몰 클론 프로젝트

HTML · CSS · Vanilla JavaScript로 구현한 순수 프론트엔드 e-커머스 프로젝트

**FRONTEND BOOTCAMP 17th | 2025.04**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/ko/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/ko/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/ko/docs/Web/JavaScript)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

<br/>

## 📋 목차

1. [프로젝트 소개](#-프로젝트-소개)
2. [기술 스택](#-기술-스택)
3. [팀원 소개](#-팀원-소개)
4. [폴더 구조](#-폴더-구조)
5. [구현 기능](#-구현-기능)
6. [핵심 기능](#-핵심-기능)
7. [문제 해결 & 개선](#-문제-해결--개선)
8. [협업 방식](#-협업-방식)
9. [협업 규칙](#-협업-규칙)
10. [팀원 소감](#-팀원-소감)

<br/>

---

<br/>

## 🌿 프로젝트 소개

LocciShop은 [L'Occitane 코리아](https://kr.loccitane.com) 쇼핑몰을 참고하여 제작한 클론 코딩 프로젝트입니다.

- HTML / CSS / Vanilla JavaScript **만으로** 구현한 순수 프론트엔드 프로젝트
- Vite + Tailwind CSS v4로 개발 환경 구축
- 재사용 가능한 **공유 컴포넌트 시스템** 설계
- REST API 연동으로 실제 서비스와 유사한 사용자 경험 구현
- 백엔드(API)는 강사님이 제공, 팀원 2명이 프론트엔드 전체 분담

<br/>

### 유저 시나리오

| 단계 | 흐름                                                                                |
| :--: | ----------------------------------------------------------------------------------- |
|  01  | **회원가입 · 로그인** — 일반/관리자 회원가입, 아이디 로그인, 토큰 관리              |
|  02  | **메인 · 카테고리** — 메인페이지 → 대/중카테고리 → 필터 · 정렬 · 페이지네이션       |
|  03  | **상품 상세** — 이미지 슬라이더 / 별점 · 리뷰 / 옵션 연동 / 리추얼 스텝 / 추천 상품 |
|  04  | **장바구니 · 결제** — 장바구니 → 배송지 → 포인트 적용 → 결제 · 적립                 |
|  05  | **위시리스트 · 마이페이지** — 찜 목록 / 주문내역 · 상세 / 내 리뷰 / 내 정보         |

<br/>

---

<br/>

## 🛠 기술 스택

| 분류          | 기술                                                              |
| ------------- | ----------------------------------------------------------------- |
| **언어**      | HTML5, CSS3, Vanilla JavaScript (ES Modules)                      |
| **빌드 도구** | Vite                                                              |
| **스타일**    | Tailwind CSS v4 (`@tailwindcss/vite` 플러그인, `@theme` CSS 변수) |
| **API 통신**  | REST API (`client.js` 공통 클라이언트)                            |
| **버전 관리** | Git / GitHub (PR 기반 협업 워크플로우)                            |
| **결제**      | 포인트 적용 · 자동 적립 시스템 (자체 구현)                        |

<br/>

---

<br/>

## 👥 팀원 소개

<table>
  <tr>
    <td align="center" width="50%">
      <a href="https://github.com/nana9147">
        <img src="https://github.com/nana9147.png" width="120" style="border-radius:50%" alt="유나"/>
        <br/><br/>
        <b>유나</b>
      </a>
      <br/>
      <a href="mailto:yuna0407@kakao.com">yuna0407@kakao.com</a>
      <br/><br/>
      공통 컴포넌트 (헤더 · 드로어 · 버튼 · 배지/태그 · 상품카드)<br/>
      상품 상세페이지<br/>
      중카테고리 상품 목록<br/>
      장바구니 / 배송지 / 결제<br/>
      위시리스트<br/>
      마이페이지 (주문내역 · 내 리뷰)
    </td>
    <td align="center" width="50%">
      <a href="https://github.com/THLIMM">
        <img src="https://github.com/THLIMM.png" width="120" style="border-radius:50%" alt="태형"/>
        <br/><br/>
        <b>태형</b>
      </a>
      <br/>
      <a href="mailto:dlaxogud1226@naver.com">dlaxogud1226@naver.com</a>
      <br/><br/>
      로그인 / 회원가입 (일반 · 관리자)<br/>
      대카테고리 상품 목록<br/>
      메인페이지<br/>
      마이페이지 (내 정보 조회 · 수정 · 탈퇴)
    </td>
  </tr>
</table>

<br/>

---

<br/>

## 📁 폴더 구조

```
src
├── assets
│   ├── icon              # SVG 아이콘 (장바구니, 별점, 결제 등)
│   ├── images            # 상품·카테고리·메인 이미지 (webp)
│   ├── logo              # L'Occitane 로고
│   └── video             # 메인·리필 영상
│
├── components
│   ├── footer            # footer.js
│   ├── header            # header.js, createNavDrawer.js
│   ├── login-modal       # loginModal.js
│   └── ui                # 공통 UI 컴포넌트
│       ├── badge.js          # 할인율 배지
│       ├── button.js         # variant · size · disabled
│       ├── drawer.js         # 모바일 슬라이드 메뉴
│       ├── imageSlider.js    # 모바일 스와이프 슬라이더
│       ├── modal.js          # 공통 모달
│       ├── pagination.js     # 페이지네이션
│       ├── product-card.js   # 세로 · 수평 레이아웃
│       ├── tag.js            # 카테고리 태그
│       └── ...
│
├── js
│   ├── api               # API 모듈 (auth / cart / product / review / order 등)
│   │   └── client.js         # 공통 fetch 클라이언트
│   ├── constants
│   │   └── routes.js         # 라우팅 경로 상수
│   ├── signupUtils       # 회원가입 공통 로직
│   ├── utils             # 토큰 유효성 검사 등
│   ├── layout.js         # 공통 렌더링 (헤더·푸터·로그인모달)
│   └── main.js           # 전역 진입점
│
├── pages
│   ├── cart              # 장바구니
│   ├── login             # 로그인
│   ├── main              # 메인페이지
│   ├── mypage            # 마이페이지 (주문·리뷰·위시·내정보)
│   │   ├── components        # 각 탭 템플릿
│   │   └── handlers          # 렌더링 핸들러
│   ├── order
│   │   ├── complete          # 주문 완료
│   │   ├── payment           # 결제
│   │   └── shipping          # 배송지
│   ├── product
│   │   ├── category          # 대카테고리 상품 목록
│   │   ├── detail            # 상품 상세
│   │   │   ├── components    # 각 섹션 템플릿
│   │   │   └── handlers      # 리뷰·옵션·별점 등 핸들러
│   │   └── list              # 중카테고리 상품 목록
│   ├── signup            # 회원가입 (일반·관리자)
│   └── wishlist          # 위시리스트
│
└── styles
    └── style.css         # 전역 스타일 (Tailwind 포함)
```

<br/>

---

<br/>

## ✨ 구현 기능

### 🏠 메인/홈

- [ 메인 페이지 주요 기능 작성 ]

---

### 📦 상품 상세 페이지

- 모바일 이미지 슬라이더 / 데스크탑 그리드 레이아웃 (반응형 전환)
- 상품 기본 정보 렌더링 (이름, 가격, 할인율, 할인가)
- 옵션 그룹 연동
  - 동일 옵션 그룹에 속한 상품을 API로 조회해 옵션 버튼으로 렌더링
  - 현재 상품은 선택된 상태(활성)로 표시, 다른 옵션 클릭 시 해당 상품 상세 페이지로 이동
- 수량 선택 및 장바구니 담기 — 데스크탑: 우측 드로어 / 모바일: 하단 드로어로 표시
- 부분 별점 표시 — SVG 이미지 2장 겹쳐 `width: percent%` 인라인으로 처리
- 상품 상세 정보 — `productInfo` 기반으로 사용방법 · 원료 · 상품정보 제공고시 렌더링
- 베스트 리뷰 섹션 — 추천수 상위 리뷰를 별도 섹션으로 표시
- 리뷰 섹션
  - 별점 분포 막대 차트 (1~5점, 비율에 따른 fill bar)
  - 리뷰 카드 2열 그리드, 행 높이 통일(`h-full`)
  - 추천 버튼 (API 응답 `isRecommended`, `recommendCount` 반영)
  - 평점 필터 — 선택한 평점의 리뷰만 표시, 결과 없을 시 안내 메시지 렌더링
  - 페이지네이션 — 페이지 단위로 리뷰 목록 전환
  - 본인 리뷰 수정/삭제 버튼 노출
  - 리뷰 작성 시 200P 자동 지급 / 삭제 시 자동 차감
- 연관 상품 추천 리스트
- 리추얼 스텝 섹션 (단계 배지 + 상품 카드 동적 렌더링)
- JS 모듈 분리: `renderProductMain.js`, `initReviews.js`, `initBestReview.js`, `initRecommendedList.js`, `renderStars.js`

---

### 📋 대카테고리 상품 목록 페이지

- URL `?categoryId=` 파라미터로 카테고리 동적 로딩

---

### 📋 중카테고리 상품 목록 페이지

> 🔗 [loccishop.vercel.app/product/category?slug=hand-cream](https://loccishop.vercel.app/product/category?slug=hand-cream)

- URL `?slug=` 파라미터로 카테고리 동적 로딩
- 서브카테고리 태그 필터 (클릭 시 선택 상태 토글 + 목록 재조회)
- 정렬 기능 (최신순, 인기순, 낮은 가격순)
- 페이지네이션
- 공통 `createProductCard()` 컴포넌트로 카드 렌더링
  - 카드에서 위시리스트 추가/제거 가능 (비로그인 시 로그인 모달 표시)
  - 카드에서 장바구니 담기 — 클릭 시 우측 드로어로 장바구니 표시

---

### 🛒 장바구니 페이지

- 장바구니 → 배송지 → 결제 3단계 스텝 인디케이터
- 상품 목록(좌) + 주문 요약(우) 2열 반응형 레이아웃
- 전체 선택/개별 선택 체크박스
- 수량 조절 (+ / - 버튼) — 변경 시 헤더 장바구니 아이콘 뱃지 수량 실시간 반영

---

### 📍 배송지 선택 페이지

- 장바구니 → 배송지 → 결제 3단계 스텝 인디케이터
- 저장된 배송지 목록 탭 / 새 배송지 입력 탭 전환
  - 기본 배송지 자동 선택, 라디오 버튼으로 배송지 선택
  - 배송지 수정 · 삭제
  - 새 배송지 등록 — 카카오 주소 검색 API 연동, 기본 배송지 설정 가능
  - 배송지 최대 3개까지 등록 제한
- 배송 메모 선택 (드롭다운 + 직접 입력)
- 선택한 배송지 · 배송 메모를 `sessionStorage`에 저장 후 결제 페이지로 이동
- 우측 주문 요약 영역 — 장바구니 상품 목록 토글 · 최종 금액 표시 · 결제하기 버튼

---

### 💳 결제 페이지

- 장바구니 → 배송지 → 결제 3단계 스텝 인디케이터
- 진입 시 장바구니 상품 · 배송지 정보 유효성 검사 (없으면 이전 단계로 리다이렉트)
- 배송지 정보 표시 — `sessionStorage`에서 선택한 배송지 · 배송 메모 불러오기
- 포인트 사용 — 보유 포인트 표시, 100P 단위 적용, 초과 입력 방지
- 결제 수단 선택 (카드 · 카카오페이 등 버튼 선택 방식)
- 우측 주문 요약 영역 — 장바구니 상품 목록 토글 · 포인트 차감 반영 · 최종 금액 표시
- 이용약관 동의 체크 후 결제하기
- 결제 완료 시 주문번호 안내 → 주문 완료 페이지로 이동

---

### 🔐 로그인 / 회원가입

- [ 로그인/회원가입 주요 기능 작성 ]

---

### 👤 마이페이지

- URL `?menu=` 파라미터로 탭 상태 관리 — 새로고침 시에도 현재 탭 유지
- 데스크탑 사이드바 / 모바일 탭 네비게이션 동시 지원

#### 내 정보

- 이름 · 이메일 · 연락처 · 생년월일 · 기본 배송지 표시
- 가입일 · 보유 포인트 요약 카드
- 정보 수정 모달 (이름 · 이메일 · 주소 수정)
- 회원 탈퇴 모달 (비밀번호 확인 후 탈퇴 처리)

#### 주문 내역

- 주문 상태 현황 요약 (결제완료 · 배송중 · 배송완료 · 취소)
- 주문 목록 — 대표 상품 이미지 · 이름 · 금액 · 상태 표시, 페이지네이션
- 주문 상세 — 클릭 시 `?menu=order-detail&id=` 로 이동
  - 주문 취소 (취소 사유 선택 · 직접 입력 모달)
  - 배송 정보 수정 — 결제완료 상태일 때만 표시, 카카오 주소 검색 API 연동
- 배송 완료 시 결제금액의 5% 포인트 자동 적립

#### 내 리뷰

- 주문한 상품의 내 리뷰만 필터링해서 목록 표시
- 리뷰 카드 — 별점 · 제목 · 내용 · 작성일 · 리뷰 이미지
- 리뷰 수정 (기존 리뷰 데이터 불러와서 수정 모달 오픈) · 삭제
- 페이지네이션 (5개 단위)

#### 위시리스트

- 찜한 상품 목록 그리드 표시 — 이름 · 가격 · 품절 여부
- 더보기 버튼으로 추가 로딩 (10개 단위)
- ✕ 버튼으로 위시리스트에서 즉시 제거
- 상품 클릭 시 상품 상세 페이지로 이동

---

<br/>

## ⚡ 핵심 기능

### ① 공유 컴포넌트 시스템

팀 전체가 일관된 UI를 쓸 수 있도록 재사용 가능한 컴포넌트를 설계했습니다.

| 컴포넌트        | 설명                                                                       |
| --------------- | -------------------------------------------------------------------------- |
| **Button**      | variant(primary / ghost / outline) + size + disabled 상태 지원             |
| **Badge / Tag** | 할인율 배지, 카테고리 태그, 동적 색상 처리                                 |
| **ProductCard** | 기본(세로) + 수평 레이아웃, `createProductCard()` 단일 API                 |
| **Drawer**      | 모바일 슬라이드 메뉴, `openDrawer` / `closeDrawer` 외부 이벤트             |
| **Header**      | 전역 네비게이션 · 로그인 상태 분기, 위시리스트 · 장바구니 아이콘 상태 반영 |
| **로그인 모달** | 비로그인 접근 시 공통 모달 표시, 여러 페이지에서 재사용                    |

<br/>

### ② 대카테고리 상품 목록

- 컬렉션 탭 동적 렌더링 — 탭 클릭 시 API 재호출 없이 JS로 동적 전환
- 장바구니 · 찜하기 API 연동 — 비로그인 시 로그인 모달 즉시 표시
- 반응형 레이아웃 — 데스크탑 그리드 → 모바일 단열 레이아웃
- 헤더 햄버거 메뉴 → 카테고리 페이지 링크 연결

<br/>

### ③ 상품 상세 & 포인트 결제

**상품 상세페이지**

- 데스크탑: 이미지 그리드 / 모바일: 스와이프 슬라이더
- 소수점 별점 렌더링 (fractional star rating)
- 옵션 버튼 클릭 시 동일 옵션그룹 상품 페이지로 이동
- 리추얼 스텝 카드 (수평 레이아웃 컴포넌트 재사용)
- 관련 상품 추천 · 리뷰 작성 · 수정 · 삭제

**결제 & 포인트 시스템**

- 포인트 적용 시 전체 금액에서 차감 후 최종 결제
- 배송완료 상태 변경 시 결제금액의 5% 자동 적립
- 장바구니 → 배송지 → 결제 3단계 플로우

```
포인트 계산 예시
결제 50,000원 / 포인트 3,000점 사용
→ 실결제 47,000원 / 배송완료 후 2,350점 적립
```

<br/>

---

<br/>

## 🔧 문제 해결 & 개선

### 버그 수정

#### 1. `discountPrice.toLocaleString()` TypeError (상품 상세)

- **문제**: `discountRate`가 `0`일 때 `discountPrice`가 `null`이 되어 `.toLocaleString()` 호출 시 TypeError 발생
- **원인**: `discountRate === 0`을 falsy로 처리하지 않아 할인 가격 계산 분기가 잘못 동작
- **해결**: `if (discountRate)` falsy 체크로 수정, `discountRate`가 0이면 원가를 그대로 표시

```js
// 수정 전
if (discountRate !== null) { ... }

// 수정 후
if (discountRate) { ... }
```

#### 2. 추천 버튼 상태 불일치 (상품 상세)

- **문제**: 추천 버튼 UI가 초기 로딩 시 API 응답을 반영하지 않고 항상 비활성 상태로 렌더링
- **원인**: 버튼 렌더링 시 `isRecommended`, `recommendCount` 값을 API 응답에서 읽지 않고 하드코딩된 기본값 사용
- **해결**: `fetchProductReviews` 응답에서 `isRecommended`, `recommendCount`를 받아 초기 렌더링에 반영

#### 3. 리뷰 평점 필터 변경 시 기존 목록 미초기화 (상품 상세)

- **문제**: 해당 평점의 리뷰가 없을 경우 기존 목록이 그대로 남아있고, 안내 메시지가 표시되지 않음
- **원인**: 필터 변경 시 API 재호출 전에 리뷰 목록 컨테이너를 초기화하는 처리가 누락됨
- **해결**: 핸들러에서 API 호출 전에 컨테이너를 먼저 비우고, 결과가 없을 경우 안내 메시지를 렌더링하도록 분기 추가

```js
// 수정 전 — 컨테이너 초기화 없이 API만 재호출
filterBtn.addEventListener("click", () => {
  fetchReviews({ rating });
});

// 수정 후 — 호출 전 초기화 + 빈 결과 분기 처리
filterBtn.addEventListener("click", async () => {
  reviewContainer.innerHTML = "";
  const reviews = await fetchReviews({ rating });
  if (reviews.length === 0) {
    reviewContainer.innerHTML = "<p>해당 평점의 리뷰가 없습니다.</p>";
    return;
  }
  reviews.forEach((review) => reviewContainer.append(createReviewCard(review)));
});
```

#### 4. 주문 내역 페이지네이션 다음 페이지 이동 불가 (마이페이지)

- **문제**: 페이지네이션 다음 버튼을 클릭해도 1페이지에서 벗어나지 않음
- **원인**: `onPageChange` 콜백에서 `id`를 누락한 채 `newPage`만 전달해, `renderOrderList(id, page)` 호출 시 `id` 자리에 페이지 번호가 들어가고 `page`는 기본값 `1`로 고정됨
- **해결**: 콜백 내에서 `id`와 `newPage`를 함께 전달하도록 수정

```js
// 수정 전 — id 누락으로 인수 순서 어긋남
onPageChange: (newPage) => {
  renderOrderList(newPage);
};

// 수정 후 — id 명시적으로 함께 전달
onPageChange: (newPage) => {
  renderOrderList(id, newPage);
};
```

#### 5. Vite `/api` 프록시 미설정으로 인한 CORS 에러 (공통)

- **문제**: 로컬 개발 환경에서 API 호출 시 CORS 에러 발생
- **원인**: 브라우저에서 백엔드 서버로 직접 요청 시 cross-origin 차단
- **해결**: `vite.config.js`의 `server.proxy`에 `/api` 경로 등록, API 호출은 `/api/loccishop/v1/...` 상대 경로 사용

```js
// vite.config.js
server: {
  proxy: {
    '/api': 'http://localhost:포트번호'
  }
}
```

#### 6. 배너 데이터 없을 때 캐러셀 오류 (메인)

- **문제**: `buildTrack()` 함수가 빈 배열을 받으면 `slides[slides.length - 1]`에서 `undefined`를 참조해 에러가 발생하고 메인 페이지 자체가 열리지 않을 수 있었음
- **원인**: 배너 API가 빈 배열을 반환하거나 네트워크 오류가 나는 경우에 대한 방어 처리 누락
- **해결**: 슬라이드 개수(0개 / 1개 / 복수)에 따른 조기 종료 분기를 추가하고, `buildTrack()`이 `false`를 반환할 경우 후속 로직이 실행되지 않도록 처리

```js
function buildTrack(newSlides) {
  slides = Array.isArray(newSlides) ? newSlides : [];
  track.innerHTML = "";

  if (slides.length === 0) {
    track.innerHTML = `<div class="...">등록된 배너가 없습니다.</div>`;
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    return false;
  }

  if (slides.length === 1) {
    track.append(createCarouselSlide(slides[0]));
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    return false;
  }

  prevBtn.disabled = false;
  nextBtn.disabled = false;
  track.append(createCarouselSlide(slides[slides.length - 1]));
  slides.forEach((s) => track.append(createCarouselSlide(s)));
  track.append(createCarouselSlide(slides[0]));
  return true;
}
```

#### 7. 캐러셀 슬라이드 innerHTML XSS 취약점 (메인)

- **문제**: `createCarouselSlide()`가 외부 API 응답 값(`imageUrl`, `name`)을 템플릿 리터럴로 `innerHTML`에 그대로 삽입해 XSS 취약점이 발생할 수 있었음
- **원인**: 외부 데이터를 HTML 문자열로 삽입하면 악의적인 값이 스크립트로 해석될 수 있음
- **해결**: `innerHTML` 대신 `createElement`로 요소를 생성하고 속성을 직접 할당하는 방식으로 교체. `??` 연산자로 `undefined`/`null`도 빈 문자열로 안전하게 처리

```js
// 수정 전
el.innerHTML = `
  <figure ...>
    <img src="${imageUrl}" alt="${name}" />
  </figure>
`;

// 수정 후
const figure = document.createElement("figure");
const img = document.createElement("img");
img.src = imageUrl ?? "";
img.alt = name ?? "";
figure.append(img);
el.append(figure);
```

#### 8. 비로그인 상태에서 헤더 아이콘 클릭 시 위시리스트·장바구니 페이지로 이동되는 버그 (헤더)

- **문제**: 비로그인 상태에서 헤더의 위시리스트·장바구니 아이콘을 클릭하면 로그인 모달이 표시되지만, 모달을 닫았을 때 현재 페이지가 아닌 위시리스트·장바구니 페이지에 도착해 있는 버그 발생
- **원인**: 아이콘이 `<a>` 태그로 감싸져 있어 클릭 시 인증 여부 확인 없이 바로 페이지를 이동시켰고, 로그인 모달은 해당 페이지에서 API 401 응답 후에야 뒤늦게 열렸음
- **해결**: `header.js`에서 비로그인 상태일 때 링크의 기본 동작(`e.preventDefault()`)을 막고 로그인 모달을 즉시 표시하도록 처리

```js
// 수정 전 — 인증 확인 없이 <a> 태그로 바로 페이지 이동
// → 위시리스트 페이지에서 API 401 → alert → 모달 (3단계 방해)

// 수정 후
if (!isLoggedIn) {
  wishlistLink.addEventListener("click", (e) => {
    e.preventDefault();
    openLoginModal();
  });
  cartLink.addEventListener("click", (e) => {
    e.preventDefault();
    openLoginModal();
  });
}
```

#### 9. 서브 페이지에서 메인 페이지 전용 API가 불필요하게 호출되는 문제 (공통)

- **문제**: 상품 리스트 페이지 등 서브 페이지 진입 시 메인 페이지 전용 API(`/banners`, `/products` 등) 4개가 불필요하게 호출됨
- **원인**: `main.js`가 `pages/main/index.js` 전체를 import하고 있었고, `main/index.js`에 헤더·푸터 공통 초기화 코드와 메인 전용 API 호출 코드가 혼재해 있어 모든 페이지에서 메인 전용 로직이 함께 실행됨
- **해결**: 공통 초기화 코드만 담은 `src/js/layout.js`를 신규 생성하고, `main.js`의 import 대상을 `layout.js`로 교체. 메인 전용 `index.js`는 루트 `index.html`에서만 직접 로드

```js
// 변경 전
import "/src/pages/main/index.js"; // 공통 + 메인 전용 코드 전부 실행

// 변경 후 — main.js
import "/src/js/layout.js"; // header / footer / loginModal 공통 초기화만

// 루트 index.html에만 추가
// <script type="module" src="/src/pages/main/index.js"></script>
```

---

### 구조 개선

#### 1. index.js 단일 파일 → 역할별 파일 분리

> **Before** — 상품 상세페이지의 모든 로직을 `index.js` 하나에 작성하면 파일이 비대해져 유지보수가 어려울 것이라 예측

> **After** — 기능 단위로 파일을 미리 분리 설계

```
renderProductMain.js   — 상품 기본 정보 렌더링
initReviews.js         — 리뷰 목록 · 작성 · 수정 · 삭제
initOptions.js         — 옵션 버튼 · 수량 · 장바구니 연동
initRelatedProducts.js — 관련 상품 추천
client.js              — 공통 API 클라이언트
```

파일당 단일 책임 원칙 적용 → 버그 발생 위치 즉시 특정 가능

#### 2. 컴포넌트 복사 시도 → 레이아웃 옵션 확장

> **Before** — 리추얼 스텝 영역의 가로 배치를 위해 `createProductCard()`를 통째로 복사하려는 시도 발생

> **After** — 옵션 파라미터로 해결

```js
createProductCard(data, { horizontal: true });
```

코드 중복 없이 단일 함수로 통합 → 리추얼 스텝, 위시리스트, 마이페이지에서 동일 패턴 재사용

#### 3. 리뷰 이미지 미표시 → 2단계 업로드 분리

> **Before** — 이미지와 리뷰 데이터를 한 번의 API 호출로 함께 전송 시도 → 이미지 URL이 없어 렌더링 불가

> **After** — 2단계 호출로 분리

```
① POST /reviews/images         — 이미지 파일 먼저 업로드 → imageUrl 수신
② POST /products/:id/reviews   — 받은 URL을 images 필드에 담아 리뷰 등록
```

#### 4. 중복된 회원가입 로직 → 공통 함수 통합

> **Before** — 일반 · 관리자 회원가입 페이지에 폼 유효성 검사, 에러 표시, API 호출 로직이 중복

> **After** — `createSignupPage()` 함수로 통합, `data-field` 속성으로 필드 조회 방식 통일, `style.display` 제거 후 Tailwind `hidden` 클래스로 전환

#### 5. 토큰 유효성 검사 로직 리팩토링

> **Before** — 만료된 토큰 정리를 위한 `fetchMe()` 호출이 `main.js`에 인라인으로 작성되어 메인 페이지 진입 시에만 동작. 사용자가 장바구니·마이페이지로 직접 접속하면 만료 토큰이 정리되지 않았고, 메인 페이지만 다른 페이지와 다른 실행 패턴(export 후 `main.js`가 대신 실행)을 가짐

> **After** — `src/js/utils/checkTokenValidity.js` 유틸 함수로 분리, login·signup을 제외한 모든 페이지 entry 파일에 동일하게 적용. 메인 페이지도 다른 페이지와 동일하게 본인이 직접 실행하는 패턴으로 통일

```js
// src/js/utils/checkTokenValidity.js
import { fetchMe } from "/src/js/api/auth/index.js";

export function checkTokenValidity() {
  if (localStorage.getItem("token")) {
    fetchMe().catch(() => {}); // 만료 시 서버 401 → token/role/member 자동 제거
  }
}
```

```js
// 각 페이지 entry 파일 (login · signup 제외한 10개 페이지)
import { checkTokenValidity } from "/src/js/utils/checkTokenValidity.js";
checkTokenValidity();
```

```js
// pages/main/index.js — 다른 페이지와 동일한 패턴으로 통일
async function initMainPage() { ... }
checkTokenValidity();
initMainPage().catch((err) => console.error("초기화 실패:", err));

// js/main.js — import만 하면 자동 실행
import "/src/pages/main/index.js";
```

<br/>

---

<br/>

## 🤝 협업 방식

|                            | 내용                                                                   |
| -------------------------- | ---------------------------------------------------------------------- |
| 📋 **이슈 기반 작업 관리** | 모든 작업을 GitHub Issue로 등록, Epic / feat / bug 라벨 분류           |
| 🔀 **PR 코드 리뷰**        | 본인 PR 본인 머지 금지, 팀원 1인 이상 리뷰 후 머지                     |
| 📝 **문서화**              | 절대경로 규칙, 스크립트 위치, 브랜치 삭제 시점 등 CONTRIBUTING.md 명시 |
| 💬 **강사님 소통**         | 총 10회 이상 리뷰 사이클을 거치며 코드 품질 개선                       |

<br/>

---

<br/>

## 📐 협업 규칙

### 📁 브랜치 전략

```
main
  └── develop
        └── feature/#이슈번호-작업내용
```

| 브랜치    | 설명                              |
| --------- | --------------------------------- |
| `main`    | 최종 배포 브랜치 — 직접 push 금지 |
| `develop` | 개발 통합 브랜치                  |
| `feature` | 기능 개발 브랜치                  |

```bash
# 브랜치 이름 예시
feature/#1-epic-product-detail
feature/#6-review
feature/#7-footer
```

<br/>

### ✏️ 커밋 메시지 규칙

```
타입: 작업 내용
```

| 타입       | 설명                                 |
| ---------- | ------------------------------------ |
| `feat`     | 새로운 기능 구현                     |
| `fix`      | 버그 수정                            |
| `style`    | CSS 수정, 코드 포맷 (로직 변경 없음) |
| `refactor` | 코드 리팩토링                        |
| `docs`     | 문서 수정                            |
| `chore`    | 설정, 파일 구조 변경                 |

```bash
# 예시
feat: 리뷰 목록 출력 구현
fix: 모바일 메뉴 닫힘 버그 수정
style: 상품 카드 간격 조정
```

<br/>

### 🏷️ 이슈 라벨

| 라벨      | 색상      | 설명                 |
| --------- | --------- | -------------------- |
| `epic`    | `#8B5CF6` | 큰 단위 작업 묶음    |
| `feature` | `#22C55E` | 새로운 기능 구현     |
| `bug`     | `#EF4444` | 버그 수정            |
| `docs`    | `#F59E0B` | 문서 작업            |
| `chore`   | `#6B7280` | 설정, 파일 구조 변경 |

<br/>

### 🔀 PR 규칙

- `feature` → `develop` 으로만 PR
- PR 제목은 이슈 제목과 동일하게 작성
- 본인 PR 본인 머지 금지 — 팀원 1명 이상 리뷰 후 머지
- PR 본문에 관련 이슈 번호 반드시 연결

```
## 작업 내용
- 리뷰 목록 출력
- 별점 컴포넌트

## 관련 이슈
closes #6
```

<br/>

### ⚙️ 작업 순서

```
1. 이슈 등록
2. 담당자 지정
3. 브랜치 생성 (feature/#이슈번호-작업내용)
4. 작업 후 커밋
5. develop으로 PR
6. 팀원 리뷰
7. 머지 후 브랜치 삭제
```

<br/>

---

<br/>

## 💬 팀원 소감

<table>
  <tr>
    <td width="50%" valign="top">
      <b>유나</b><br/><br/>
      컴포넌트를 어떻게 나눌지 설계하는 과정이 생각보다 재미있었고, 나눠둔 구조 덕분에 문제가 생겼을 때 바로 찾아갈 수 있어서 뿌듯했습니다. 프로젝트가 커질수록 처음 설계가 얼마나 중요한지 자연스럽게 느끼면서, 좋은 설계가 결국 나를 위한 것이라는 걸 배운 프로젝트였습니다.
    </td>
    <td width="50%" valign="top">
      <b>태형</b><br/><br/>
      지금까지 배워온 HTML, CSS, JS를 실제 프로젝트에 활용해볼 수 있는 좋은 기회였고, 팀원과 함께하는 프로젝트였던 만큼 협업 자체가 저에게 큰 경험이자 배움이었습니다.
    </td>
  </tr>
</table>

<br/>

---

<div align="center">

**GitHub** — [github.com/FRONTENDBOOTCAMP-17th/loccishop](https://github.com/FRONTENDBOOTCAMP-17th/loccishop)

FRONTEND BOOTCAMP 17th · 유나 & 태형

</div>
