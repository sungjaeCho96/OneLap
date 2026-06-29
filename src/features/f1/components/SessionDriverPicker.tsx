'use client'

import type { QualifyingSessionOption, DriverOption } from '@/features/f1/trackSpeed'

interface SessionDriverPickerProps {
  sessions: QualifyingSessionOption[]
  selectedSessionKey: number | null
  drivers: DriverOption[]
  driversLoading: boolean
  picked: number[]
  onSelectSession: (sessionKey: number) => void
  onToggleDriver: (driverNumber: number) => void
  onCompare: () => void
}

export default function SessionDriverPicker({
  sessions,
  selectedSessionKey,
  drivers,
  driversLoading,
  picked,
  onSelectSession,
  onToggleDriver,
  onCompare,
}: SessionDriverPickerProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Session selector */}
      <div>
        <label
          htmlFor="session-select"
          style={{
            display: 'block',
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#857A6A',
            marginBottom: 8,
          }}
        >
          예선 세션 선택
        </label>
        <select
          id="session-select"
          value={selectedSessionKey ?? ''}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10)
            if (!isNaN(val)) onSelectSession(val)
          }}
          style={{
            width: '100%',
            padding: '10px 14px',
            background: '#15120D',
            border: '1px solid #3A352C',
            borderRadius: 2,
            color: '#F5F0E8',
            fontFamily: "'Space Mono', monospace",
            fontSize: 13,
            cursor: 'pointer',
            appearance: 'none',
          }}
        >
          <option value="" disabled>
            세션을 선택하세요
          </option>
          {sessions.map((s) => {
            const date = new Date(s.dateStart)
            const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
            return (
              <option key={s.sessionKey} value={s.sessionKey}>
                R{s.round} {s.circuitShortName} · {s.countryName} ({dateStr})
              </option>
            )
          })}
        </select>
      </div>

      {/* Driver picker */}
      {selectedSessionKey != null && (
        <div>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#857A6A',
              marginBottom: 8,
            }}
          >
            드라이버 2명 선택 ({picked.length}/2)
          </div>

          {driversLoading ? (
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
                color: '#4A3F35',
                padding: '16px 0',
              }}
            >
              드라이버 목록 로딩 중…
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: 8,
              }}
            >
              {drivers.map((d) => {
                const isPicked = picked.includes(d.driverNumber)
                const isDisabled = !isPicked && picked.length >= 2
                return (
                  <button
                    key={d.driverNumber}
                    onClick={() => !isDisabled && onToggleDriver(d.driverNumber)}
                    disabled={isDisabled}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 2,
                      border: `2px solid ${isPicked ? d.teamColour : '#2C271F'}`,
                      background: isPicked ? `${d.teamColour}22` : '#15120D',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      textAlign: 'left',
                      opacity: isDisabled ? 0.4 : 1,
                      transition: 'all 0.12s',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: d.teamColour,
                          flexShrink: 0,
                          display: 'inline-block',
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontWeight: 700,
                          fontSize: 14,
                          color: isPicked ? d.teamColour : '#F5F0E8',
                        }}
                      >
                        {d.code}
                      </span>
                    </div>
                    <div
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 9,
                        color: '#857A6A',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {d.teamName}
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Compare button */}
          <button
            onClick={onCompare}
            disabled={picked.length < 2}
            style={{
              marginTop: 16,
              width: '100%',
              padding: '12px 20px',
              borderRadius: 2,
              border: 'none',
              background: picked.length === 2 ? '#E10600' : '#2C271F',
              color: picked.length === 2 ? '#fff' : '#4A3F35',
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: picked.length === 2 ? 'pointer' : 'not-allowed',
              transition: 'background 0.15s',
            }}
          >
            {picked.length === 2 ? '비교하기 →' : '드라이버 2명을 선택하세요'}
          </button>
        </div>
      )}
    </div>
  )
}
