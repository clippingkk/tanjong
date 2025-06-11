import React, {useCallback, useEffect} from 'react'
import SignUpLayout from './layout'
import {
  Alert,
  AvatarImage,
  Button,
  Divider,
  Image,
  ScrollView,
  Text,
  View
} from '@gluestack-ui/themed'
import {Asset, launchImageLibrary} from 'react-native-image-picker'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {RouteKeys, RouteParamList} from '../../routes'
import {useUpdateProfileMutation} from '../../schema/generated'
import toast from 'react-hot-toast/headless'
import {useApolloClient} from '@apollo/client'
import {Controller, SubmitHandler, useForm} from 'react-hook-form'
import Zod from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import FormField from '../../components/form/form-field'
import {uploadImage} from '../../service/s3'
import {useMutation} from '@tanstack/react-query'
import {ActivityIndicator, Platform} from 'react-native'

type SignUpSetNamePageProps = NativeStackScreenProps<
  RouteParamList,
  RouteKeys.SignUpSetName
>

const formData = Zod.object({
  avatar: Zod.object({
    fileName: Zod.string().optional(),
    type: Zod.string().optional(),
    uri: Zod.string().optional(),
    fileSize: Zod.number()
      .max(1 << 23, 'Max file size is 8MB')
      .optional()
  }).optional() as Zod.ZodType<Asset>,
  name: Zod.string()
    .max(50)
    .min(5)
    .regex(/^[a-zA-Z\u4e00-\u9fa5\u3040-\u30FF\u31F0-\u31FF\uAC00-\uD7AF]+$/u),
  domain: Zod.string()
    .regex(/^[a-z0-9\.]+$/)
    .max(50)
    .min(5),
  bio: Zod.string().max(255).default('')
})

type FormData = Zod.infer<typeof formData>

function SignUpSetNamePage(props: SignUpSetNamePageProps) {
  const {data} = props.route.params

  const client = useApolloClient()
  const [doUpdateProfile, {loading: isUpdating}] = useUpdateProfileMutation({
    onCompleted(data) {
      toast.success('Profile updated')
      client.resetStore()
      props.navigation.popToTop()
    }
  })

  useEffect(() => {
    props.navigation.setOptions({
      title: data.user.email
    })
  }, [data.user.email])
  // name, bio, avatar, domain
  // prompt premium account upgrade

  const {control, handleSubmit} = useForm({
    resolver: zodResolver(formData)
  })

  const {mutateAsync: doUploadImage, isPending: isUploading} = useMutation({
    mutationFn: (photo: Asset) =>
      uploadImage({
        name: photo.fileName,
        type: photo.type,
        uri:
          Platform.OS === 'ios' ? photo.uri?.replace('file://', '') : photo.uri
      } as any),
    onSuccess() {
      toast.success('avatar uploaded, updating...')
    }
  })

  const onFormSubmit: SubmitHandler<FormData> = async data => {
    let avatarUrl = ''
    if (data.avatar) {
      try {
        const avatarResponse = await doUploadImage(data.avatar)
        avatarUrl = avatarResponse.filePath
      } catch (e: any) {
        toast.error(e.toString())
        throw e
      }
    }

    return doUpdateProfile({
      variables: {
        ...data,
        avatar: avatarUrl === '' ? null : avatarUrl
      }
    })
  }

  const isSubmitting = isUploading || isUpdating

  return (
    <SignUpLayout title="Initialize my profile">
      <ScrollView>
        <View mt={'$5'}>
          <Controller
            control={control}
            name="avatar"
            render={({
              field: {onChange, onBlur, value},
              formState,
              fieldState
            }) => (
              <View>
                {value && (
                  <View
                    height={120}
                    my={'$5'}
                    justifyContent="center"
                    alignItems="center">
                    <AvatarImage
                      source={{uri: value.uri}}
                      alt="avatar"
                      height={120}
                      width={120}
                    />
                  </View>
                )}
                <Button
                  disabled={isSubmitting}
                  onPress={async () => {
                    const result = await launchImageLibrary({
                      mediaType: 'photo',
                      selectionLimit: 1
                    })
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
                    if ((asset.fileSize ?? 0) > 1 << 23) {
                      toast.error('Image size too large, max 8MB')
                      return
                    }
                    onChange(asset)
                  }}>
                  {isSubmitting && (
                    <ActivityIndicator style={{marginRight: 10}} />
                  )}
                  <Text
                    color="$white"
                    sx={{
                      _dark: {
                        color: '$gray200'
                      }
                    }}>
                    Pick an avatar
                  </Text>
                </Button>
                {formState.errors.avatar?.fileSize && (
                  <Text mt={'$2'} color="$red500">
                    {formState.errors.avatar?.fileSize.message}
                  </Text>
                )}
              </View>
            )}
          />
          <Divider my={'$5'} />
          <Controller
            control={control}
            name="name"
            render={({
              field: {onChange, onBlur, value},
              formState,
              fieldState
            }) => (
              <FormField
                fieldState={fieldState}
                formState={formState}
                label="Name"
                helperText="Your name will be displayed on your profile"
                value={value}
                onChange={onChange}
                errorMessage={formState.errors.name?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="domain"
            render={({
              field: {onChange, onBlur, value},
              formState,
              fieldState
            }) => (
              <FormField
                fieldState={fieldState}
                formState={formState}
                label="Domain"
                helperText="Your unique domain. will appear on your shared links"
                value={value}
                onChange={onChange}
                errorMessage={formState.errors.domain?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="bio"
            render={({
              field: {onChange, onBlur, value},
              formState,
              fieldState
            }) => (
              <FormField
                fieldState={fieldState}
                formState={formState}
                label="Bio"
                type="textarea"
                helperText="Your bio will be displayed on your profile"
                value={value}
                onChange={onChange}
                errorMessage={formState.errors.bio?.message}
              />
            )}
          />

          <Button
            mt={'$5'}
            onPress={handleSubmit(onFormSubmit)}
            disabled={isSubmitting}>
            {isSubmitting && <ActivityIndicator style={{marginRight: 10}} />}
            <Text
              color="$white"
              sx={{
                _dark: {
                  color: '$gray200'
                }
              }}>
              Submit
            </Text>
          </Button>
        </View>
      </ScrollView>
    </SignUpLayout>
  )
}

export default SignUpSetNamePage
