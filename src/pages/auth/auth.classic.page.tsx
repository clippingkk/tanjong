import { Button, FormControl, Input, useToast, VStack } from 'native-base'
import { useForm, Controller } from "react-hook-form";
import React from 'react'
import { useAuthLazyQuery } from '../../schema/generated';
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next';
import { z } from 'zod'
import { CKNetworkError } from '../../utils/apollo';

type AuthClassicPageProps = {
  onPostAuth: (token: string, userId: number) => Promise<void>
}

const schema = z
  .object({
    email: z.string().email().min(3).max(255),
    password: z.string().min(6).max(20),
  })
  .required()

function AuthClassicPage(props: AuthClassicPageProps) {
  const { onPostAuth } = props
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const { t } = useTranslation()
  const [doAuth, authResp] = useAuthLazyQuery({
    onCompleted(resp) {
      if (!resp.auth) {
        toast.show({
          title: 'No data'
        })
        return
      }
      onPostAuth(resp.auth.token, resp.auth.user.id)
    },
    onError(err) {
      if (err.networkError) {
        const exp = err.networkError as unknown as CKNetworkError
        const innerErr = exp.result?.errors
        if (innerErr) {
          toast.show({
            title: innerErr[0].message
          })
        }
        return
      }

      toast.show({
        title: err.toString()
      })
    },
  })
  const toast = useToast()

  const onSubmit = (data: { email: string, password: string }) => {
    const cfToken = `mob.bWlzc2luZ195b3UuRllK.${~~(Date.now() / 1000)}`
    return doAuth({
      variables: {
        email: data.email,
        password: data.password,
        cfTurnstileToken: cfToken
      }
    })
  }

  return (
    <VStack width="80%" space={4}>
      <FormControl isRequired isInvalid={'email' in errors}>
        <FormControl.Label>{t('app.auth.email')}</FormControl.Label>
        <Controller
          control={control}
          render={(f) => (
            <Input
              onBlur={f.field.onBlur}
              placeholder="Email"
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
        <FormControl.Label>{t('app.auth.pwd')}</FormControl.Label>
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
        colorScheme="darkBlue"
      >
        {t('app.auth.submit')}
      </Button>
    </VStack>
  )
}

export default AuthClassicPage