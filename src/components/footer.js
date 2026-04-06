export const footerComponent = () =>
  html`<footer
    class="w-full bg-header-footer pt-16 pb-8 border-t box-border border-gray-200 mx-auto"
  >
    <div class="max-w-360 mx-auto px-10">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div class="flex flex-col gap-5">
          <h3 class="text-1.4rem font-bold uppercase">
            Maison L'occitane en Provence
          </h3>
          <ul class="flex flex-col gap-3 text-[13px] text-gray-700">
            <li class="hover:underline cursor-pointer">록시땅 소개</li>
            <li class="hover:underline cursor-pointer">
              록시땅 멤버십 프로그램
            </li>
            <li class="hover:underline cursor-pointer">록시땅의 6가지 약속</li>
            <li class="hover:underline cursor-pointer">스파 록시땅</li>
          </ul>
        </div>

        <div class="flex flex-col gap-5">
          <h3 class="text-1.4rem font-bold">고객 지원</h3>
          <ul class="flex flex-col gap-3 text-[13px] text-gray-700">
            <li class="hover:underline cursor-pointer">이용약관</li>
            <li class="hover:underline cursor-pointer">개인정보처리방침</li>
            <li class="hover:underline cursor-pointer">
              영상정보처리기기 운영 및 관리 방침
            </li>
            <li class="hover:underline cursor-pointer">온라인 문의</li>
            <li class="hover:underline cursor-pointer">자주하는 질문</li>
            <li class="hover:underline cursor-pointer">결제 안내</li>
            <li class="hover:underline cursor-pointer">교환 & 반품 안내</li>
          </ul>
        </div>

        <div class="flex flex-col gap-5">
          <h3 class="text-1.4rem font-bold">기업 구매 문의</h3>
          <ul class="flex flex-col gap-3 text-[13px] text-gray-700">
            <li class="hover:underline cursor-pointer">기업 선물 문의</li>
            <li class="hover:underline cursor-pointer">호텔 어메니티 문의</li>
            <li class="hover:underline cursor-pointer">보안 정책</li>
          </ul>
        </div>

        <div class="flex flex-col gap-5">
          <h3 class="text-1.4rem font-bold">소셜 미디어</h3>
          <ul class="flex flex-col gap-3 text-[13px] text-gray-700">
            <li class="flex items-center gap-2 hover:underline cursor-pointer">
              <img src="/src/assets/icon/Instagram.svg" alt="" /> Instagram
            </li>
            <li class="flex items-center gap-2 hover:underline cursor-pointer">
              <img src="/src/assets/icon/KakaoTalk.svg" alt="" /> Kakaotalk
            </li>
            <li class="flex items-center gap-2 hover:underline cursor-pointer">
              <img src="/src/assets/icon/Youtube.svg" alt="" /> Youtube
            </li>
          </ul>
          <img
            src="/src/assets/logo/B-Corp-Logo-Black-RGB.svg"
            class="w-10 h-auto aspect-auto px-0"
            alt=""
          />
        </div>
      </div>

      <div
        class="py-6 mb-8 flex flex-wrap justify-between items-center gap-4 text-[12px] font-medium text-gray-600"
      >
        <div class="flex gap-6 shrink-0">
          <span class="hover:underline cursor-pointer">이용약관</span>
          <span class="hover:underline cursor-pointer font-bold"
            >개인정보처리방침</span
          >
        </div>
        <img
          src="/src/assets/logo/Loccitane.svg"
          class="w-40 h-auto aspect-auto"
          alt=""
        />
        <div class="flex flex-wrap gap-4">
          <span class="flex items-center gap-1 hover:underline cursor-pointer"
            >매장 찾기</span
          >
          <span class="hover:underline cursor-pointer"
            >록시땅 프로방스 국가/도시 변경</span
          >
        </div>
      </div>

      <div class="text-center text-[12px] text-gray-500 leading-relaxed">
        <p class="mb-4 break-words">
          상호: 록시땅코리아 유한책임회사 | 사업자 등록 번호 :
          211-87-74234(사업자 정보 확인) | 대표자 : 안드레조셉호프만 | 주소 :
          서울특별시 강남구 테헤란로 87길 36(삼성동) 도심공항타워 21층(06164)<br />
          대표전화 : (02)2054-0500 | 대표메일 : LOCCITANE@LOCCITANE.CO.KR |
          결제관련문의 : 1588-4954 | 주문관련문의 : (02)2054-0500 | 통신판매번호
          : 2008-서울강남-0844 | 호스팅 서비스 제공 : AWS
        </p>
        <p class="font-medium tracking-wider text-gray-400">
          L'OCCITANE EN PROVENCE © COPYRIGHT 2026
        </p>
      </div>
    </div>
  </footer>`;
