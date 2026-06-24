# OneLap

모터스포츠를 처음 접하는 사람을 위한 입문 가이드 서비스.  
F1·WEC·WRC·슈퍼레이스·현대 N 페스티벌 — 다섯 종목의 일정, 규칙, 팀·드라이버 정보를 한 곳에서 제공한다.

---

## 주요 기능

**홈 (`/`)**
- 진행 중·예정 경기 통합 일정 (5개 종목 합산, 실시간 Live 표시)
- 종목 소개 카드 및 뉴스 섹션

**F1 입문 가이드 (`/guide/f1`)**
- 라이브 드라이버 스탠딩 타이밍 보드 위젯
- 타이어 전략 시뮬레이터 (소프트·미디엄·하드 조합 체험)
- 플래그 퀴즈 (11가지 플래그 학습)
- 2026 팀 인터랙티브 소개 (11팀)
- 2026 드라이버 갤러리 (22명 모달)

**WEC 입문 가이드 (`/guide/wec`)**
- 24시간 르망 다이얼 위젯
- 하이퍼카·LMGT3 클래스 설명, 용어집

**종목별 공통 가이드 (`/guide/[series]`)**
- WRC·슈퍼레이스·현대 N 페스티벌 — 개요, 용어집, 시청 가이드, FAQ

---

## 기술 스택

| 항목 | 내용 |
|---|---|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS + inline style |
| 패키지 매니저 | pnpm |
| 외부 API | [OpenF1](https://openf1.org) (경기 일정·세션), [Jolpi Ergast](https://api.jolpi.ca/ergast) (드라이버 스탠딩) |

---

## 시작하기

### 요구 사항

- Node.js 20+
- pnpm (`npm install -g pnpm`)

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행 (http://localhost:3000)
pnpm dev
```

### 빌드

```bash
pnpm build
pnpm start
```

### 린트

```bash
pnpm lint
```

> **주의** `npm install`을 실행하면 `package-lock.json`이 생성됩니다. 이 프로젝트는 pnpm만 사용하므로 `pnpm install`만 사용하세요.

---

## 환경 변수

별도의 API 키 없이 동작합니다. OpenF1·Jolpi Ergast 모두 공개 API입니다.

---

## 폴더 구조

```
src/
├── app/           # Next.js 라우팅 (page.tsx만 위치)
├── features/f1/   # F1 전용 컴포넌트 및 API 클라이언트
├── components/    # 앱 전역 공통 컴포넌트
├── lib/           # 유틸리티 함수 및 종목별 정적 데이터
└── types/         # 공유 타입 정의
```

자세한 구조는 [`docs/STRUCTURE.md`](docs/STRUCTURE.md)를 참고하세요.

---

## 데이터 갱신 주기

경기 일정 및 드라이버 스탠딩은 Next.js ISR로 캐시됩니다.

| 데이터 | 갱신 주기 |
|---|---|
| F1 경기 일정 · 세션 | 1시간 (`revalidate: 3600`) |
| 드라이버 스탠딩 | 24시간 (`revalidate: 86400`) |
| WEC·WRC·슈퍼레이스·N페스티벌 | 정적 (코드 내 하드코딩, 시즌별 업데이트) |
