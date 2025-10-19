import { useForm, Controller } from 'react-hook-form'
import React, { useState } from 'react'
import { useAuthLazyQuery } from '../../schema/generated'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import toast from 'react-hot-toast/headless'
import { CKNetworkError } from '../../utils/apollo'
import { getTempCFToken } from '../../utils/cfToken'
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'

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
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

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
          toast.error(innerErr[0].message)
        }
        return
      }

      toast.error(err.toString())
    },
  })

  const onSubmit = (data: { email: string; password: string }) => {
    const cfToken = getTempCFToken()
    return doAuth({
      variables: {
        email: data.email,
        password: data.password,
        cfTurnstileToken: cfToken,
      },
    })
  }

  const [focusedField, setFocusedField] = useState<string | null>(null)

  return (
    <View className="w-full">
      {/* Email Field */}
      <View className="mb-5">
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          {t('app.auth.email')}
        </Text>
        <View
          className={`
            border-2 rounded-xl overflow-hidden
            ${focusedField === 'email' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 bg-gray-50'}
            ${errors.email ? 'border-red-500' : ''}
          `}>
          <Controller
            control={control}
            render={(f) => (
              <TextInput
                onBlur={() => {
                  f.field.onBlur()
                  setFocusedField(null)
                }}
                onFocus={() => setFocusedField('email')}
                placeholder="you@example.com"
                placeholderTextColor="#9ca3af"
                onChangeText={(val) => f.field.onChange(val)}
                value={f.field.value}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                className="px-4 py-3.5 text-base text-gray-900"
                autoCorrect={false}
              />
            )}
            name="email"
            rules={{ required: 'Field is required', minLength: 3 }}
            defaultValue=""
          />
        </View>
        {errors.email && (
          <Text className="text-red-500 mt-1.5 text-xs font-medium">
            {errors.email.message}
          </Text>
        )}
      </View>

      {/* Password Field */}
      <View className="mb-6">
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          {t('app.auth.pwd')}
        </Text>
        <View
          className={`
            border-2 rounded-xl overflow-hidden
            ${focusedField === 'password' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 bg-gray-50'}
            ${errors.password ? 'border-red-500' : ''}
          `}>
          <Controller
            control={control}
            render={(f) => (
              <TextInput
                onBlur={() => {
                  f.field.onBlur()
                  setFocusedField(null)
                }}
                onFocus={() => setFocusedField('password')}
                placeholder="••••••••"
                placeholderTextColor="#9ca3af"
                onChangeText={(val) => f.field.onChange(val)}
                value={f.field.value}
                returnKeyType="done"
                secureTextEntry
                className="px-4 py-3.5 text-base text-gray-900"
                autoCorrect={false}
              />
            )}
            name="password"
            defaultValue=""
          />
        </View>
        {errors.password && (
          <Text className="text-red-500 mt-1.5 text-xs font-medium">
            {errors.password.message}
          </Text>
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        className={`
          bg-blue-600 rounded-xl py-4 items-center justify-center
          ${authResp.loading ? 'opacity-70' : 'opacity-100'}
        `}
        disabled={authResp.loading}
        onPress={handleSubmit(onSubmit)}
        activeOpacity={0.8}>
        {authResp.loading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <Text className="text-white text-base font-bold tracking-wide">
            {t('app.auth.submit')}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  )
}

export default AuthClassicPage
