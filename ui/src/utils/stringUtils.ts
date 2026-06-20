export function normalizeText(text: string): string {
  return text.trim().replace(/\s+/g, ' ')
}

export function lowerCaseText(text: string): string {
  return normalizeText(text).toLowerCase()
}

export function capitalizeText(text: string): string {
  const normalized = normalizeText(text)
  return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase()
}

// Validate email format using regex
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
