export function getInfoTemplate() {
  return `
    <section aria-labelledby="info-summary-heading" class="bg-white-solid rounded-sm border border-cararra p-10 shadow-sm flex justify-between items-center mb-8">
      <div class="space-y-5">
        <div class="flex items-center gap-2">
          <span class="bg-merino text-ferra text-[10px] font-bold px-2 py-0.5 border border-ferra/20 tracking-widest">
            GOLD 회원
          </span>
        </div>
        <hgroup>
          <h3 id="info-summary-heading" class="text-3xl font-light text-dark-woody tracking-tight">
            홍길동님
          </h3>
          <p class="text-empress/70 text-sm mt-1 font-light" id="info-summary-email">
            hong@naver.com
          </p>
        </hgroup>
        <p class="text-empress/50 text-[11px] pt-2 border-t border-cararra inline-block tracking-tighter" id="info-summary-join-date">
          가입일 : 2026-04-16
        </p>
      </div>

      <div class="text-right">
        <dl>
          <dt class="text-[11px] text-empress uppercase tracking-[0.2em] mb-2 font-medium">
            사용 가능한 포인트
          </dt>
          <dd class="text-4xl font-light text-dark-woody tracking-tighter" id="info-summary-point">
            15,000 <span class="text-lg ml-0.5 text-ferra font-normal">P</span>
          </dd>
        </dl>
      </div>
    </section>

    <section aria-labelledby="info-settings-heading" class="bg-white-solid rounded-sm border border-cararra shadow-sm overflow-hidden">
      <header class="px-8 py-6 border-b border-cararra flex justify-between items-center bg-spring-wood/30">
        <h4 id="info-settings-heading" class="text-base font-medium text-dark-woody tracking-tight">
          개인정보 설정
        </h4>
        <button
          type="button"
          class="px-5 py-2 bg-white text-dark-woody border border-cararra text-xs hover:bg-dark-woody hover:text-white transition-all duration-300 shadow-sm"
        >
          정보 수정하기
        </button>
      </header>

      <div class="p-10">
        <dl class="grid grid-cols-2 gap-x-16 gap-y-12">
          <div class="group border-b border-cararra/60 pb-5">
            <dt class="text-[11px] text-empress/60 mb-3 tracking-widest font-bold">이름</dt>
            <dd class="text-sm text-dark-woody font-medium" id="info-detail-name"></dd>
          </div>

          <div class="group border-b border-cararra/60 pb-5">
            <dt class="text-[11px] text-empress/60 mb-3 tracking-widest font-bold">이메일 주소</dt>
            <dd class="text-sm text-dark-woody font-medium" id="info-detail-email"></dd>
          </div>

          <div class="group border-b border-cararra/60 pb-5">
            <dt class="text-[11px] text-empress/60 mb-3 tracking-widest font-bold">휴대폰 번호</dt>
            <dd class="text-sm text-dark-woody font-medium" id="info-detail-phone"></dd>
          </div>

          <div class="group border-b border-cararra/60 pb-5">
            <dt class="text-[11px] text-empress/60 mb-3 tracking-widest font-bold">생년월일</dt>
            <dd class="text-sm text-dark-woody font-medium" id="info-detail-birth"></dd>
          </div>

          <div class="col-span-2 group border-b border-cararra/60 pb-5">
            <dt class="text-[11px] text-empress/60 mb-3 tracking-widest font-bold">기본 배송지</dt>
            <dd class="text-sm text-dark-woody font-medium leading-relaxed" id="info-detail-address"></dd>
          </div>
        </dl>

        <div class="pt-8 flex justify-end" id="withdrawal-container">
          <button
            type="button"
            class="text-[11px] text-empress/40 hover:text-ferra transition-colors tracking-tighter underline underline-offset-4"
          >
            서비스 탈퇴를 원하시나요?
          </button>
        </div>
      </div>
    </section>
  `;
}
