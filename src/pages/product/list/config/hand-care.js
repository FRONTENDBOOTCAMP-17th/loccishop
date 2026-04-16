export default {
  parentCategoryId: 1,
  productCategoryId: 2,
  hero: {
    image: '/src/assets/images/handcareHero.webp',
    title: '핸드 케어',
  },
  description:
    '이 핸드 크림은 20% 시어 버터를 함유해 손에 깊은 영양과 보습을 선사하며 피부 장벽을 강화해 줍니다. 96% 천연 유래 지수*의 시어 핸드 크림은 리치한 텍스처지만 빠르게 흡수되며, 건조한 손을 눈에 띄게 부드럽고 매끈하게 변화시켜 줍니다. 96% 천연 유래 지수* | 실리콘 무첨가 *ISO 16128 가이드라인에 따라 계산한 지수임',
  categoryTagLabels: [
    '핸드 케어 전체 보기',
    '핸드 크림',
    '핸드 워시 & 솝',
    '핸드 & 네일 케어',
    '핸드 케어 리필',
    '핸드 케어 기프트 세트',
  ],
  collection: {
    title: '핸드 크림 컬렉션',
    tabs: ['시어 버터', '아몬드', '로즈'],
    tabKeywords: {
      '시어 버터': ['시어'],
      '아몬드': ['아몬드'],
      '로즈': ['로즈'],
    },
  },
  featured: {
    image: '/src/assets/images/handcare_1.webp',
    alt: '아이코닉 시어 버터 핸드 크림',
    title: '아이코닉 시어 버터 핸드 크림',
    href: '/',
    descriptions: [
      '메종 록시땅의 문화적 헤리티지와 장인 정신을 담아 <br />새롭게 탄생한 록시땅 시어 버터 핸드 크림을 만나보세요.',
      '아이코닉한 페인트 튜브 디자인의 시어 버터 핸드 크림은<br />1993년부터 편안함과 따뜻함의 순간을 만들어왔습니다.<br />20%의 시어 버터가 담긴 풍부한 포뮬라는 벨벳처럼<br />부드러운 텍스처를 완성해 수많은 손을 위로하고 보호해왔습니다.<br />피부를 깊이 영양하고 진정시킬 뿐 아니라,<br />외부 자극으로부터 피부를 지켜주며<br />자연스러운 보호막을 되살려줍니다.',
    ],
  },
  ritual: {
    title: '감각적인 핸드 케어 리추얼',
    steps: [
      {
        image: '/src/assets/images/list_step1.webp',
        alt: '핸드 케어 step1',
        title: 'STEP 1',
        description: '리퀴드 핸드 솝으로 부드럽게 마사지하며 클렌징 후 깨끗이 행궈주세요.',
      },
      {
        image: '/src/assets/images/list_step2.webp',
        alt: '핸드 케어 step2',
        title: 'STEP 2',
        description: '핸드 크림을 손에 넉넉히 덜어 손바닥과 손등, 손톱, 큐티클까지 부드럽게 마사지 해주세요.',
      },
      {
        image: '/src/assets/images/list_step3.webp',
        alt: '핸드 케어 step3',
        title: 'STEP 3',
        description: '건강하고 윤기있는 손톱을 위해 네일 & 큐티클 오일을 발라 마지막 광채까지 완성하세요.',
      },
    ],
  },
  categoryCards: [
    {
      image: '/src/assets/images/list_handcream.webp',
      alt: '핸드 크림',
      label: '핸드 크림',
      liClass: 'md:col-span-2 odd:pt-9 md:odd:pt-0',
    },
    {
      image: '/src/assets/images/list_handwash&soap.webp',
      alt: '핸드 워시 & 솝',
      label: '핸드 워시 & 솝',
      liClass: 'md:col-span-2 odd:pt-9 md:odd:pt-0',
    },
    {
      image: '/src/assets/images/list_hand&nailcare.webp',
      alt: '핸드 & 네일 케어',
      label: '핸드 & 네일 케어',
      liClass: 'md:col-span-2 odd:pt-9 md:odd:pt-0',
    },
    {
      image: '/src/assets/images/list_handcarerefill.webp',
      alt: '핸드 케어 리필',
      label: '핸드 케어 리필',
      liClass: 'md:col-span-2 md:col-start-2 odd:pt-9 md:odd:pt-0',
    },
    {
      image: '/src/assets/images/list_handcaregift.webp',
      alt: '핸드 케어 기프트',
      label: '핸드 케어 기프트',
      liClass: 'md:col-span-2 md:col-start-4 odd:pt-9 md:odd:pt-0',
    },
  ],
};
