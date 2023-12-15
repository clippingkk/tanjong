import React, { useEffect } from 'react'
import SignUpLayout from './layout'
import { AlertCircleIcon, Button, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText, Input, InputField, Text, View } from '@gluestack-ui/themed'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RouteKeys, RouteParamList } from '../../routes'
import { useUpdateProfileMutation } from '../../schema/generated'
import toast from 'react-hot-toast/headless'
import { useApolloClient } from '@apollo/client'
import { Controller, useForm } from 'react-hook-form'
import Zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import FormField from '../../components/form/form-field'

type SignUpSetNamePageProps = NativeStackScreenProps<RouteParamList, RouteKeys.SignUpSetName>

const formData = Zod.object({
  avatar: Zod.string(),
  name: Zod.string().max(50).min(5),
  domain: Zod.string().regex(/^[a-z0-9\.]+$/).max(50).min(5),
  bio: Zod.string().max(255).default(''),
})

type FormData = Zod.infer<typeof formData>

function SignUpSetNamePage(props: SignUpSetNamePageProps) {
  const { data } = props.route.params

  const client = useApolloClient()
  const [doUpdateProfile] = useUpdateProfileMutation({
    onCompleted(data) {
      toast.success('Profile updated')
      client.resetStore()
      props.navigation.popToTop()
    }
  })

  useEffect(() => {
    props.navigation.setOptions({
      title: data.user.email,
    })
  }, [data.user.email])
  // name, bio, avatar, domain
  // prompt premium account upgrade

  const { control, formState } = useForm<FormData>({
    resolver: zodResolver(formData)
  })

  return (
    <SignUpLayout title='Initialize my profile'>
      <Animated.View entering={FadeInUp}>
        <View mt={'$5'}>
          <Controller
            control={control}
            name='avatar'
            render={({ field: { onChange, onBlur, value }, formState, fieldState }) => (
              <View />
            )}
          />
          <Controller
            control={control}
            name='name'
            render={({ field: { onChange, onBlur, value }, formState, fieldState }) => (
              <FormField
                fieldState={fieldState}
                formState={formState}
                label='Name'
                helperText='Your name will be displayed on your profile'
                value={value}
                onChange={onChange}
                errorMessage={formState.errors.name?.message}
              />
            )}
          />
          <Controller
            control={control}
            name='domain'
            render={({ field: { onChange, onBlur, value }, formState, fieldState }) => (
              <FormField
                fieldState={fieldState}
                formState={formState}
                label='Domain'
                helperText='Your unique domain. will appear on your shared links'
                value={value}
                onChange={onChange}
                errorMessage={formState.errors.domain?.message}
              />
            )}
          />
        </View>
      </Animated.View>
    </SignUpLayout>
  )
}

export default SignUpSetNamePage