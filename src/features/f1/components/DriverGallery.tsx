'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ─── 인터페이스 ───────────────────────────────────────────────────────────────

interface Driver {
  nameKr: string
  nameEn: string
  num: string
  image: string
  nationalityKr: string
  nationalityFlag: string
  age: number
  careerKr: string
  point2026Kr: string
  storyKr: string
}

interface Team {
  id: string
  nameKr: string
  color: string
  teamFlag: string
  teamCountry: string
  drivers: [Driver, Driver]
}

interface FlatDriver extends Driver {
  teamId: string
  teamNameKr: string
  teamColor: string
  teamFlag: string
  teamCountry: string
}

// ─── 팀/드라이버 데이터 ──────────────────────────────────────────────────────

const TEAMS: Team[] = [
  {
    id: 'redbull',
    nameKr: '레드불 레이싱',
    color: '#3671C6',
    teamFlag: '🇦🇹',
    teamCountry: '오스트리아',
    drivers: [
      {
        nameKr: '막스 베르스타펜',
        nameEn: 'Max Verstappen',
        num: '3',
        image: '/images/f1/Max-Verstappen.avif',
        nationalityKr: '네덜란드',
        nationalityFlag: '🇳🇱',
        age: 28,
        careerKr: '2021~2024 4년 연속 월드챔피언. 역대 최다승 페이스를 달리는 현 세대 최강자.',
        point2026Kr: '챔피언 번호 #1을 노리스에게 내주고 #3으로 반격하는 시즌. 새 엔진 규정에서도 정상을 지킬 수 있을지.',
        storyKr: '이기는 게 디폴트인 남자, 그 디폴트가 흔들린 첫 시즌.',
      },
      {
        nameKr: '아이작 하자르',
        nameEn: 'Isack Hadjar',
        num: '6',
        image: '/images/f1/Isack-Hadjar.avif',
        nationalityKr: '프랑스',
        nationalityFlag: '🇫🇷',
        age: 21,
        careerKr: '2025 레이싱 불스 데뷔 후 강렬한 인상을 남기며 1년 만에 레드불 메인팀 승격.',
        point2026Kr: '베르스타펜의 새 팀메이트. 역대 레드불 2번 시트의 주인공들은 항상 혹독한 압박을 받았다.',
        storyKr: '베르스타펜 옆자리는 F1에서 가장 위험한 의자다. 그 의자에 21살이 앉았다.',
      },
    ],
  },
  {
    id: 'ferrari',
    nameKr: '스쿠데리아 페라리',
    color: '#E8002D',
    teamFlag: '🇮🇹',
    teamCountry: '이탈리아',
    drivers: [
      {
        nameKr: '샤를 르클레르',
        nameEn: 'Charles Leclerc',
        num: '16',
        image: '/images/f1/Charles-Leclerc.avif',
        nationalityKr: '모나코',
        nationalityFlag: '🇲🇨',
        age: 28,
        careerKr: '페라리의 에이스. 폴포지션의 제왕으로 불리지만 아직 월드타이틀은 없다.',
        point2026Kr: '해밀턴과의 팀 내 자존심 대결 2년차. 페라리 우승 갈증을 풀 적기.',
        storyKr: '고향 모나코에서 우승하는 게 꿈인 남자, 페라리의 마지막 희망.',
      },
      {
        nameKr: '루이스 해밀턴',
        nameEn: 'Lewis Hamilton',
        num: '44',
        image: '/images/f1/Lewis-Hamilton.avif',
        nationalityKr: '영국',
        nationalityFlag: '🇬🇧',
        age: 41,
        careerKr: '역대 최다 7회 월드챔피언. 2025년 메르세데스를 떠나 페라리로 충격 이적했다.',
        point2026Kr: '페라리 2년차, 빨간 차로 8번째 타이틀 도전. 커리어 마지막 불꽃.',
        storyKr: '전설이 빨간 차를 입었다. 동화의 결말은 우승일까.',
      },
    ],
  },
  {
    id: 'mercedes',
    nameKr: '메르세데스',
    color: '#27F4D2',
    teamFlag: '🇩🇪',
    teamCountry: '독일',
    drivers: [
      {
        nameKr: '조지 러셀',
        nameEn: 'George Russell',
        num: '63',
        image: '/images/f1/George-Russell.avif',
        nationalityKr: '영국',
        nationalityFlag: '🇬🇧',
        age: 28,
        careerKr: '메르세데스의 리더. 침착한 레이스 운영과 기술적 피드백이 강점.',
        point2026Kr: '해밀턴이 떠난 자리, 팀의 명실상부한 에이스. 새 규정에서 메르세데스 부활의 선봉.',
        storyKr: '해밀턴이 떠난 자리, 이제 팀의 미래는 그의 손에.',
      },
      {
        nameKr: '키미 안토넬리',
        nameEn: 'Kimi Antonelli',
        num: '12',
        image: '/images/f1/Kimi-Antonelli.avif',
        nationalityKr: '이탈리아',
        nationalityFlag: '🇮🇹',
        age: 19,
        careerKr: '2025년 메르세데스로 데뷔한 이탈리아 천재. 데뷔 시즌부터 포디움을 경험했다.',
        point2026Kr: '10대 후반의 차세대 슈퍼스타. 2년차에 첫 우승이 나올지.',
        storyKr: '이탈리아가 30년 만에 기다린 슈퍼스타, 이제 막 시작했다.',
      },
    ],
  },
  {
    id: 'mclaren',
    nameKr: '맥라렌',
    color: '#FF8000',
    teamFlag: '🇬🇧',
    teamCountry: '영국',
    drivers: [
      {
        nameKr: '랜도 노리스',
        nameEn: 'Lando Norris',
        num: '1',
        image: '/images/f1/Lando-Norris.avif',
        nationalityKr: '영국',
        nationalityFlag: '🇬🇧',
        age: 26,
        careerKr: '2025년 첫 월드챔피언에 등극. 데뷔 7년 만에 정상에 올랐다.',
        point2026Kr: '챔피언 번호 #1을 처음 단 시즌. 1회 우승이 우연이 아님을 증명할 차례.',
        storyKr: '오래 기다린 챔피언, 이제 사냥당하는 입장이 되었다.',
      },
      {
        nameKr: '오스카 피아스트리',
        nameEn: 'Oscar Piastri',
        num: '81',
        image: '/images/f1/Oscar-Piastri.avif',
        nationalityKr: '호주',
        nationalityFlag: '🇦🇺',
        age: 24,
        careerKr: '냉정한 호주인. 팀메이트 노리스와 마지막까지 타이틀을 다툰 강자.',
        point2026Kr: '아쉽게 놓친 타이틀, 2026엔 팀 내 1인자 자리를 노린다.',
        storyKr: '표정 없는 암살자, 같은 팀 챔피언을 무너뜨리려 한다.',
      },
    ],
  },
  {
    id: 'aston',
    nameKr: '애스턴 마틴',
    color: '#229971',
    teamFlag: '🇬🇧',
    teamCountry: '영국',
    drivers: [
      {
        nameKr: '페르난도 알론소',
        nameEn: 'Fernando Alonso',
        num: '14',
        image: '/images/f1/Fernando Alonso.avif',
        nationalityKr: '스페인',
        nationalityFlag: '🇪🇸',
        age: 44,
        careerKr: '2005·2006 월드챔피언. 그리드 최고령이자 살아있는 전설.',
        point2026Kr: '뉴이가 설계한 새 차로 마지막 우승 도전. 나이는 숫자일 뿐.',
        storyKr: '20년 전 챔피언이 아직도 그리드에 있다. 그 이유가 있다.',
      },
      {
        nameKr: '랜스 스트롤',
        nameEn: 'Lance Stroll',
        num: '18',
        image: '/images/f1/Lance-Stroll.avif',
        nationalityKr: '캐나다',
        nationalityFlag: '🇨🇦',
        age: 27,
        careerKr: '팀 오너의 아들이자 베테랑. 빗길에서 번뜩이는 스피드를 보인다.',
        point2026Kr: '알론소라는 거대한 잣대 옆에서 자신의 가치를 증명해야 하는 시즌.',
        storyKr: '아버지가 산 팀, 실력으로 자리를 지켜야 하는 부담.',
      },
    ],
  },
  {
    id: 'alpine',
    nameKr: '알핀',
    color: '#0093CC',
    teamFlag: '🇫🇷',
    teamCountry: '프랑스',
    drivers: [
      {
        nameKr: '피에르 가슬리',
        nameEn: 'Pierre Gasly',
        num: '10',
        image: '/images/f1/Pierre-Gasly.avif',
        nationalityKr: '프랑스',
        nationalityFlag: '🇫🇷',
        age: 30,
        careerKr: '2020 몬차에서 깜짝 우승한 프랑스 에이스. 중위권에서 빛나는 실력자.',
        point2026Kr: '프랑스 국민팀 알핀의 리더. 중위권 탈출을 이끄는 베테랑.',
        storyKr: '한 번의 기적 같은 우승, 그 순간을 다시 만들 수 있을까.',
      },
      {
        nameKr: '프랑코 콜라핀토',
        nameEn: 'Franco Colapinto',
        num: '43',
        image: '/images/f1/Franco-Colapinto.avif',
        nationalityKr: '아르헨티나',
        nationalityFlag: '🇦🇷',
        age: 22,
        careerKr: '2024년 윌리엄스에서 깜짝 데뷔, 아르헨티나의 새 영웅으로 떠올랐다.',
        point2026Kr: '정규 시트를 확보한 첫 풀시즌. 열정적인 남미 팬덤의 기대.',
        storyKr: '메시의 나라가 F1에서 다시 응원할 이름을 찾았다.',
      },
    ],
  },
  {
    id: 'williams',
    nameKr: '윌리엄스',
    color: '#64C4FF',
    teamFlag: '🇬🇧',
    teamCountry: '영국',
    drivers: [
      {
        nameKr: '알렉스 알본',
        nameEn: 'Alex Albon',
        num: '23',
        image: '/images/f1/Alexander-Albon.avif',
        nationalityKr: '태국',
        nationalityFlag: '🇹🇭',
        age: 29,
        careerKr: '레드불에서 방출됐다 부활한 입지전적 인물. 윌리엄스의 기둥.',
        point2026Kr: '사인츠와 함께 명문팀 윌리엄스의 부활을 이끄는 핵심.',
        storyKr: '한 번 버려졌던 드라이버, 가장 끈질긴 부활 스토리.',
      },
      {
        nameKr: '카를로스 사인츠',
        nameEn: 'Carlos Sainz',
        num: '55',
        image: '/images/f1/Carlos-Sainz.avif',
        nationalityKr: '스페인',
        nationalityFlag: '🇪🇸',
        age: 31,
        careerKr: '페라리에서 우승을 거둔 검증된 승부사. 별명은 \'스무스 오퍼레이터\'.',
        point2026Kr: '윌리엄스에서 명문팀 재건 프로젝트 2년차. 리더십이 관건.',
        storyKr: '페라리를 떠나 전통의 명가 재건에 인생을 건 베테랑.',
      },
    ],
  },
  {
    id: 'rb',
    nameKr: '레이싱 불스',
    color: '#6692FF',
    teamFlag: '🇮🇹',
    teamCountry: '이탈리아',
    drivers: [
      {
        nameKr: '리암 로슨',
        nameEn: 'Liam Lawson',
        num: '30',
        image: '/images/f1/Liam-Lawson.avif',
        nationalityKr: '뉴질랜드',
        nationalityFlag: '🇳🇿',
        age: 24,
        careerKr: '2025년 레드불 메인팀에서 강등의 아픔을 겪고 레이싱 불스로 복귀.',
        point2026Kr: '재기를 노리는 시즌. 다시 메인팀으로 올라갈 마지막 기회일 수 있다.',
        storyKr: '정상 문턱에서 밀려난 청년, 증명할 시간은 많지 않다.',
      },
      {
        nameKr: '아비드 린드블라드',
        nameEn: 'Arvid Lindblad',
        num: '41',
        image: '/images/f1/Arvid-Lindblad.avif',
        nationalityKr: '영국',
        nationalityFlag: '🇬🇧',
        age: 18,
        careerKr: '2026 그리드 유일의 루키. 레드불 주니어 출신의 초고속 유망주.',
        point2026Kr: '그리드 유일의 신인. \'차세대 베르스타펜\'이라 불리는 재능의 데뷔 무대.',
        storyKr: '18살, F1 유일의 신입생. 모두가 \'제2의 베르스타펜\'을 기대한다.',
      },
    ],
  },
  {
    id: 'haas',
    nameKr: '하스',
    color: '#B6BABD',
    teamFlag: '🇺🇸',
    teamCountry: '미국',
    drivers: [
      {
        nameKr: '에스테반 오콘',
        nameEn: 'Esteban Ocon',
        num: '31',
        image: '/images/f1/Esteban-Ocon.avif',
        nationalityKr: '프랑스',
        nationalityFlag: '🇫🇷',
        age: 29,
        careerKr: '2021 헝가리에서 우승한 프랑스인. 끈질긴 디펜스의 달인.',
        point2026Kr: '베어먼이라는 신예와 짝을 이뤄 하스의 중원 도약을 견인.',
        storyKr: '딱 한 번 우승, 그 한 번을 위해 누구보다 치열하게 싸운다.',
      },
      {
        nameKr: '올리버 베어먼',
        nameEn: 'Oliver Bearman',
        num: '87',
        image: '/images/f1/Oliver-Bearman.avif',
        nationalityKr: '영국',
        nationalityFlag: '🇬🇧',
        age: 20,
        careerKr: '어린 나이에 대체 출전으로 강한 인상을 남긴 영국 유망주.',
        point2026Kr: '풀시즌 2년차, 미래의 톱팀 자리를 노리는 영건의 본격 도약기.',
        storyKr: '땜빵 출전에서 미래의 스타로, 가족 생일을 번호 #87에 새긴 청년.',
      },
    ],
  },
  {
    id: 'audi',
    nameKr: '아우디',
    color: '#F50537',
    teamFlag: '🇩🇪',
    teamCountry: '독일',
    drivers: [
      {
        nameKr: '니코 휠켄베르크',
        nameEn: 'Nico Hülkenberg',
        num: '27',
        image: '/images/f1/Nico-Hulkenberg.avif',
        nationalityKr: '독일',
        nationalityFlag: '🇩🇪',
        age: 38,
        careerKr: '최다 출전 무포디움 기록을 끝내 깬 베테랑. 풍부한 경험의 소유자.',
        point2026Kr: '아우디 워크스 원년의 리더. 새 출발하는 명가의 길잡이.',
        storyKr: '200전 만에 첫 포디움, 끈기의 화신이 새 역사의 첫 페이지를 쓴다.',
      },
      {
        nameKr: '가브리엘 보르톨레토',
        nameEn: 'Gabriel Bortoleto',
        num: '5',
        image: '/images/f1/Gabriel Bortoleto.avif',
        nationalityKr: '브라질',
        nationalityFlag: '🇧🇷',
        age: 21,
        careerKr: 'F2·F3 연속 챔피언 출신. 브라질이 기대하는 차세대 스타.',
        point2026Kr: '아우디 프로젝트의 미래. 브라질 팬들의 새로운 희망.',
        storyKr: '세나의 나라가 오래 기다린 차세대 챔피언 후보.',
      },
    ],
  },
  {
    id: 'cadillac',
    nameKr: '캐딜락',
    color: '#8B0000',
    teamFlag: '🇺🇸',
    teamCountry: '미국',
    drivers: [
      {
        nameKr: '세르히오 페레스',
        nameEn: 'Sergio Perez',
        num: '11',
        image: '/images/f1/Sergio-Perez.avif',
        nationalityKr: '멕시코',
        nationalityFlag: '🇲🇽',
        age: 36,
        careerKr: '통산 다승 베테랑. 레드불에서 베르스타펜의 윙맨으로 활약했다.',
        point2026Kr: '신생 캐딜락의 간판으로 화려하게 복귀. 베테랑의 경험으로 새 팀을 이끈다.',
        storyKr: '은퇴한 줄 알았던 베테랑, 미국의 신생팀이 그를 다시 불러냈다.',
      },
      {
        nameKr: '발테리 보타스',
        nameEn: 'Valtteri Bottas',
        num: '77',
        image: '/images/f1/Valtteri-Bottas.avif',
        nationalityKr: '핀란드',
        nationalityFlag: '🇫🇮',
        age: 36,
        careerKr: '메르세데스 시절 다수 우승. 해밀턴의 팀메이트로 황금기를 함께했다.',
        point2026Kr: '페레스와 함께 캐딜락의 신생 도전을 이끄는 노련한 듀오.',
        storyKr: '한 시대를 떠받친 2인자, 새 팀에서 다시 주인공을 꿈꾼다.',
      },
    ],
  },
]

// 전체 드라이버 평탄화 배열 (모달 순회용)
const ALL_DRIVERS: FlatDriver[] = TEAMS.flatMap((team) =>
  team.drivers.map((driver) => ({
    ...driver,
    teamId: team.id,
    teamNameKr: team.nameKr,
    teamColor: team.color,
    teamFlag: team.teamFlag,
    teamCountry: team.teamCountry,
  }))
)

// ─── DriverModal ─────────────────────────────────────────────────────────────

interface DriverModalProps {
  driver: FlatDriver
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  isMobile: boolean
}

function DriverModal({ driver, onClose, onPrev, onNext, isMobile }: DriverModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // 드라이버 바뀔 때 스크롤 리셋
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [driver.nameEn])

  const stopProp = (e: React.MouseEvent) => e.stopPropagation()

  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex',
    alignItems: isMobile ? 'flex-end' : 'center',
    justifyContent: 'center',
  }

  const modalStyle: React.CSSProperties = {
    background: '#fff',
    maxWidth: 760,
    width: '92%',
    maxHeight: isMobile ? '92vh' : '90vh',
    borderRadius: isMobile ? '12px 12px 0 0' : 8,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    position: 'relative',
  }

  const photoAreaStyle: React.CSSProperties = isMobile
    ? {
        flexShrink: 0,
        height: 250,
        position: 'relative',
        background: `linear-gradient(135deg, ${driver.teamColor}44 0%, ${driver.teamColor}22 100%)`,
      }
    : {
        flex: '0 0 45%',
        position: 'relative',
        background: `linear-gradient(135deg, ${driver.teamColor}44 0%, ${driver.teamColor}22 100%)`,
        minHeight: 480,
      }

  const infoAreaStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: isMobile ? '20px 18px 28px' : '28px 28px 32px',
  }

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={modalStyle} onClick={stopProp}>
        {/* 사진 영역 */}
        <div style={photoAreaStyle}>
          <img
            src={driver.image}
            alt={driver.nameKr}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
              display: 'block',
            }}
            onError={(e) => {
              const t = e.currentTarget
              t.style.display = 'none'
            }}
          />
          {/* 번호 뱃지 — 우하단 */}
          <div style={{
            position: 'absolute',
            bottom: 12,
            right: 14,
            fontFamily: "'Archivo', sans-serif",
            fontWeight: 900,
            fontSize: isMobile ? 44 : 56,
            color: '#fff',
            lineHeight: 1,
            textShadow: `0 2px 12px rgba(0,0,0,0.45)`,
            letterSpacing: '-0.02em',
          }}>
            #{driver.num}
          </div>
        </div>

        {/* 정보 영역 */}
        <div ref={scrollRef} style={infoAreaStyle}>
          {/* 팀 라벨 */}
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            fontWeight: 700,
            color: driver.teamColor,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}>
            {driver.teamFlag} {driver.teamNameKr}
          </div>

          {/* 이름 KR */}
          <div style={{
            fontFamily: "'Noto Sans KR', sans-serif",
            fontWeight: 800,
            fontSize: isMobile ? 22 : 26,
            color: '#15120D',
            lineHeight: 1.2,
            marginBottom: 4,
          }}>
            {driver.nameKr}
          </div>

          {/* 이름 EN */}
          <div style={{
            fontFamily: "'Archivo', sans-serif",
            fontSize: 13,
            color: '#857A6A',
            marginBottom: 14,
            letterSpacing: '0.02em',
          }}>
            {driver.nameEn}
          </div>

          {/* 메타 칩 행 */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            marginBottom: 18,
          }}>
            {[
              `${driver.nationalityFlag} ${driver.nationalityKr}`,
              `만 ${driver.age}세`,
              `#${driver.num}`,
            ].map((chip) => (
              <span key={chip} style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 10,
                color: '#4A4338',
                background: '#EAE5DA',
                border: '1px solid #E0D9CB',
                borderRadius: 3,
                padding: '4px 8px',
                letterSpacing: '0.04em',
              }}>
                {chip}
              </span>
            ))}
          </div>

          {/* 인용구 storyKr */}
          <div style={{
            borderLeft: `4px solid ${driver.teamColor}`,
            paddingLeft: 14,
            marginBottom: 20,
            fontFamily: "'Noto Sans KR', sans-serif",
            fontStyle: 'italic',
            fontSize: 14,
            color: '#4A4338',
            lineHeight: 1.65,
            wordBreak: 'keep-all',
          }}>
            &ldquo;{driver.storyKr}&rdquo;
          </div>

          {/* 경력 섹션 */}
          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              fontWeight: 700,
              color: '#857A6A',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 6,
            }}>
              경력
            </div>
            <div style={{
              fontFamily: "'Noto Sans KR', sans-serif",
              fontSize: 13,
              color: '#15120D',
              lineHeight: 1.7,
              wordBreak: 'keep-all',
            }}>
              {driver.careerKr}
            </div>
          </div>

          {/* 2026 관전포인트 박스 */}
          <div style={{
            background: '#F2EFE8',
            borderLeft: `4px solid ${driver.teamColor}`,
            borderRadius: '0 4px 4px 0',
            padding: '12px 14px',
            marginBottom: 24,
          }}>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              fontWeight: 700,
              color: driver.teamColor,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 6,
            }}>
              2026 관전포인트
            </div>
            <div style={{
              fontFamily: "'Noto Sans KR', sans-serif",
              fontSize: 13,
              color: '#15120D',
              lineHeight: 1.7,
              wordBreak: 'keep-all',
            }}>
              {driver.point2026Kr}
            </div>
          </div>

          {/* 이전/다음 내비게이션 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 8,
          }}>
            <button
              onClick={onPrev}
              style={{
                flex: 1,
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: '#4A4338',
                background: '#EAE5DA',
                border: '1px solid #E0D9CB',
                borderRadius: 4,
                padding: '9px 12px',
                cursor: 'pointer',
                letterSpacing: '0.04em',
              }}
            >
              ← 이전
            </button>
            <button
              onClick={onNext}
              style={{
                flex: 1,
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: '#fff',
                background: driver.teamColor,
                border: 'none',
                borderRadius: 4,
                padding: '9px 12px',
                cursor: 'pointer',
                letterSpacing: '0.04em',
              }}
            >
              다음 →
            </button>
          </div>
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          aria-label="닫기"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.45)',
            border: 'none',
            color: '#fff',
            fontSize: 18,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            zIndex: 10,
          }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}

// ─── DriverCard ───────────────────────────────────────────────────────────────

interface DriverCardProps {
  driver: Driver
  teamColor: string
  onClick: () => void
}

function DriverCard({ driver, teamColor, onClick }: DriverCardProps) {
  const [hovered, setHovered] = useState(false)
  const [imgError, setImgError] = useState(false)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick()
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        background: '#D8D2C8',
        aspectRatio: '3/4',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        transform: hovered ? 'scale(1.03)' : 'scale(1)',
        boxShadow: hovered ? `0 8px 24px rgba(0,0,0,0.18)` : '0 2px 8px rgba(0,0,0,0.08)',
        cursor: 'pointer',
      }}
    >
      {!imgError && (
        <img
          src={driver.image}
          alt={driver.nameKr}
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top center',
            display: 'block',
          }}
        />
      )}
      {imgError && (
        <div style={{
          width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${teamColor}18`,
        }}>
          <span style={{
            fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 52,
            color: `${teamColor}55`,
          }}>
            {driver.num}
          </span>
        </div>
      )}

      {/* 하단 그라디언트 */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.3) 38%, transparent 62%)',
        pointerEvents: 'none',
        transition: 'opacity 0.18s ease',
        opacity: hovered ? 0.85 : 1,
      }} />

      {/* 번호 뱃지 */}
      <div style={{
        position: 'absolute', top: 9, left: 9,
        fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 12,
        color: '#fff', background: teamColor,
        padding: '3px 7px', borderRadius: 2, lineHeight: 1,
        letterSpacing: '0.02em',
      }}>
        {driver.num}
      </div>

      {/* 이름 영역 */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '10px 12px 13px',
      }}>
        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: 9,
          color: 'rgba(255,255,255,0.65)', marginBottom: 4, letterSpacing: '0.04em',
        }}>
          {driver.nationalityFlag} {driver.nationalityKr.toUpperCase()}
        </div>
        <div style={{
          fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700,
          fontSize: 13, color: '#fff', lineHeight: 1.3,
          wordBreak: 'keep-all',
        }}>
          {driver.nameKr}
        </div>

        {/* hover 마이크로카피 */}
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 9,
          color: 'rgba(255,255,255,0.75)',
          marginTop: 5,
          letterSpacing: '0.05em',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(4px)',
          transition: 'opacity 0.18s ease, transform 0.18s ease',
        }}>
          자세히 보기 ▸
        </div>
      </div>
    </div>
  )
}

// ─── DriverGallery (메인) ─────────────────────────────────────────────────────

export default function DriverGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // 모바일 감지 (SSR 안전)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // 스크롤 락
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedIndex])

  const handleClose = useCallback(() => setSelectedIndex(null), [])

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) return null
      return (prev - 1 + ALL_DRIVERS.length) % ALL_DRIVERS.length
    })
  }, [])

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) return null
      return (prev + 1) % ALL_DRIVERS.length
    })
  }, [])

  // 키보드 인터랙션
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedIndex, handleClose, handlePrev, handleNext])

  const selectedDriver = selectedIndex !== null ? ALL_DRIVERS[selectedIndex] : null

  return (
    <>
      <div style={{ marginTop: 32 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 12,
        }}>
          {TEAMS.map((team) => (
            <div
              key={team.id}
              style={{
                background: '#fff',
                border: '1px solid #E0D9CB',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              {/* 팀 헤더 */}
              <div style={{
                padding: '11px 14px',
                borderLeft: `4px solid ${team.color}`,
                borderBottom: '1px solid #E0D9CB',
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#FAFAF8',
              }}>
                <span style={{ fontSize: 15 }}>{team.teamFlag}</span>
                <div>
                  <div style={{
                    fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700,
                    fontSize: 13, color: '#15120D', lineHeight: 1,
                  }}>
                    {team.nameKr}
                  </div>
                  <div style={{
                    fontFamily: "'Space Mono', monospace", fontSize: 9,
                    color: '#857A6A', letterSpacing: '0.06em', marginTop: 3,
                  }}>
                    {team.teamCountry.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* 드라이버 카드 2개 */}
              <div style={{ display: 'flex', gap: 8, padding: 10 }}>
                {team.drivers.map((driver) => {
                  const flatIndex = ALL_DRIVERS.findIndex(
                    (d) => d.teamId === team.id && d.num === driver.num
                  )
                  return (
                    <DriverCard
                      key={driver.num}
                      driver={driver}
                      teamColor={team.color}
                      onClick={() => setSelectedIndex(flatIndex)}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 모달 */}
      {selectedDriver !== null && selectedIndex !== null && (
        <DriverModal
          driver={selectedDriver}
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
          isMobile={isMobile}
        />
      )}
    </>
  )
}
