import { Button, ButtonSpinner, ButtonText, FormControl, Input, InputField, Text, VStack } from '@gluestack-ui/themed'
import { useForm, Controller } from "react-hook-form";
import React from 'react'
import { useAuthLazyQuery } from '../../schema/generated';
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next';
import { z } from 'zod'
import toast from 'react-hot-toast/headless'
import { CKNetworkError } from '../../utils/apollo';
import { getTempCFToken } from '../../utils/cfToken';

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
        toast.error('No data')
        return
      }
      onPostAuth(resp.auth.token, resp.auth.user.id)
    },
    onError(err) {
      if (err.networkError) {
        const exp = err.networkError as unknown as CKNetworkError
        const innerErr = exp.result?.errors
        if (innerErr) {
          toast.error(
            innerErr[0].message
          )
        }
        return
      }

      toast.error(err.toString())
    },
  })

  const onSubmit = (data: { email: string, password: string }) => {
    const cfToken = getTempCFToken()
    return doAuth({
      variables: {
        email: data.email,
        password: data.password,
        cfTurnstileToken: cfToken
      }
    })
  }

  return (
    <VStack width="80%" space='sm'>
      <FormControl isRequired isInvalid={'email' in errors}>
        <FormControl.Label>
          <FormControl.Label.Text>
            {t('app.auth.email')}
          </FormControl.Label.Text>
        </FormControl.Label>
        <Controller
          control={control}
          render={(f) => (
            <Input>
              <InputField
                onBlur={f.field.onBlur}
                placeholder="Email"
                onChangeText={(val) => f.field.onChange(val)}
                value={f.field.value}
                type='text'
                keyboardType='email-address'
                autoCapitalize='none'
                returnKeyType='next'
              />
            </Input>
          )}
          name='email'
          rules={{ required: 'Field is required', minLength: 3 }}
          defaultValue=""
        />
        <FormControl.Error>
          <FormControl.Error.Text>
            {errors.email?.message}
          </FormControl.Error.Text>
        </FormControl.Error>
      </FormControl>
      <FormControl isInvalid={'password' in errors}>
        <FormControl.Label>
          <FormControl.Label.Text>
            {t('app.auth.pwd')}
          </FormControl.Label.Text>
        </FormControl.Label>
        <Controller
          control={control}
          render={f => (
            <Input>
              <InputField
                onBlur={f.field.onBlur}
                placeholder="Password"
                onChangeText={(val) => f.field.onChange(val)}
                value={f.field.value}
                type='password'
                returnKeyType='done'
              />
            </Input>
          )}
          name='password'
          defaultValue=''
        />
        <FormControl.Error>
          <FormControl.Error.Text>
            {errors.password?.message}
          </FormControl.Error.Text>
        </FormControl.Error>
      </FormControl>
      <Button
        isDisabled={authResp.loading}
        onPress={handleSubmit(onSubmit)}
      // colorScheme="darkBlue"
      >
        {authResp.loading && (
          <ButtonSpinner mr="$1" />
        )}
        <ButtonText>

          {t('app.auth.submit')}
        </ButtonText>
      </Button>
    </VStack>
  )
}

export default AuthClassicPage