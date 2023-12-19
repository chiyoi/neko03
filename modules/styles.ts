import { CSSProperties } from "react"

export const StyleButtonColor: CSSProperties = {
  backgroundColor: 'var(--accent-6)',
}

export const StyleIconButton: CSSProperties = {
  ...StyleButtonColor,
  width: '40px',
  height: '40px',
  borderRadius: '100%',
}

export const StyleTextColor: CSSProperties = {
  color: 'var(--accent-11)',
}