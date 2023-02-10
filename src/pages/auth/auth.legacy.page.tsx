import { Button, Center, FormControl, Input, KeyboardAvoidingView, Text, useToast, View, VStack } from 'native-base'
import { useForm, Controller } from "react-hook-form";
import React, { useEffect } from 'react'
import { Platform } from 'react-native';
import { useAuthLazyQuery, useAuthQuery } from '../../schema/generated';
import { usePostAuth } from '../../hooks/auth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteParamList } from '../../routes';

type AuthLegacyPageProps= NativeStackScreenProps<RouteParamList, 'empty' | 'AuthQRCode'>

function AuthLegacyPage(props: AuthLegacyPageProps) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const [doAuth, authResp] = useAuthLazyQuery()
  const toast = useToast()
  const onPostAuth = usePostAuth(props.navigation)

  const onSubmit = async (data: { email: string, password: string }) => {
    try {
      const resp = await doAuth({
        variables: {
          email: data.email,
          password: data.password,
          cfTurnstileToken: 'ksldfjalsd'
        }
      })
      if (resp.error) {
        toast.show({
          title: resp.error.message
        })
        return
      }
      if (!resp.data?.auth) {
        toast.show({
          title: 'No data'
        })
        return
      }

      onPostAuth(resp.data.auth.token, resp.data.auth.user.id)
      // TODO: data
      toast.show({
        title: 'logged in'
      })
    } catch (err: any) {
      console.log(err)
      toast.show({
        title: err.toString()
      })
    }
  }

  return (
    <KeyboardAvoidingView
      h={{
        base: "600px",
        lg: "auto"
      }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Center paddingTop={12} bgColor='gray.100' _dark={{ bgColor: 'gray.900' }}>
        <VStack width="80%" space={4}>
          <FormControl isRequired isInvalid={'email' in errors}>
            <FormControl.Label>Email</FormControl.Label>
            <Controller
              control={control}
              render={(f) => (
                <Input
                  onBlur={f.field.onBlur}
                  placeholder="i@annatarhe.com"
                  onChangeText={(val) => f.field.onChange(val)}
                  value={f.field.value}
                  type='text'
                  keyboardType='email-address'
                  autoCapitalize='none'
                  returnKeyType='next'
                />
              )}
              name='email'
              rules={{ required: 'Field is required', minLength: 3 }}
              defaultValue=""
            />
            <FormControl.ErrorMessage>
              {errors.email?.message}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl isInvalid={'password' in errors}>
            <FormControl.Label>Password</FormControl.Label>
            <Controller
              control={control}
              render={f => (
                <Input
                  onBlur={f.field.onBlur}
                  placeholder="Password"
                  onChangeText={(val) => f.field.onChange(val)}
                  value={f.field.value}
                  type='password'
                  returnKeyType='done'
                />
              )}
              name='password'
              defaultValue=''
            />
            <FormControl.ErrorMessage>
              {errors.password?.message}
            </FormControl.ErrorMessage>
          </FormControl>
          <Button
            isLoading={authResp.loading}
            onPress={handleSubmit(onSubmit)}
            colorScheme="pink"
          >
            Submit
          </Button>
        </VStack>
      </Center>
    </KeyboardAvoidingView>
  )
}

export default AuthLegacyPage