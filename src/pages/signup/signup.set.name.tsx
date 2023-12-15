import React, { useCallback, useEffect } from 'react'
import SignUpLayout from './layout'
import { AvatarImage, Button, Divider, Image, ScrollView, Text, View } from '@gluestack-ui/themed'
import { launchImageLibrary } from 'react-native-image-picker'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RouteKeys, RouteParamList } from '../../routes'
import { useUpdateProfileMutation } from '../../schema/generated'
import toast from 'react-hot-toast/headless'
import { useApolloClient } from '@apollo/client'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
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

  const { control, formState, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(formData),
  })

  const onFormSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data)
  }

  return (
    <SignUpLayout title='Initialize my profile'>
      <ScrollView>
        <View mt={'$5'}>
          <Controller
            control={control}
            name='avatar'
            render={({ field: { onChange, onBlur, value }, formState, fieldState }) => (
              <View>
                {value && (
                  <View
                    height={120}
                    my={'$5'}
                    justifyContent='center'
                    alignItems='center'
                  >
                    <AvatarImage source={{ uri: value }} alt='avatar' height={120} width={120} />
                  </View>
                )}
                <Button
                  onPress={async () => {
                    const result = await launchImageLibrary({
                      mediaType: 'photo',
                      selectionLimit: 1
                    });
                    if (result.didCancel) {
                      return
                    }
                    if (result.errorMessage) {
                      toast.error(result.errorMessage)
                      return
                    }
                    if (!result.assets || result.assets.length === 0) {
                      toast.error('No image selected')
                      return
                    }
                    const asset = result.assets[0]
                    onChange(asset.uri)
                  }}
                >
                  <Text
                    color='$white'
                    sx={{
                      _dark: {
                        color: '$gray200',
                      }
                    }}
                  >Pick an avatar</Text>
                </Button>
              </View>
            )}
          />
          <Divider my={'$5'} />
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
          <Controller
            control={control}
            name='bio'
            render={({ field: { onChange, onBlur, value }, formState, fieldState }) => (
              <FormField
                fieldState={fieldState}
                formState={formState}
                label='Bio'
                type='textarea'
                helperText='Your bio will be displayed on your profile'
                value={value}
                onChange={onChange}
                errorMessage={formState.errors.bio?.message}
              />
            )}
          />

          <Button
            mt={'$5'}
            onPress={handleSubmit(onFormSubmit)}
          >
            <Text
              color='$white'
              sx={{
                _dark: {
                  color: '$gray200',
                }
              }}
            >Submit</Text>
          </Button>
        </View>
      </ScrollView>
    </SignUpLayout>
  )
}

export default SignUpSetNamePage