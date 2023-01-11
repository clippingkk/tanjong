import { CDN_DEFAULT_DOMAIN } from "../constants/config"

export function getValidImageUrl(src?: string) {
  if (!src) {
    return src
  }
  return src.startsWith('http') ? src : `${CDN_DEFAULT_DOMAIN}/${src}`
}
