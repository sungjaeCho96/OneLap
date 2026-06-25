# OneLap — 공동 작업 규칙

모터스포츠 입문자를 위한 가이드 서비스. Next.js 15 App Router 기반.

---

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **Package Manager**: pnpm (npm/yarn 사용 금지)
- **Runtime**: Node.js 20+

---

## 패키지 관리

```bash
pnpm install          # 의존성 설치
pnpm dev              # 개발 서버
pnpm build            # 빌드 확인
pnpm lint             # ESLint 검사
```

**pnpm만 사용.** `npm install`을 실행하면 `package-lock.json`이 생성되어 충돌이 발생한다. `package-lock.json`은 `.gitignore`에 포함되어 있으며, 커밋하면 안 된다.

---

## 파일 배치 규칙

| 위치 | 용도 |
|---|---|
| `src/app/` | 라우팅 파일만 (`page.tsx`, `layout.tsx`). 비즈니스 로직·컴포넌트 금지 |
| `src/features/{sport}/` | 해당 종목에만 쓰이는 컴포넌트·API |
| `src/components/` | 두 곳 이상에서 쓰이는 공통 컴포넌트 |
| `src/lib/sports/` | 경기 일정·팀·가이드 등 정적 데이터 파일 |
| `src/lib/` | 여러 종목에 걸친 유틸리티 함수 |
| `src/types/` | 공유 TypeScript 타입 |

---

## 코딩 규칙

### 불변성 (CRITICAL)

객체를 절대 직접 변경하지 않는다. 항상 새 객체를 반환한다.

```typescript
// 금지
state.items.push(item)

// 올바른 방법
return { ...state, items: [...state.items, item] }
```

### 컴포넌트 크기

- 파일당 200~400줄 권장, 800줄 초과 금지
- 함수당 50줄 이하 권장
- 중첩 4단계 초과 금지

### TypeScript

- `any` 타입 사용 금지
- 공유 타입은 반드시 `src/types/index.ts`에 정의
- 컴포넌트 props는 `interface`로 명시적으로 선언

### 스타일링

- Tailwind CSS 클래스만 사용 (인라인 style 속성 금지)
- 반복되는 클래스 조합은 컴포넌트로 추출

### 주석

WHY가 명확하지 않을 때만 한 줄로 작성. 코드가 하는 일을 설명하는 주석은 쓰지 않는다.

---

## 새 종목 추가 시

1. `src/features/{sport}/` 폴더 생성
2. 종목 전용 컴포넌트 → `src/features/{sport}/components/`
3. 정적 데이터 → `src/lib/sports/{sport}Data.ts`
4. `src/lib/data.ts`의 `SERIES` 배열에 항목 추가
5. 필요하면 `src/app/guide/{sport}/page.tsx` 라우트 추가

---

## 데이터 패턴

서버 컴포넌트에서 fetch하고 클라이언트 컴포넌트에 props로 전달한다.

```typescript
// page.tsx (서버 컴포넌트)
const data = await fetchSomething()
return <ClientComponent data={data} />
```

API 캐시 주기: `revalidate: 3600` (1시간) 기본값.

---

## Git 규칙

### 커밋 메시지 형식

```
<type>: <설명>

<선택적 본문>
```

타입: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`

예시:
```
feat: WRC 2026 경기 일정 데이터 추가
fix: F1 드라이버 카드 모달 닫기 버튼 동작 수정
docs: 새 종목 추가 절차 STRUCTURE.md에 명시
```

### 브랜치 전략

```
main          ← 배포 브랜치 (직접 push 금지)
develop       ← 통합 브랜치 (기능들이 여기 모임, 직접 push 금지)
feat/{name}   ← 기능 개발
fix/{name}    ← 버그 수정
docs/{name}   ← 문서 작업
```

**흐름:** `feat/xxx` → PR → `develop` → PR → `main`

- `main`, `develop`에 직접 push하지 않는다. PR을 통해 병합한다.
- 기능 브랜치는 항상 `develop`에서 분기하고, `develop`으로 머지한다.
- `develop` → `main` 머지는 배포 준비가 완료됐을 때만 진행한다.

---

## 보안

커밋 전 체크리스트:
- [ ] API 키, 토큰, 비밀번호가 코드에 하드코딩되어 있지 않은가
- [ ] 민감한 값은 환경변수(`.env.local`)로 분리했는가
- [ ] `.env.local`은 `.gitignore`에 포함되어 있는가

---

## 현재 지원 종목

- F1 (Formula 1) — OpenF1 API 연동
- WEC (World Endurance Championship) — 정적 데이터

추가 예정: WRC, 슈퍼레이스, 현대 N 페스티벌
