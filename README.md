# 오늘의 조각 (AI Secretary)
AI를 활용한 개인 비서 웹 애플리케이션


## 프로젝트 소개
'오늘의 조각'은 일상 생활에 필요한 다양한 정보를 한눈에 볼 수 있는 개인 비서 웹 애플리케이션입니다. 
일반적인 CRUD 기능만 제공하는 다른 앱들과 차별점을 두기 위해, AI 요약과 브리핑, 날씨, 뉴스 등의 기능을 추가하였으며
날씨, 뉴스, 일정, 투두리스트 등을 통합적으로 관리할 수 있습니다.

다이어리 기반으로 일정과 할일을 관리할 수 있고,
위치 기반 서비스와 외부 API를 연동하여 날씨와 뉴스, 퀴즈 등의 기능을 이용할 수 있습니다.
또한, Gemini API를 활용하여 일정 요약, 하루3회 브리핑, 오늘의운세를 제공합니다.



## 기술 스택
### Frontend
- **React** 19.1.1 / **Vite** 7.1.2
- 스타일링 - **Tailwind** CSS 4.1.13
- 전역 상태 관리 - **Zustand** 5.0.8
- 서버 상태 관리 - **TanStack Query**

### Backend
- **Phython** 3.13 + **FastAPI**
- DB - **PostgreSQL** + **Tortoise ORM**
- Infra - **Docker Compose** (API, DB, Redis, PgAdmin 통합 관리)
- CI/CD - **GitHub Actions** (Mypy 타입 검사, 코드 품질 체크)
- 외부 API - OpenWeather, Gemini, RSS(Naver), AWS S3
- 기타: Redis(토큰 블랙리스트), Excel 기반 퀴즈 데이터


================================



#### 시작하기

##### 필수 조건
- Node.js 20.19.0 이상 또는 22.12.0 이상
- npm 8.0.0 이상

##### 설치
<저장소 클론>
git clone https://github.com/oz-union-fe-12-team1/oz-union-fe-12-team1

<프로젝트 디렉토리로 이동>
cd oz-union-fe-12-team1

<의존성 설치>
npm install

<환경 변수 설정>
.env 파일을 생성하고 다음 변수들을 설정하세요.
ex: VITE_API_BASE_URL=your_api_base_url

<개발 서버 실행>
npm run dev
개발 서버가 http://localhost:5173에서 실행됩니다.

<빌드>
- 프로덕션 빌드
npm run build

- 빌드 미리보기
npm run preview


## 프로젝트 구조
<pre>
oz-union-fe-12-team1/
├── public/              # 정적 파일
├── src/
│   ├── api/            # API 호출 함수
│   │   ├── client.js   # Axios 인스턴스
│   │   ├── auth.js     # 인증 관련 API
│   │   ├── users.js    # 사용자 관련 API
│   │   └── presignedURL.js  # S3 업로드 API
│   ├── components/     # React 컴포넌트
│   │   ├── Mypage/    # 마이페이지 컴포넌트
│   │   ├── adminPage/ # 관리자 페이지 컴포넌트
│   │   ├── weather/   # 날씨 컴포넌트
│   │   └── ui/        # 공통 UI 컴포넌트
│   ├── store/          # Zustand 스토어
│   ├── App.jsx         # 메인 앱 컴포넌트
│   ├── main.jsx        # 앱 엔트리포인트
│   └── index.css       # 글로벌 스타일
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
</pre>


================================



## 주요 기능

### 사용자 기능
- **소셜 로그인** - 구글 OAuth 인증
- **일반 회원가입**
- **프로필 관리** - 닉네임, 생년월일, 프로필 이미지 수정
- **날씨 정보** - 오늘 날씨 및 5일 날씨 예보
- **오늘의 운세** - 매일 업데이트되는 운세
- **뉴스 브리핑** - 최신 뉴스 요약
- **투두리스트** - 할 일 관리
- **일정 관리** - 개인 일정 등록 및 관리
- **퀴즈** - 일일 퀴즈 풀이

### 관리자 기능
- **유저 가입 차트** - 사용자 통계 및 가입 현황
- **회원 관리** - 전체 회원 조회 및 유저 검색
- **문의 관리** - 사용자 문의 확인 및 답변



================================



## 주요 기술 구현
### S3 Presigned URL 이미지 업로드
- 프로필 이미지 업로드 시 서버 부하를 줄이기 위해 Presigned URL 방식을 사용합니다:

백엔드에서 Presigned URL 발급
프론트엔드에서 S3로 직접 업로드
업로드 완료 후 DB에 이미지 URL 저장


### 상태 관리
Zustand: 전역 상태 관리 (사용자 정보, UI 상태)
TanStack Query: 서버 데이터 캐싱 및 동기화

### 인증 처리
JWT 토큰 기반 인증
Axios 인터셉터를 통한 자동 토큰 갱신
보호된 라우트 구현

### 보안
HTTPS 통신
CSRF 토큰 검증
XSS 방지
민감 정보 환경 변수 관리
Presigned URL 유효시간 제한 (1시간)



================================



### 라이선스
This project is licensed under the MIT License


## 팀원
- **프론트엔드**
  - 민현서
  - 정승윤
  - 양은지
  - 김현진
  - 이은정

- **백엔드**
  - 안현기
  - 박연우


## 문의
프로젝트에 대한 문의사항이 있으시면 이슈를 등록해주세요.
