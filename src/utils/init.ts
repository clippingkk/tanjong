import { CacheManager } from '@georstat/react-native-image-cache'
import { Dirs } from 'react-native-file-access'

CacheManager.config = {
  // baseDir: '',
  baseDir: `${Dirs.CacheDir}/images_cache/`,
  blurRadius: 15,
  cacheLimit: 1 << 30, // 1 GB
  sourceAnimationDuration: 300,
  thumbnailAnimationDuration: 300,
};