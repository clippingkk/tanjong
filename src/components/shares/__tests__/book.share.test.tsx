import 'react-native'
import React from 'react'
import { render, screen } from '@testing-library/react-native'
import UTPShareView from '../utp.share'
import { UTPService } from '../../../service/utp'
import { NativeBaseProvider } from 'native-base'

test('book share should be work', async () => {
  render(
    <NativeBaseProvider initialWindowMetrics={{
      frame: { x: 0, y: 0, width: 0, height: 0 },
      insets: { top: 0, left: 0, right: 0, bottom: 0 },
    }}>
      <UTPShareView
        kind={UTPService.book}
        bookDBID={111111}
        bookID={2222}
        uid={333}
      />
    </NativeBaseProvider>
  )
  expect(screen).toMatchSnapshot()
})
