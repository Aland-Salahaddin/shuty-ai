import { v4 as uuidv4 } from 'uuid'

/**
 * Convert all Western digits (0-9) to Arabic-Indic digits (٠-٩)
 */
export function toArabicIndic(input: string | number): string {
  const str = String(input)
  const map: Record<string, string> = {
    '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
    '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩',
  }
  return str.replace(/[0-9]/g, (d) => map[d])
}

/**
 * Format a JS Date into a Kurdish-friendly string with Arabic-Indic digits
 */
export function formatKurdishDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const pad = (n: number) => String(n).padStart(2, '0')
  const formatted = `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} — ${pad(d.getHours())}:${pad(d.getMinutes())}`
  return toArabicIndic(formatted)
}

/**
 * Generate a new unique session ID for "New Chat"
 */
export function newSessionId(): string {
  return uuidv4()
}

/**
 * Simple className joiner (replaces clsx for minimal deps)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
