interface LogoProps {
  variant?: 'light' | 'dark'
  size?: number
}

export default function Logo({ variant = 'light', size = 40 }: LogoProps) {
  const stroke = variant === 'dark' ? '#F2EFE8' : '#15120D'
  return (
    <svg viewBox="0 0 56 56" width={size} height={size} fill="none">
      <path d="M44 22 A18 18 0 1 0 44 34" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
      <path d="M27 17 L27 39 L39 39" stroke={stroke} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M46 23 L54 23" stroke="#E10600" strokeWidth="3.6" strokeLinecap="round" />
      <path d="M46 28 L52 28" stroke="#E10600" strokeWidth="3.6" strokeLinecap="round" />
      <path d="M46 33 L54 33" stroke="#E10600" strokeWidth="3.6" strokeLinecap="round" />
    </svg>
  )
}
