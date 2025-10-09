export const CITY_NAME_MAP = {
  Seoul: '서울',
  Busan: '부산',
  Incheon: '인천',
  Daegu: '대구',
  Daejeon: '대전',
  Gwangju: '광주',
  Suwon: '수원',
  Masan: '마산',
  Ulsan: '울산',
  Jeju: '제주',
  Changwon: '창원',
  Gimhae: '김해',
  Pohang: '포항',
  Goyang: '고양',
  Sejong: '세종',
  Chuncheon: '춘천',
  Gangneung: '강릉',
  Andong: '안동',
  Yeosu: '여수',
  Mokpo: '목포',
  Gunsan: '군산',
  Cheongju: '청주',
  Jeonju: '전주',
  Gumi: '구미',
};

export function getKoreanCityName(engCity = '') {
  if (!engCity) return '서울';
  const clean = engCity.replace(/[-\s]*(si|City|Special City|Metropolitan City)$/i, '').trim();
  return CITY_NAME_MAP[clean] ?? clean ?? '서울';
}
