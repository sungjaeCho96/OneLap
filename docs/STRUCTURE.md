# OneLap — 프로젝트 구조 안내

> 모터스포츠 입문자를 위한 가이드 서비스. Next.js 15 App Router 기반.

---

## 폴더 구조

```
onelap/
├── docs/                          # 프로젝트 문서
│   ├── STRUCTURE.md               # 이 파일
│   └── design-handoff/            # 디자인 핸드오프 HTML 파일
│
├── public/
│   └── images/
│       └── f1/                    # F1 드라이버·팀 이미지 (avif/webp)
│
├── src/
│   ├── app/                       # Next.js App Router (라우팅만 담당)
│   │   ├── layout.tsx             # 전역 레이아웃
│   │   ├── page.tsx               # 홈 (/)
│   │   └── guide/
│   │       ├── [series]/          # WRC·슈퍼레이스·N페스티벌 공통 가이드 페이지
│   │       │   └── page.tsx
│   │       ├── f1/                # F1 전용 상세 가이드 페이지
│   │       │   └── page.tsx
│   │       └── wec/               # WEC 전용 상세 가이드 페이지
│   │           └── page.tsx
│   │
│   ├── features/                  # 종목별 기능 모듈
│   │   └── f1/
│   │       ├── api.ts             # OpenF1 API 호출 (경기 일정, 드라이버 스탠딩)
│   │       └── components/        # F1 가이드 전용 인터랙티브 컴포넌트
│   │           ├── DriverGallery.tsx   # 22명 드라이버 카드 + 모달
│   │           ├── FlagQuiz.tsx        # 플래그 퀴즈 (11문항)
│   │           ├── TeamShowcase.tsx    # 11개 팀 인터랙티브 소개
│   │           ├── TimingTower.tsx     # 라이브 타이밍 보드 위젯
│   │           └── TireSimulator.tsx   # 타이어 전략 시뮬레이터
│   │
│   ├── components/                # 앱 전역 공통 컴포넌트
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Logo.tsx
│   │   ├── HeroSection.tsx
│   │   ├── ScheduleSection.tsx
│   │   ├── SeriesGuideSection.tsx
│   │   ├── NewsSection.tsx
│   │   └── CountdownTimer.tsx
│   │
│   ├── lib/                       # 공통 유틸리티 및 데이터
│   │   ├── data.ts                # SERIES 상수, buildSchedule, buildNews
│   │   └── sports/                # 종목별 정적 데이터
│   │       ├── wecData.ts         # WEC 2026 경기 일정
│   │       ├── wrcData.ts         # WRC 2026 경기 일정
│   │       ├── superraceData.ts   # 슈퍼레이스 2026 경기 일정
│   │       ├── nfestivalData.ts   # 현대 N 페스티벌 2026 경기 일정
│   │       └── seriesGuideData.ts # 모든 종목의 입문 가이드 콘텐츠
│   │
│   └── types/
│       └── index.ts               # 공유 TypeScript 타입 정의
│
├── .gitignore
├── next.config.ts
├── package.json
├── pnpm-lock.yaml                 # 패키지 매니저: pnpm 사용 (npm 사용 금지)
├── tailwind.config.ts
└── tsconfig.json
```

---

## 핵심 규칙

### 패키지 매니저
- **pnpm만 사용.** `npm install` 대신 `pnpm install` 사용.
- `package-lock.json`은 `.gitignore`에 포함되어 있음.

### 파일 배치 기준

| 위치 | 넣는 것 |
|---|---|
| `src/app/` | 라우팅 파일만 (`page.tsx`, `layout.tsx`). 비즈니스 로직·컴포넌트 X |
| `src/features/{sport}/` | 해당 종목에만 쓰이는 컴포넌트·API |
| `src/components/` | 두 곳 이상에서 쓰이는 공통 컴포넌트 |
| `src/lib/sports/` | 경기 일정·팀·가이드 등 정적 데이터 파일 |
| `src/lib/` (루트) | 여러 종목에 걸친 유틸리티 함수 |
| `src/types/` | 공유 TypeScript 타입 |

### 새 종목 추가 시
1. `src/features/{sport}/` 폴더 생성
2. 종목 전용 컴포넌트는 `src/features/{sport}/components/` 에
3. 정적 데이터는 `src/lib/sports/{sport}Data.ts` 에
4. `src/lib/data.ts`의 `SERIES` 배열에 항목 추가

---

## 주요 데이터 흐름

```
OpenF1 API (외부)
    └─ src/features/f1/api.ts      ← fetchF1Races, fetchF1DriverStandings
           └─ src/app/**/page.tsx  ← 서버 컴포넌트에서 fetch (revalidate: 3600)
                  └─ src/features/f1/components/  ← 클라이언트 컴포넌트에 props로 전달

src/lib/sports/*Data.ts (정적)
    └─ src/lib/data.ts             ← buildSchedule로 통합 정렬
           └─ src/app/**/page.tsx
```

---

## 개발 시작

```bash
pnpm install
pnpm dev
```

빌드 확인:
```bash
pnpm build
```
