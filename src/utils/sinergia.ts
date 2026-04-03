export function sinergiaParaEstrelas(sinergia: number): number {
  if (sinergia <= 0) return 0
  if (sinergia >= 100) return 5

  return Math.round((sinergia / 100) * 5)
}