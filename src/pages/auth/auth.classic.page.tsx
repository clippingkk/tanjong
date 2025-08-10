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
	StyleSheet,
	TouchableOpacity,
	Platform,
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
		<View style={styles.container}>
			<View style={styles.formGroup}>
				<Text style={styles.label}>{t('app.auth.email')}</Text>
				<View style={[
					styles.inputContainer,
					focusedField === 'email' && styles.inputContainerFocused,
					errors.email && styles.inputContainerError
				]}>
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
								placeholderTextColor={Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)'}
								onChangeText={(val) => f.field.onChange(val)}
								value={f.field.value}
								keyboardType="email-address"
								autoCapitalize="none"
								returnKeyType="next"
								style={styles.input}
								autoCorrect={false}
							/>
					)}
					name="email"
					rules={{ required: 'Field is required', minLength: 3 }}
					defaultValue=""
				/>
				</View>
				{errors.email && (
					<Text style={styles.errorText}>{errors.email.message}</Text>
				)}
			</View>
			
			<View style={styles.formGroup}>
				<Text style={styles.label}>{t('app.auth.pwd')}</Text>
				<View style={[
					styles.inputContainer,
					focusedField === 'password' && styles.inputContainerFocused,
					errors.password && styles.inputContainerError
				]}>
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
								placeholderTextColor={Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)'}
								onChangeText={(val) => f.field.onChange(val)}
								value={f.field.value}
								returnKeyType="done"
								secureTextEntry
								style={styles.input}
								autoCorrect={false}
							/>
					)}
					name="password"
					defaultValue=""
				/>
				</View>
				{errors.password && (
					<Text style={styles.errorText}>{errors.password.message}</Text>
				)}
			</View>
			
			<TouchableOpacity
				style={[
					styles.button,
					authResp.loading && styles.buttonDisabled
				]}
				disabled={authResp.loading}
				onPress={handleSubmit(onSubmit)}
				activeOpacity={0.8}
			>
				{authResp.loading ? (
					<ActivityIndicator color="#ffffff" size="small" />
				) : (
					<Text style={styles.buttonText}>{t('app.auth.submit')}</Text>
				)}
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
	},
	formGroup: {
		marginBottom: 24,
	},
	label: {
		fontSize: 14,
		fontWeight: '600',
		color: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.9)' : '#1f2937',
		marginBottom: 8,
		letterSpacing: 0.3,
	},
	inputContainer: {
		borderWidth: 2,
		borderColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.2)' : '#e5e7eb',
		borderRadius: 12,
		backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.1)' : '#ffffff',
		overflow: 'hidden',
	},
	inputContainerFocused: {
		borderColor: '#3b82f6',
		backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.15)' : '#ffffff',
		shadowColor: '#3b82f6',
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 2,
	},
	inputContainerError: {
		borderColor: '#ef4444',
	},
	input: {
		paddingVertical: Platform.OS === 'ios' ? 16 : 14,
		paddingHorizontal: 16,
		fontSize: 16,
		color: Platform.OS === 'ios' ? '#ffffff' : '#1f2937',
	},
	errorText: {
		color: '#ef4444',
		marginTop: 6,
		fontSize: 13,
		fontWeight: '500',
	},
	button: {
		backgroundColor: '#2563eb',
		paddingVertical: 16,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 8,
		shadowColor: '#2563eb',
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 4,
		minHeight: 52,
	},
	buttonDisabled: {
		opacity: 0.7,
	},
	buttonText: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: '700',
		letterSpacing: 0.5,
	},
})

export default AuthClassicPage
