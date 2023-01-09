import { Link, useNavigation } from '@react-navigation/native'
import { Text, View } from 'native-base'
import React, { useEffect } from 'react'
import { RouteKeys } from '../../routes'

type ProfilePageProps = {
}

function ProfilePage(props: ProfilePageProps) {
  const nav = useNavigation()
  useEffect(() => {
    nav.setOptions({
      headerRight: () => (
        <Link to={{ screen: RouteKeys.ProfileSettings }}>
          ⚙️
        </Link>
      )
    })
  }, [])
  return (
    <View>
      <Text>
        AuthQRCodePage
      </Text>
    </View>
  )
}

export default ProfilePage