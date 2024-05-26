## Tanjong [![codecov](https://codecov.io/gh/clippingkk/tanjong/branch/master/graph/badge.svg?token=373R35M1SY)](https://codecov.io/gh/clippingkk/tanjong)

It's the [ClippingKK](https://clippingkk.annatarhe.com)'s mobile version that rewrite with react-native

still in progress.

you have to use `bundle exec pod install` to install in m1 mac

## run

please change the udid to your device id

```bash
emulator -avd Pixel_3a_API_33_arm64-v8a
npm run android

npm run ios -- --no-packager --udid 00008101-00154D013410001E
npm run ios -- --no-packager --udid 00008101-00154D013410001E --configuration ReleaseOS
```

## Release

### iOS

1. open XCode and edit the version of clipping, please don't forget update the build number

2. change target to `Any iOS Device(arm64)`

3. Product -> Archive and wait

4. open `Archives` window and click `Distribute App`

### Android

download the upload key(in my google drive maybe)

1. open `android/app/build.gradle` and update `versionCode` and `version`

2. build it

```bash
./node_modules/.bin/react-native build-android --mode=release
open android/app/build/outputs/bundle/release
```

open [Google Play Console](https://play.google.com/console/u/0/developers) and upload to a new release

