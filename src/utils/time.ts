
export const duration3Days = 1000 * 60 * 60 * 60 * 24 * 3

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(() => resolve(true), ms))
}