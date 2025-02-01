import { useForm, Controller } from 'react-hook-form'
import React from 'react'
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

	return (
		<View style={styles.container} className="w-96">
			<View style={styles.formGroup}>
				<View>
					<Text style={styles.label}>{t('app.auth.email')}</Text>
				</View>
				<Controller
					control={control}
					render={(f) => (
						<TextInput
							onBlur={f.field.onBlur}
							placeholder="Email"
							onChangeText={(val) => f.field.onChange(val)}
							value={f.field.value}
							keyboardType="email-address"
							autoCapitalize="none"
							returnKeyType="next"
							style={styles.input}
						/>
					)}
					name="email"
					rules={{ required: 'Field is required', minLength: 3 }}
					defaultValue=""
				/>
				<View>
					<Text style={styles.errorText}>{errors.email?.message}</Text>
				</View>
			</View>
			<View style={styles.formGroup}>
				<View>
					<Text style={styles.label}>{t('app.auth.pwd')}</Text>
				</View>
				<Controller
					control={control}
					render={(f) => (
						<TextInput
							onBlur={f.field.onBlur}
							placeholder="Password"
							onChangeText={(val) => f.field.onChange(val)}
							value={f.field.value}
							returnKeyType="done"
							secureTextEntry
							style={styles.input}
						/>
					)}
					name="password"
					defaultValue=""
				/>
				<View>
					<Text style={styles.errorText}>{errors.password?.message}</Text>
				</View>
			</View>
			<TouchableOpacity
				style={styles.button}
				disabled={authResp.loading}
				onPress={handleSubmit(onSubmit)}
			>
				<Text style={styles.buttonText}>{t('app.auth.submit')}</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	formGroup: {
		marginBottom: 20,
	},
	label: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
		marginBottom: 5,
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		padding: 10,
		backgroundColor: '#fff',
	},
	errorText: {
		color: '#ff6b6b',
		marginTop: 5,
		fontSize: 12,
	},
	button: {
		backgroundColor: '#4c669f',
		padding: 15,
		borderRadius: 8,
		alignItems: 'center',
		marginTop: 20,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
})

export default AuthClassicPage
