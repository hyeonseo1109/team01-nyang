import { useQuery } from "@tanstack/react-query";
import api from "./apiClient";
// 덩어리별 코드 순서(목차)
// 1. api 요청 함수
// 2. TanStack Query 훅
// 3. 구조분해할당으로 데이터 꺼내오는 법



// !- - - - 카테고리별 최신 뉴스 헤드라인 및 링크 가져오기 - - - -
export async function getNews(category) {
  const res = await api.get(`/news/${category}`);
  return res.data;
}
export function useNews(category) {
  return useQuery ({
    queryKey: ["news", category],
    queryFn: () => getNews(category),
     staleTime: 1000 * 60 * 5,
    //5분 동안은 캐시가 살아있어서, news를 재호출했을 때 캐시를 불러옴. 
  })
}



// !- - - - 퀴즈 - - - -
export async function getQuiz() {
  const res = await api.get("/quiz");
  return res.data;
}
export function useQuiz() {
  return useQuery ({
    queryKey: ["quiz"],
    queryFn: () => getQuiz(),
    //얘는 매번 랜덤으로 새로 문제 뽑아오게 staleTime: 0 기본값으로 두었음.
  })
}



// !- - - - 브리핑 조회 (morning/evening) - - - - 
export async function getBriefings() {
  const res = await api.get("/briefings");
  return res.data;
}
export function useBriefings() {
  return useQuery({
    queryKey: ["briefings"],
    queryFn: getBriefings,
    staleTime: 1000 * 60 * 5,
    // 브리핑은 아침/저녁에만 바뀌니까 실시간 반영 필요 없음.
  });
}



// !- - - - 일정/할일 요약 대화 - - - - 
export async function getConversations() {
  const res = await api.get("/conversations");
  return res.data;
}
export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: () => getConversations(),
  });
}



// !- - - - 운세 조회 - - - - 
export async function getFortune(params) {
  const res = await api.get("/fortune", { params });
  return res.data;
}
export function useFortune(params) {
  return useQuery({
    queryKey: ["fortune", params],
    queryFn: () => getFortune(params),
    enabled: !!params?.birthday, 
    // 생일이 있을 때만 실행
    // staleTime: 1000 * 60 * 60 * 12,
    // 오늘의 운세는 하루 단위로 바뀌니 12시간을 고민하였으나, 자정이 지날 때 queryClient.invalidateQueries({queryKey: ["fortune"]})을 해줘야 함. (useEffect로 초기화함수를 Timeout 지정해서..)
  });
}


// !- - - - 현재 날씨 조회 - - - - 
export async function getWeather() {
  const res = await api.get("/weather");
  return res.data;
}
export function useWeather() {
  return useQuery({
    queryKey: ["weather"],
    queryFn: getWeather,
    staleTime: 1000 * 60 * 1,
  });
}


// !- - - - 5일 날씨 예보 조회 - - - - 
export async function getWeatherForecast() {
  const res = await api.get("/weather/forecast");
  return res.data;
}
export function useWeatherForecast() {
  return useQuery({
    queryKey: ["weatherForecast"],
    queryFn: getWeatherForecast,
    staleTime: 1000 * 60 * 30,
  });
}
