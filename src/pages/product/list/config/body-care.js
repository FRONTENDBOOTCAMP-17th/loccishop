// 바디케어 이미지가 생기면 image 경로를 교체해주세요.
// parentCategoryId, productCategoryId는 API 카테고리 ID 확인 후 수정해주세요.
export default {
  parentCategoryId: 2,
  parentSlug: 'body-care',
  productCategoryId: 3,
  hero: {
    image: "/src/assets/images/handcareHero.webp", // TODO: 바디케어 히어로 이미지로 교체
    title: "바디 케어",
  },
  description:
    "록시땅의 바디 케어 제품들은 순수한 자연 성분을 사용하며 록시땅만의 전통적인 방식을 고수하여 만들어졌습니다. 바쁜 일상 속 리프레시와 바디 릴렉싱을 도와줄 바디 케어 제품들을 선택해 보세요.",
  categoryTagLabels: ["바디 케어 전체 보기"],
  collection: {
    title: "바디 케어 컬렉션",
    tabs: ["시어 버터", "아몬드", "로즈"],
    tabKeywords: {
      "시어 버터": ["시어"],
      아몬드: ["아몬드"],
      로즈: ["로즈"],
    },
  },
  featured: {
    image: "/src/assets/images/bodycare_1.webp", // TODO: 바디케어 대표 이미지로 교체
    alt: "일상을 채우는 지속 가능한 즐거움",
    title: "일상을 채우는 지속 가능한 즐거움",
    href: "/",
    descriptions: [
      "가장 사랑받는 제품들을 리필로 만나보세요.",
      "일회용 플라스틱 사용을 줄이고 패키지에 새로운 생명을 불어넣는 이 작은 제스처는, 나와 지구를 모두 아름답게 가꾸는 진심 어린 약속이 됩니다.",
    ],
  },
  ritual: {
    title: "감각적인 바디 케어 리추얼",
    steps: [
      {
        image: "/src/assets/images/list_step1.webp", // TODO: 바디케어 스텝 이미지로 교체
        alt: "바디 케어 step1",
        title: "STEP 1",
        description:
          "바디 스크럽으로 부드럽게 마사지하며 각질을 제거하고 깨끗이 행궈주세요.",
      },
      {
        image: "/src/assets/images/list_step2.webp", // TODO: 바디케어 스텝 이미지로 교체
        alt: "바디 케어 step2",
        title: "STEP 2",
        description:
          "샤워 후 물기가 있는 상태에서 바디 오일을 발라 흡수를 높여주세요.",
      },
      {
        image: "/src/assets/images/list_step3.webp", // TODO: 바디케어 스텝 이미지로 교체
        alt: "바디 케어 step3",
        title: "STEP 3",
        description:
          "바디 크림을 전신에 골고루 바르며 마사지하여 하루 종일 촉촉한 피부를 완성하세요.",
      },
    ],
  },
  categoryCards: [
    {
      image: "/src/assets/images/list_handcream.webp", // TODO: 교체
      alt: "바디 워시 & 스크럽",
      label: "바디 워시 & 스크럽",
      liClass: "md:col-span-2 odd:pt-9 md:odd:pt-0",
    },
    {
      image: "/src/assets/images/list_handwash&soap.webp", // TODO: 교체
      alt: "헤어 & 바디 미스트",
      label: "헤어 & 바디 미스트",
      liClass: "md:col-span-2 odd:pt-9 md:odd:pt-0",
    },
    {
      image: "/src/assets/images/list_hand&nailcare.webp", // TODO: 교체
      alt: "바디 오일 & 세럼",
      label: "바디 오일 & 세럼",
      liClass: "md:col-span-2 odd:pt-9 md:odd:pt-0",
    },
    {
      image: "/src/assets/images/list_handcarerefill.webp", // TODO: 교체
      alt: "고체 솝",
      label: "고체 솝",
      liClass: "md:col-span-2 md:col-start-2 odd:pt-9 md:odd:pt-0",
    },
    {
      image: "/src/assets/images/list_handcaregift.webp", // TODO: 교체
      alt: "기프트 세트",
      label: "기프트 세트",
      liClass: "md:col-span-2 md:col-start-4 odd:pt-9 md:odd:pt-0",
    },
  ],
};
