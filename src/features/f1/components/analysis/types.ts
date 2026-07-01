import type { ReactNode } from 'react'

export interface AnalysisTabItem {
  id: string
  label: string
  eyebrow?: string
  content: ReactNode
}
