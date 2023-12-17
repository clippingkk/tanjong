import { API_HOST } from "../constants/config"
import { getLocalToken } from "../utils/apollo"

type TUploadResponse = {
  filePath: string
}

export function uploadImage(file: File): Promise<TUploadResponse> {
  const fd = new FormData()
  fd.append('image', file)
  const token = getLocalToken()
  if (!token) {
    throw new Error('no token')
  }
  return fetch(API_HOST + '/api/v1/misc/upload', {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    method: 'POST',
    body: fd,
  }).then(res => res.json())
    .then(response => {
      if ('error' in response) {
        throw new Error(response.error)
      }
      return response
    })
}