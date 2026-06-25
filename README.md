# OneLap

모터스포츠를 처음 접하는 사람을 위한 입문 가이드 서비스입니다.  
F1·WEC·WRC·슈퍼레이스·현대 N 페스티벌 — 다섯 종목의 일정, 규칙, 팀·드라이버 정보를 한 곳에서 제공합니다. (현재는 F1, WEC 만 제공)

코딩을 몰라도 괜찮습니다. 이 문서는 프로그램 설치부터 화면에서 직접 글자를 바꿔보는 것까지, **비개발자도 30~60분 안에 따라할 수 있도록** 단계별로 안내합니다.

---

## 🛠 처음 한 번만: 개발 환경 준비하기

### 0. 준비물 체크리스트

- 인터넷이 되는 컴퓨터 (macOS 또는 Windows)
- 약 30~60분의 시간

### 1. 터미널이란?

터미널(Terminal)은 **컴퓨터에게 글자로 명령을 내리는 검은 창**입니다. 마우스로 클릭하는 대신, 명령어를 입력하면 컴퓨터가 바로 실행합니다.

**macOS에서 터미널 열기**

방법 1: `Command(⌘) + Space` → "터미널" 입력 → `Enter`  
방법 2: `응용 프로그램 > 유틸리티 > 터미널`

**Windows에서 터미널 열기**

시작 메뉴 → "PowerShell" 검색 → 마우스 오른쪽 클릭 → "관리자 권한으로 실행"

### 2. Node.js 설치하기

Node.js는 **이 프로젝트를 실행시켜주는 엔진**입니다. 버전 20 이상이 필요합니다.

Node.js를 직접 설치하는 대신 **nvm(Node Version Manager)**을 사용하는 것을 권장합니다. nvm을 쓰면 Node.js 버전을 프로젝트마다 쉽게 바꿀 수 있고, 시스템을 깔끔하게 유지할 수 있습니다.

**macOS / Linux**

터미널에서 아래 명령어를 실행하세요:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

설치가 끝나면 **터미널을 완전히 닫고 새로 열어주세요.** 그다음 Node.js 20을 설치합니다:

```bash
nvm install 20
nvm use 20
```

**Windows**

[github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases) 에서 최신 `nvm-setup.exe`를 내려받아 설치한 뒤, PowerShell에서 실행합니다:

```bash
nvm install 20
nvm use 20
```

### 3. pnpm 설치하기

pnpm은 **이 프로젝트가 사용하는 패키지 관리 도구**입니다.

터미널을 열고 아래 명령어를 입력하세요:

```bash
npm install -g pnpm
```

> ⚠️ **중요**: 이 프로젝트는 **pnpm만** 사용합니다. `npm install`을 실행하면 `package-lock.json`이 생성되어 문제가 발생할 수 있습니다. 앞으로 항상 `pnpm`을 사용하세요.

### 4. VS Code(코드 편집기) 설치하기

VS Code는 코드를 보고 수정하는 **메모장의 고급 버전**입니다.

1. [code.visualstudio.com](https://code.visualstudio.com) 접속
2. "Download" 버튼 클릭
3. 다운로드한 파일 실행하여 설치

**macOS**: 다운로드한 앱을 `응용 프로그램` 폴더로 드래그  
**Windows**: 설치 중 "PATH に追加" 또는 "Code로 열기" 체크박스를 켜두면 편리합니다

### 5. 설치 확인하기

터미널에서 아래 명령어를 입력하여 설치가 잘 됐는지 확인합니다:

```bash
node -v     # v20.x.x 형태로 나오면 OK
pnpm -v     # 숫자(예: 9.x.x)가 나오면 OK
```

에러가 발생한다면 아래 [🆘 문제가 생겼어요](#-문제가-생겼어요) 섹션을 확인하세요.

---

## ▶️ 프로젝트 실행하기

### 1. 프로젝트 폴더로 이동

```bash
# 다운받은 위치에 맞게 경로를 바꿔주세요
cd ~/Repo/onelap
```

### 2. 의존성 설치

처음 한 번만 실행합니다. 수백 개의 패키지를 내려받으므로 몇 분 걸릴 수 있습니다.

```bash
pnpm install
```

### 3. 개발 서버 켜기

```bash
pnpm dev
```

터미널에 아래와 같은 줄이 나오면 성공입니다:

```
Local:   http://localhost:3000
```

### 4. 브라우저에서 확인

브라우저(Chrome, Safari 등) 주소창에 아래 주소를 입력하세요:

```
localhost:3000
```

OneLap 화면이 보이면 정상적으로 실행된 것입니다.

### 5. 서버 끄기 / 다시 켜기

- **끄기**: 터미널에서 `Control + C`
- **다시 켜기**: 같은 폴더에서 `pnpm dev`

> 💡 **핵심 포인트**: `pnpm dev`가 켜진 상태에서 코드를 저장하면 브라우저가 **자동으로 새로고침**됩니다. 저장할 때마다 결과를 바로 확인할 수 있습니다.

---

## ✏️ 직접 바꿔보기 (튜토리얼)

`pnpm dev`를 켜둔 상태에서 진행하세요. 각 튜토리얼은 독립적으로 따라할 수 있습니다.

---

### 튜토리얼 1: 사이트 이름 글자 바꾸기 ⭐ (쉬움)

**목표**: 화면 왼쪽 상단에 보이는 "OneLap" 텍스트를 원하는 글자로 바꿉니다.

**① 파일 열기**

VS Code를 열고 `Ctrl + P`(macOS: `Cmd + P`) → `Navbar.tsx` 입력 → `Enter`  
또는 왼쪽 파일 탐색기에서 `src > components > Navbar.tsx` 클릭

**② 변경 전 코드 찾기**

파일 안에서 아래 코드를 찾으세요 (13~15번째 줄 근처):

```tsx
<div className="font-archivo font-black text-2xl leading-none tracking-tight text-text">
  OneLap
</div>
```

**③ 변경 후**

`OneLap` 부분만 원하는 글자로 바꾸세요:

```tsx
<div className="font-archivo font-black text-2xl leading-none tracking-tight text-text">
  내가 만든 랩
</div>
```

**④ 저장 후 확인**

`Ctrl + S`(macOS: `Cmd + S`)로 저장하면 브라우저 왼쪽 상단 로고 옆 글자가 바뀝니다.

**⑤ 설명**

`<` `>` 태그 사이의 글자가 화면에 그대로 보이는 텍스트입니다. 태그는 건드리지 말고 **안쪽 글자만** 수정하면 됩니다.

---

### 튜토리얼 2: 포인트 색상 바꾸기 ⭐ (쉬움)

**목표**: 사이트 전체에 쓰이는 빨간 포인트 색상을 원하는 색으로 바꿉니다.

**① 파일 열기**

프로젝트 최상위 폴더의 `tailwind.config.ts` 파일을 엽니다.  
VS Code에서 `Cmd + P` → `tailwind.config.ts` → `Enter`

**② 변경 전 코드 찾기**

파일 안에서 아래 줄을 찾으세요 (23번째 줄 근처):

```ts
accent: '#E10600',
```

**③ 변경 후 (예시: 파란색)**

```ts
accent: '#2C5BD6',
```

**④ 저장 후 확인**

저장 후 브라우저에서 `Cmd + R`(Windows: `Ctrl + R`)로 새로고침하세요.  
버튼, 밑줄 등 빨간 포인트가 지정한 색으로 바뀝니다.

**⑤ 설명**

`#E10600`은 색 코드(HEX 코드)로 빨강을 나타냅니다. 이 한 줄을 바꾸면 사이트 전체의 포인트 색이 한 번에 변합니다.

> 💡 **색 코드 고르기**: [htmlcolorcodes.com](https://htmlcolorcodes.com)에서 원하는 색을 클릭하면 `#XXXXXX` 형태의 코드를 복사할 수 있습니다.

> ⚠️ **주의**: Tailwind 설정 파일을 변경한 경우 서버를 재시작해야 할 수 있습니다. (`Control + C` → `pnpm dev`)

---

### 튜토리얼 3: F1 플래그 퀴즈 설명 바꾸기 ⭐⭐ (보통)

**목표**: F1 가이드 페이지의 플래그 퀴즈에서 Green Flag 설명 텍스트를 바꿉니다.

**① 파일 열기**

`src > features > f1 > components > FlagQuiz.tsx` 파일을 엽니다.

**② 변경 전 코드 찾기**

파일 상단에서 `FLAGS` 배열의 첫 번째 항목을 찾으세요 (7번째 줄 근처):

```tsx
{
  id: 'green',
  bg: '#2fd27a',
  title: 'Green Flag',
  situation: '황색기 구간의 위험이 해제됐습니다. 드라이버들에게 정상 주행 재개를 알려야 합니다.',
  desc: '위험 해제 — 정상 주행·추월 가능.',
},
```

**③ 변경 후**

`desc` 필드의 따옴표 안쪽 텍스트만 수정합니다:

```tsx
{
  id: 'green',
  bg: '#2fd27a',
  title: 'Green Flag',
  situation: '황색기 구간의 위험이 해제됐습니다. 드라이버들에게 정상 주행 재개를 알려야 합니다.',
  desc: '초록 불! 이제 마음껏 달려도 됩니다.',
},
```

**④ 저장 후 확인**

브라우저에서 `localhost:3000/guide/f1` 접속 → 페이지 아래로 스크롤하여 플래그 퀴즈 확인  
Green Flag 정답 피드백 설명이 바뀐 것을 볼 수 있습니다.

**⑤ 설명**

`FLAGS` 배열은 퀴즈에 등장하는 11개 플래그의 정보를 담은 목록입니다. 각 항목의 `desc`(설명) 값이 정답을 맞혔을 때 보여주는 텍스트입니다.

> ⚠️ **흔한 실수**: 따옴표(`'`)나 쉼표(`,`)를 실수로 지우면 화면에 빨간 에러가 납니다. 따옴표 **안쪽 글자만** 바꾸고, 앞뒤 구조는 그대로 두세요.

---

### 튜토리얼 4: AI에게 부탁해서 바꾸기 (바이브코딩) ✨

**목표**: 코드를 직접 건드리지 않고, AI에게 원하는 것을 말로 설명해서 바꿉니다.

바이브코딩(Vibe Coding)은 코드를 몰라도 AI에게 "이렇게 바꿔줘"라고 말하는 것만으로 개발하는 방식입니다.

**① Claude Code 설치**

터미널에서 아래 명령어를 실행하세요:

```bash
npm install -g @anthropic-ai/claude-code
```

**② 프로젝트 폴더에서 Claude Code 실행**

```bash
cd ~/Repo/onelap
claude
```

처음 실행하면 Anthropic 계정 로그인 또는 API 키 입력을 안내합니다.  
[claude.ai](https://claude.ai)에서 무료로 계정을 만들 수 있습니다.

**③ 말로 변경 요청하기**

Claude Code가 실행되면 채팅창처럼 원하는 것을 한국어로 입력하면 됩니다.

예시 요청:

```
포인트 색상을 초록색으로 바꿔줘
```

```
Navbar에 있는 "OneLap" 텍스트 옆에 🏁 이모지를 추가해줘
```

```
F1 플래그 퀴즈에서 Green Flag 설명을 더 재미있게 바꿔줘
```

**④ 결과 확인**

Claude Code가 코드를 수정하면 브라우저에서 자동으로 반영됩니다.  
마음에 들지 않으면 "되돌려줘" 또는 "다시 해줘"라고 입력하면 됩니다.

**⑤ 더 복잡한 요청도 가능합니다**

```
홈 화면 상단에 "지금 F1 시즌 중!" 이라는 배너를 빨간 배경으로 추가해줘
```

```
플래그 퀴즈를 마쳤을 때 "축하합니다! 🎉" 메시지가 뜨게 해줘
```

코드를 전혀 몰라도 됩니다. 원하는 것을 최대한 구체적으로 설명할수록 AI가 더 정확하게 만들어줍니다.

> 💡 **팁**: "왼쪽 상단 로고 옆 텍스트를 파란색으로" 처럼 위치와 대상을 명확하게 말하면 더 잘 알아듣습니다.

---

### 변경 내용 되돌리기

실수를 했거나 원래대로 돌아가고 싶을 때는 터미널에서 아래 명령어를 사용하세요:

```bash
git status                            # 내가 바꾼 파일 목록 보기
git restore src/components/Navbar.tsx # 특정 파일을 원래대로
git restore .                         # 모든 변경 내용 되돌리기
```

---

## 🆘 문제가 생겼어요

| 증상 | 원인 | 해결 |
|---|---|---|
| `command not found: pnpm` | pnpm 미설치 또는 터미널 재시작 필요 | 터미널을 새로 열고 `npm install -g pnpm` 재실행 |
| `command not found: node` | Node.js 미설치 | [Node.js 설치하기](#2-nodejs-설치하기) 섹션으로 |
| `Port 3000 is already in use` | 서버가 이미 켜져 있음 | 기존 터미널에서 `Ctrl + C` 후 `pnpm dev` 재시도 |
| 브라우저 화면에 빨간 에러 | 코드 오타 (따옴표·쉼표 누락) | `git restore <파일 경로>`로 되돌리기 |
| 색이 안 바뀜 | 설정 캐시 | 서버 재시작: `Ctrl + C` → `pnpm dev` |
| `npm install` 잘못 실행 | pnpm 전용 프로젝트에 npm 사용 | 생성된 `package-lock.json` 삭제 후 `pnpm install` |

---

## 👩‍💻 개발자를 위한 정보

### 주요 기능

**홈 (`/`)**
- 진행 중·예정 경기 통합 일정 (실시간 Live 표시)
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

### 기술 스택

| 항목 | 내용 |
|---|---|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS + inline style |
| 패키지 매니저 | pnpm |
| 외부 API | [OpenF1](https://openf1.org) (경기 일정·세션), [Jolpi Ergast](https://api.jolpi.ca/ergast) (드라이버 스탠딩) |

### 폴더 구조

```
src/
├── app/           # Next.js 라우팅 (page.tsx만 위치)
├── features/f1/   # F1 전용 컴포넌트 및 API 클라이언트
├── components/    # 앱 전역 공통 컴포넌트
├── lib/           # 유틸리티 함수 및 종목별 정적 데이터
└── types/         # 공유 타입 정의
```

자세한 구조는 [`docs/STRUCTURE.md`](docs/STRUCTURE.md)를 참고하세요.

### 데이터 갱신 주기

경기 일정 및 드라이버 스탠딩은 Next.js ISR로 캐시됩니다.

| 데이터 | 갱신 주기 |
|---|---|
| F1 경기 일정 · 세션 | 1시간 (`revalidate: 3600`) |
| 드라이버 스탠딩 | 24시간 (`revalidate: 86400`) |
| WEC·WRC·슈퍼레이스·N페스티벌 | 정적 (코드 내 하드코딩, 시즌별 업데이트) |

### 환경 변수

별도의 API 키 없이 동작합니다. OpenF1·Jolpi Ergast 모두 공개 API입니다.

### 빌드 / 린트 명령어

```bash
# 프로덕션 빌드
pnpm build

# 빌드 결과 실행
pnpm start

# 린트 검사
pnpm lint
```
