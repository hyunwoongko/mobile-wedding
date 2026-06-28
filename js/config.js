const CONFIG = {
  groom: {
    lastName: "고",
    firstName: "현웅",
    fullName: "고현웅",
    nameEn: "Ko Hyun Woong",
    fatherName: "고성주",
    motherName: "박명옥",
    role: "장남",
  },

  bride: {
    lastName: "박",
    firstName: "세은",
    fullName: "박세은",
    nameEn: "Park Se Eun",
    fatherName: "박정호",
    fatherDeceased: true,
    motherName: "임순주",
    role: "장녀",
  },

  wedding: {
    date: "2026-08-22",
    time: "14:00",
    displayDate: "2026.08.22. SAT",
    displayTime: "2:00PM",
  },

  venue: {
    name: "르비르모어",
    hall: "선릉",
    fullAddress: "서울시 강남구 테헤란로 406 A동 (대치동, 샹제리제센터)",
    shortAddress: "서울시 강남구 테헤란로 406",
    lat: 37.5045,
    lng: 127.0490,
    phone: "02-501-7000",
  },

  accounts: {
    groom: [
      { bank: "국민은행", account: "000000-00-000000", holder: "고성주" },
      { bank: "카카오뱅크", account: "0000-00-0000000", holder: "고현웅" },
    ],
    bride: [
      { bank: "국민은행", account: "000000-00-000000", holder: "임순주" },
      { bank: "카카오뱅크", account: "0000-00-0000000", holder: "박세은" },
    ],
  },

  kakao: {
    jsKey: "YOUR_KAKAO_JS_KEY",
    shareTitle: "고현웅 ♥ 박세은 결혼합니다",
    shareDescription: "2026년 8월 22일 토요일 오후 2시\n르비르모어 (선릉)",
  },

  music: {
    enabled: true,
    src: "music/bgm.mp3",
  },
};
