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
5. [핵심 기능](#-핵심-기능)
6. [Before & After](#-before--after)
7. [협업 방식](#-협업-방식)
8. [협업 규칙](#-협업-규칙)
9. [팀원 소감](#-팀원-소감)

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

| 단계 | 흐름 |
|:----:|------|
| 01 | **회원가입 · 로그인** — 일반/관리자 회원가입, 이메일 로그인, 토큰 관리 |
| 02 | **메인 · 카테고리** — 메인페이지 → 대/중카테고리 → 필터 · 정렬 · 페이지네이션 |
| 03 | **상품 상세** — 이미지 슬라이더 / 별점 · 리뷰 / 옵션 연동 / 리추얼 스텝 |
| 04 | **장바구니 · 결제** — 장바구니 → 배송지 → 포인트 적용 → 결제 · 적립 |
| 05 | **위시리스트 · 마이페이지** — 찜 목록 / 주문내역 · 상세 / 내 리뷰 / 내 정보 |

<br/>

---

<br/>

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| **언어** | HTML5, CSS3, Vanilla JavaScript (ES Modules) |
| **빌드 도구** | Vite |
| **스타일** | Tailwind CSS v4 (`@tailwindcss/vite` 플러그인, `@theme` CSS 변수) |
| **API 통신** | REST API (`client.js` 공통 클라이언트) |
| **버전 관리** | Git / GitHub (PR 기반 협업 워크플로우) |
| **결제** | 포인트 적용 · 자동 적립 시스템 (자체 구현) |

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

## ⚡ 핵심 기능

### ① 공유 컴포넌트 시스템

팀 전체가 일관된 UI를 쓸 수 있도록 재사용 가능한 컴포넌트를 설계했습니다.

| 컴포넌트 | 설명 |
|----------|------|
| **Button** | variant(primary / ghost / outline) + size + disabled 상태 지원 |
| **Badge / Tag** | 할인율 배지, 카테고리 태그, 동적 색상 처리 |
| **ProductCard** | 기본(세로) + 수평 레이아웃, `createProductCard()` 단일 API |
| **Drawer** | 모바일 슬라이드 메뉴, `openDrawer` / `closeDrawer` 외부 이벤트 |
| **Header** | 전역 네비게이션 · 로그인 상태 분기, 위시리스트 · 장바구니 아이콘 상태 반영 |
| **로그인 모달** | 비로그인 접근 시 공통 모달 표시, 여러 페이지에서 재사용 |

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

## 🔄 Before & After

### ① index.js 단일 파일 → 역할별 파일 분리

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

<br/>

### ② 컴포넌트 복사 시도 → 레이아웃 옵션 확장

> **Before** — 리추얼 스텝 영역의 가로 배치를 위해 `createProductCard()`를 통째로 복사하려는 시도 발생

> **After** — 옵션 파라미터로 해결

```js
createProductCard(data, { horizontal: true })
```

코드 중복 없이 단일 함수로 통합 → 리추얼 스텝, 위시리스트, 마이페이지에서 동일 패턴 재사용

<br/>

### ③ 리뷰 이미지 미표시 → 2단계 업로드 분리

> **Before** — 이미지와 리뷰 데이터를 한 번의 API 호출로 함께 전송 시도 → 이미지 URL이 없어 렌더링 불가

> **After** — 2단계 호출로 분리

```
① POST /reviews/images         — 이미지 파일 먼저 업로드 → imageUrl 수신
② POST /products/:id/reviews   — 받은 URL을 images 필드에 담아 리뷰 등록
```

<br/>

### ④ 중복된 회원가입 로직 → 공통 함수 통합

> **Before** — 일반 · 관리자 회원가입 페이지에 폼 유효성 검사, 에러 표시, API 호출 로직이 중복

> **After** — `createSignupPage()` 함수로 통합, `data-field` 속성으로 필드 조회 방식 통일, `style.display` 제거 후 Tailwind `hidden` 클래스로 전환

<br/>

### ⑤ 불필요 API 호출 → 모듈 분리로 제거

> **Before** — `main.js`가 `main/index.js` 전체를 import해 메인 전용 코드가 모든 페이지에서 실행 → 불필요한 API 4개 호출

> **After** — `layout.js` 신규 생성(공통 코드만 담기) → 리스트 페이지에서 불필요 API 4개 전부 제거

<br/>

---

<br/>

## 🤝 협업 방식

| | 내용 |
|--|------|
| 📋 **이슈 기반 작업 관리** | 모든 작업을 GitHub Issue로 등록, Epic / feat / bug 라벨 분류 |
| 🔀 **PR 코드 리뷰** | 본인 PR 본인 머지 금지, 팀원 1인 이상 리뷰 후 머지 |
| 📝 **문서화** | 절대경로 규칙, 스크립트 위치, 브랜치 삭제 시점 등 CONTRIBUTING.md 명시 |
| 💬 **강사님 소통** | 총 10회 이상 리뷰 사이클을 거치며 코드 품질 개선 |

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

| 브랜치 | 설명 |
|--------|------|
| `main` | 최종 배포 브랜치 — 직접 push 금지 |
| `develop` | 개발 통합 브랜치 |
| `feature` | 기능 개발 브랜치 |

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

| 타입 | 설명 |
|------|------|
| `feat` | 새로운 기능 구현 |
| `fix` | 버그 수정 |
| `style` | CSS 수정, 코드 포맷 (로직 변경 없음) |
| `refactor` | 코드 리팩토링 |
| `docs` | 문서 수정 |
| `chore` | 설정, 파일 구조 변경 |

```bash
# 예시
feat: 리뷰 목록 출력 구현
fix: 모바일 메뉴 닫힘 버그 수정
style: 상품 카드 간격 조정
```

<br/>

### 🏷️ 이슈 라벨

| 라벨 | 색상 | 설명 |
|------|------|------|
| `epic` | `#8B5CF6` | 큰 단위 작업 묶음 |
| `feature` | `#22C55E` | 새로운 기능 구현 |
| `bug` | `#EF4444` | 버그 수정 |
| `docs` | `#F59E0B` | 문서 작업 |
| `chore` | `#6B7280` | 설정, 파일 구조 변경 |

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
