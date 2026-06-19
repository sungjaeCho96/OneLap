# Handoff: OneLap — 모터스포츠 정보 통합 사이트

## Overview

OneLap은 F1·WEC·WRC·CJ 슈퍼레이스·현대 N 페스티벌 5개 모터스포츠의 **경기 일정, 뉴스, 종목 입문 가이드**를 한곳에서 제공하는 정보 허브 서비스입니다.

핵심 기능:
- 다음 경기까지 실시간 카운트다운
- 종목별 필터링이 가능한 경기 일정 캘린더
- 종목별 초심자 입문 가이드 카드
- 뉴스 매거진 그리드

브랜드 슬로건: **"모두가 하나 되는, 한 바퀴"**

---

## About the Design Files

`design_handoff_onelap/` 폴더 안의 HTML 파일들은 **디자인 레퍼런스(프로토타입)**입니다. 프로덕션 코드로 그대로 사용하는 것이 아니라, 실제 개발 환경(React, Next.js, Vue 등)에서 이 디자인을 **재구현**하는 참고 자료로 활용해 주세요.

---

## Fidelity

**High-fidelity** — 최종 색상·타이포그래피·간격·인터랙션이 모두 반영된 픽셀 퍼펙트 목업입니다. 개발 시 아래 스펙을 기준으로 최대한 동일하게 재현해 주세요.

---

## Screens / Views

### 1. 홈페이지 (`OneLap.dc.html`)

전체 페이지는 단일 스크롤 구조입니다: **네비 → 히어로 → 경기 일정 → 종목 가이드 → 뉴스 → 푸터**

---

#### 1-1. Navigation Bar (Sticky Header)

- **Position**: `position: sticky; top: 0; z-index: 50`
- **Background**: `rgba(242,239,232,0.85)` + `backdrop-filter: blur(12px)`
- **Border**: `border-bottom: 1px solid #E0D9CB`
- **Inner max-width**: `1280px`, padding `16px 24px`
- **Layout**: `flex; justify-content: space-between; align-items: center`

**로고 (왼쪽)**
- SVG 아이콘 (40×40px) + 워드마크
- 아이콘: 열린 원(OL Speed) — 아래 Assets 섹션 SVG 참고
- 워드마크: Archivo Black 900, 24px, letter-spacing -0.02em
- 서브텍스트: Space Mono, 9px, letter-spacing 0.12em, uppercase, `#857A6A`

**네비 링크 (오른쪽)**
- Noto Sans KR Bold 700, 14px
- 링크: 경기 일정 / 시작하기 / 뉴스
- LIVE 버튼: Space Mono 700, 12px, letter-spacing 0.08em, uppercase
  - bg `#15120D`, color `#fff`, padding `9px 18px`, border-radius `2px`

---

#### 1-2. Hero Section

- **Padding**: `56px 24px 64px`, max-width `1280px`
- **Layout**: `flex; flex-wrap: wrap; gap: 48px; align-items: center`

**왼쪽 패널** (`flex: 1 1 480px; min-width: 300px`)

| 요소 | 스펙 |
|---|---|
| 종목 배지 | Space Mono 700, 12px, letter-spacing 0.18em, uppercase, 색상점(9px 원) + 종목 컬러 |
| 레이스명 H1 | Archivo Black 900, clamp(42px, 6.4vw, 82px), line-height 0.93, letter-spacing -0.03em, uppercase |
| 컬러 언더라인 | height 5px, width 120px, 종목 컬러, margin-bottom 22px |
| 설명 텍스트 | Noto Sans KR 400, 17px, line-height 1.6, color `#4A4338` |
| 위치/라운드 | Space Mono 400, 13px |

**카운트다운** (출발까지)
- 레이블: Space Mono 400, 11px, letter-spacing 0.16em, uppercase, `#857A6A`
- 숫자 블록: bg `#15120D`, color `#F2EFE8`, padding `14px 18px`, min-width `84px`
  - 숫자: Space Mono 700, clamp(28px, 4vw, 40px)
  - 단위 레이블: Space Mono 400, 10px, letter-spacing 0.14em, uppercase, `#9A9081`
- 단위 4개: Days / Hrs / Min / Sec

**오른쪽 패널** (`flex: 1 1 380px; min-width: 280px`)
- 이미지 플레이스홀더 (min-height 360px)
  - 배경: `repeating-linear-gradient(48deg, #E4DFD3 0, #E4DFD3 11px, #ECE7DC 11px, #ECE7DC 22px)`
  - 좌상단 종목 배지: 종목 컬러 bg, 흰 텍스트, Space Mono 700, 11px
  - 하단 오버레이: `linear-gradient(transparent, rgba(21,18,13,0.82))`
    - 경기장명: Archivo 800, 18px, uppercase, 흰색
    - 날짜: Space Mono 400, 11px, `#D8D2C6`
- TIP 카드 (이미지 하단):
  - bg `#fff`, border `1px solid #DAD2C2`, padding `18px 20px`
  - 레이블: Space Mono 400, 11px, `#857A6A`
  - 내용: Noto Sans KR 400, 13px, line-height 1.5, `#4A4338`

---

#### 1-3. Schedule Section (경기 일정)

- **Background**: `#15120D` (다크 섹션)
- **Color**: `#F2EFE8`
- **Padding**: `64px 24px`

**섹션 헤더**
- 서브레이블: Space Mono 400, 12px, letter-spacing 0.18em, uppercase, `#E10600`
- H2: Archivo 900, clamp(34px, 5vw, 60px), line-height 0.95, letter-spacing -0.03em, uppercase

**필터 버튼** (전체 / F1 / WEC / WRC / 슈퍼레이스 / 현대 N)
- Space Mono 700, 12px, letter-spacing 0.06em, uppercase, padding `9px 16px`
- 비활성: bg transparent, color `#C9C1B2`, border `1px solid #3A352C`
- 활성: bg = 종목 컬러, color `#fff`
- 전체 활성: bg `#E10600`

**경기 행 (Schedule Row)**
- Border: `border-top: 1px solid #2C271F` / `border-bottom: 1px solid #2C271F`
- Padding: `22px 8px`
- Layout: `flex; flex-wrap: wrap; align-items: center; gap: 20px`
- Hover: `background: rgba(255,255,255,0.03)`

| 컬럼 | 스펙 |
|---|---|
| 종목 컬러바 | width 5px, align-self stretch, 종목 컬러, min-height 48px |
| 날짜 | Archivo 900 34px (일자) + Space Mono 11px `#9A9081` (월·요일) |
| 종목 배지+라운드 | 배지: Space Mono 700 10px, bg 종목 컬러 / 라운드: Space Mono 11px `#857A6A` |
| 경기명 | Archivo 800, 21px, uppercase |
| 서킷/장소 | 서킷: 700 15px / 장소: Space Mono 12px `#9A9081` |
| 추가 정보 | Space Mono 12px `#D8D2C6` + 11px `#857A6A` |

---

#### 1-4. Series Guide Section (종목 가이드 / 시작하기)

- **Background**: `#F2EFE8`
- **Padding**: `72px 24px`
- **Grid**: `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px`

**카드 구조**
- bg `#fff`, border `1px solid #E0D9CB`
- Hover: `transform: translateY(-4px); box-shadow: 0 18px 40px rgba(21,18,13,0.10); transition: all .2s`
- 상단 컬러바: height 6px, 종목 컬러
- 패딩: `24px 22px 22px`

카드 내부:
| 요소 | 스펙 |
|---|---|
| 종목 코드 | Archivo 900, 30px, 종목 컬러 |
| 종목명 | Archivo 800, 17px, uppercase |
| 한글명 | Noto Sans KR 400, 13px, `#857A6A` |
| 태그 | Space Mono 700, 10px, 종목 컬러, border 1px 종목 컬러, padding `4px 8px` |
| 설명 | Noto Sans KR 400, 14px, line-height 1.6, `#4A4338` |
| 팩트 그리드 | `grid-template-columns: 1fr 1fr; gap: 1px; background #E8E2D5` |
| 팩트 셀 | bg `#fff`, padding `10px 12px`, 레이블 Space Mono 10px `#9A9081`, 값 14px 700 |

**5개 종목 컬러**
| 종목 | 컬러 |
|---|---|
| F1 | `#E10600` |
| WEC | `#0E8C5A` |
| WRC | `#E8842B` |
| SuperRace | `#2C5BD6` |
| 현대 N | `#00A5C4` |

---

#### 1-5. News Section (뉴스)

- **Background**: `#EAE5DA`
- **Padding**: `72px 24px`
- **Grid**: `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px`
- 피처 기사: `grid-column: span 2`

**뉴스 카드**
- bg `#fff`, border `1px solid #E0D9CB`, overflow hidden
- Hover: `transform: translateY(-4px); box-shadow: 0 18px 40px rgba(21,18,13,0.10); transition: all .2s`
- 이미지 영역: `aspect-ratio: 16/9`
- 종목+태그 배지: Space Mono 700, 10px, bg 종목 컬러, `#fff` 텍스트, border-radius `2px`
- 제목: Archivo 800, clamp(18px, 2vw, 22px), line-height 1.18, letter-spacing -0.01em
- 본문: Noto Sans KR 400, 14px, line-height 1.55, `#4A4338`
- 하단 메타: Space Mono 11px, border-top `1px solid #EFEADF`, padding-top `12px`
  - 저자: Space Mono 700, `#15120D`

---

#### 1-6. Footer

- **Background**: `#15120D`
- **Color**: `#C9C1B2`
- **Padding**: `56px 24px 40px`

- 로고 + 슬로건: `"모두가 하나 되는, 한 바퀴."` — Noto Sans KR 400, 14px, line-height 1.6, `#9A9081`
- 링크: Noto Sans KR 400, 14px, `#C9C1B2`
- 하단 카피라이트: Space Mono 400, 11px, `#6E655A`, letter-spacing 0.04em
- Border-top: `1px solid #2C271F`

---

## Interactions & Behavior

### 카운트다운 타이머
- 1초 간격으로 업데이트 (`setInterval 1000ms`)
- 다음 경기 UTC 타임스탬프 기준으로 D/H/M/S 계산
- 숫자 2자리 zero-padding (시·분·초만, 일수는 raw)

### 필터 버튼
- 클릭 시 해당 종목 경기만 표시
- `전체` 선택 시 모든 경기 표시
- 활성 버튼: bg = 종목 컬러 / 비활성: transparent
- 전환 애니메이션: `transition: all .15s`

### 카드 호버
- `transform: translateY(-4px)`
- `box-shadow: 0 18px 40px rgba(21,18,13,0.10)`
- `transition: all .2s ease`

### 네비게이션 앵커
- `#schedule` / `#series` / `#news` 섹션으로 스크롤

### 반응형
- 모든 레이아웃은 `flex-wrap: wrap` + `min-width` 기반
- 타이포: `clamp()` 함수로 fluid scaling
- 그리드: `auto-fit` + `minmax()` — 1컬럼까지 자동 축소

---

## State Management

| 상태 | 타입 | 설명 |
|---|---|---|
| `now` | `number` (timestamp) | 현재 시각 — 1초마다 갱신, 카운트다운 계산용 |
| `filter` | `string` | 활성 필터 (`'all'` \| `'f1'` \| `'wec'` \| `'wrc'` \| `'superrace'` \| `'nfestival'`) |

경기 데이터, 뉴스 데이터, 종목 정보는 현재 하드코딩된 mock 데이터입니다. 실제 서비스에서는 API 연동이 필요합니다.

---

## Design Tokens

### Colors

```
/* Background */
--color-bg:          #F2EFE8
--color-bg-alt:      #EAE5DA
--color-bg-dark:     #15120D

/* Text */
--color-text:        #15120D
--color-text-mid:    #4A4338
--color-text-muted:  #857A6A
--color-text-dim:    #9A9081
--color-text-inv:    #F2EFE8

/* Border */
--color-border:      #E0D9CB
--color-border-dark: #2C271F

/* Accent */
--color-accent:      #E10600

/* Sport Colors */
--color-f1:          #E10600
--color-wec:         #0E8C5A
--color-wrc:         #E8842B
--color-superrace:   #2C5BD6
--color-nfestival:   #00A5C4
```

### Typography

```
/* Fonts */
font-display:  'Archivo'      (900, 800, 700, 600, 500) — 헤딩·히어로·배지
font-body:     'Noto Sans KR' (900, 700, 500, 400)      — 본문·UI
font-mono:     'Space Mono'   (700, 400)                — 메타·캡션·코드

/* Scale */
--text-hero:   clamp(42px, 6.4vw, 82px)  /* H1 */
--text-h2:     clamp(34px, 5vw, 60px)    /* Section title */
--text-h3:     21px                       /* Card title */
--text-body:   16px
--text-body-lg:17px
--text-sm:     14px
--text-xs:     13px
--text-meta:   12px
--text-caption:11px
--text-tiny:   10px / 9px
```

### Spacing

```
--space-1:  8px
--space-2:  16px
--space-3:  24px
--space-4:  32px
--space-5:  48px
--space-6:  64px
--space-7:  72px
```

### Border Radius

```
--radius-sm:  2px   /* 카드, 버튼, 인풋 */
--radius-md:  3px   /* 배지 */
/* 대부분 sharp (0) */
```

### Shadows

```
--shadow-card-hover: 0 18px 40px rgba(21,18,13,0.10)
--shadow-subtle:     0 1px 3px rgba(0,0,0,0.08)
```

### Transitions

```
--transition-fast:   all .15s ease
--transition-normal: all .2s ease
```

---

## Assets

### 로고 SVG (A Refined — 잠정 확정)

**라이트 버전 (헤더)**
```svg
<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M44 22 A18 18 0 1 0 44 34" stroke="#15120D" stroke-width="5" stroke-linecap="round"/>
  <path d="M27 17 L27 39 L39 39" stroke="#15120D" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M46 23 L54 23" stroke="#E10600" stroke-width="3.6" stroke-linecap="round"/>
  <path d="M46 28 L52 28" stroke="#E10600" stroke-width="3.6" stroke-linecap="round"/>
  <path d="M46 33 L54 33" stroke="#E10600" stroke-width="3.6" stroke-linecap="round"/>
</svg>
```

**다크 버전 (푸터·다크 배경)**
```svg
<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M44 22 A18 18 0 1 0 44 34" stroke="#F2EFE8" stroke-width="5" stroke-linecap="round"/>
  <path d="M27 17 L27 39 L39 39" stroke="#F2EFE8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M46 23 L54 23" stroke="#E10600" stroke-width="3.6" stroke-linecap="round"/>
  <path d="M46 28 L52 28" stroke="#E10600" stroke-width="3.6" stroke-linecap="round"/>
  <path d="M46 33 L54 33" stroke="#E10600" stroke-width="3.6" stroke-linecap="round"/>
</svg>
```

**아이콘 앱 아이콘 (72×72, 다크 bg `#15120D`, radius 16px)**
- 위의 다크 버전 SVG를 44×44px로 렌더링

### 이미지 플레이스홀더
현재 모든 이미지 영역은 CSS 그라디언트 플레이스홀더입니다. 실제 서비스에서는:
- 히어로: 해당 경기 서킷/경기 대표 사진
- 뉴스 카드: 기사 썸네일 이미지

---

## Data Structure (Mock → API)

### 경기 데이터 스키마
```ts
interface Race {
  sport: 'f1' | 'wec' | 'wrc' | 'superrace' | 'nfestival'
  round: number
  name: string        // 경기 영문명
  circuit: string     // 서킷명
  loc: string         // 장소 (도시, 국가)
  date: string        // ISO 8601 UTC
  laps: string        // 랩 수 또는 시간 (표시용)
  extra: string       // 부가 설명 (1~4 단어)
  tip: string         // 한줄 팁 (초심자용)
}
```

### 뉴스 데이터 스키마
```ts
interface NewsItem {
  sport: 'f1' | 'wec' | 'wrc' | 'superrace' | 'nfestival'
  tag: string         // 기사 태그 (분석/프리뷰/피처 등)
  title: string       // 기사 제목
  excerpt: string     // 기사 요약
  author: string      // 저자
  read: string        // 예상 읽기 시간 (예: "6분 읽기")
  big?: boolean       // true이면 피처 기사 (grid-column: span 2)
  imageUrl?: string   // 썸네일 URL
}
```

---

## Files

| 파일 | 설명 |
|---|---|
| `OneLap.dc.html` | 메인 홈페이지 디자인 (완성본) |
| `Design System.dc.html` | 디자인 시스템 문서 (색상·타입·컴포넌트·패턴) |
| `OneLap 로고 탐색.dc.html` | 로고 탐색 과정 (참고용) |

> ⚠️ `.dc.html` 파일들은 브라우저에서 직접 열어 확인할 수 있지만, `support.js`가 같은 폴더에 있어야 합니다.

---

## Recommended Tech Stack (미정인 경우)

서비스 특성상 아래 스택을 권장합니다:

- **Framework**: Next.js (App Router) — SEO 중요, SSR/SSG 혼용
- **Styling**: Tailwind CSS — 디자인 토큰 기반 유틸리티 클래스
- **State**: Zustand 또는 Jotai — 가벼운 필터/타이머 상태
- **Data**: 초기엔 정적 JSON → 이후 자체 API 또는 스크래핑 파이프라인
- **Fonts**: Google Fonts (Archivo + Noto Sans KR + Space Mono)

---

*OneLap Design Handoff — June 2026*
