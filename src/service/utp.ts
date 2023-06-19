export enum UTPService {
  clipping = 'clipping',
  book = 'book'
}
export const KonzertThemeMap = {
  classic: {
    id: 0,
    name: 'Classic',
  },
  colorful: {
    id: 1,
    name: 'Colorful',
  },
  dark: {
    id: 2,
    name: 'Noir',
  },
  young: {
    id: 3,
    name: 'Young',
  },
  light: {
    id: 4,
    name: 'Bright',
  }
}

type UTPLinkParams = {
    cid?: number,
    bid: number,
    uid: number,
    theme: number
}

export function getKonzertLink(service: UTPService, params: UTPLinkParams): string {
  const d = new URLSearchParams(params as any)
  const distUrl = `https://konzert.annatarhe.cn/${service.toString()}.html?${d.toString()}`
  return distUrl
}

export function getUTPLink(service: UTPService, params: UTPLinkParams): string {
  const distUrl = encodeURIComponent(getKonzertLink(service, params))
  const screenWidth = 375
  const dpi = 3

  return `https://utp.annatarhe.com/?url=${distUrl}&isMobile=true&isFullPage=true&viewPortWidth=${screenWidth}&width=${screenWidth * dpi}&deviceScaleFactor=${dpi}&viewPortHeight=768`
}