export interface MorseSymbol {
  char: string
  code: string
}

export type TrainMode = 'charToCode' | 'codeToChar' | 'audioToChar' | 'typingToCode'

export type AppTheme = 'dark' | 'high-contrast'

export interface HistoryEntry {
  id: number
  input: string
  output: string
  correct: boolean
  timestamp: number
}
