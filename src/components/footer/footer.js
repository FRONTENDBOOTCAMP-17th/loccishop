export function renderFooter() {
  const footer = document.createElement("footer");
  footer.className =
    "w-full bg-spring-wood pt-10 pb-8 border-t border-gray-200";

  footer.innerHTML = `
    <address class="text-center text-[11px] text-gray-500 leading-relaxed px-6 md:px-12 not-italic">
      <p class="mb-4 wrap-break-word opacity-80">
        상호: 록시땅코리아 유한책임회사 | 사업자 등록 번호 : 211-87-74234(사업자 정보 확인) | 대표자 : 안드레조셉호프만 | 주소 : 서울특별시 강남구 테헤란로 87길 36(삼성동) 도심공항타워 21층(06164)<br />
        대표전화 : (02)2054-0500 | 대표메일 : LOCCITANE@LOCCITANE.CO.KR | 결제관련문의 : 1588-4954 | 주문관련문의 : (02)2054-0500 | 통신판매번호 : 2008-서울강남-0844 | 호스팅 서비스 제공 : AWS
      </p>
      <small class="font-medium tracking-widest text-gray-400 mt-2 block">
        L'OCCITANE EN PROVENCE © COPYRIGHT 2026
      </small>
    </address>
  `;

  return footer;
}
