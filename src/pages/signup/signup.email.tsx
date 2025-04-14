import {
	Alert,
	AlertIcon,
	AlertText,
	InfoIcon,
	Input,
	InputField,
	Text,
	View,
} from '@gluestack-ui/themed'
import React, { useEffect, useMemo, useState } from 'react'
import SignUpLayout from './layout'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RouteKeys, RouteParamList } from '../../routes'
import { Link, useNavigation } from '@react-navigation/native'

type SignUpEmailPageProps = NativeStackScreenProps<
	RouteParamList,
	RouteKeys.SignUpEmail
>

function checkEmailValid(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function SignUpEmailPage(props: SignUpEmailPageProps) {
	const [email, setEmail] = useState<string | undefined>()

	const navigation = useNavigation()

	const isEmailValid = useMemo(() => {
		if (!email) {
			return true
		}
		if (email.length < 3) {
			return true
		}
		if (email.length > 32) {
			return false
		}
		return checkEmailValid(email)
	}, [email])

	useEffect(() => {
		navigation.setOptions({
			headerRight: (hprops) => (
				<Link
					screen={RouteKeys.SignUpPassword}
					params={{
						email,
					}}
					disabled={!checkEmailValid(email!)}
				>
					<Text>Next</Text>
				</Link>
			),
		})
	}, [email, navigation])

	const inputBorderColor = useMemo(() => {
		if (!email) {
			return '$coolGray500'
		}
		if (email.length < 3) {
			return '$coolGray500'
		}
		return isEmailValid ? '$green500' : '$red400'
	}, [email, isEmailValid])

	return (
		<SignUpLayout title="Email">
			<View>
				<Input borderColor={inputBorderColor} mt={'$3'}>
					<InputField
						placeholder="Email"
						keyboardType="email-address"
						returnKeyType="next"
						autoCapitalize="none"
						value={email}
						onChangeText={setEmail}
					/>
				</Input>
				{!isEmailValid && (
					<Alert variant="solid" action="warning" mt={'$3'}>
						<AlertIcon as={InfoIcon} w={'$4'} h={'$4'} mr={'$2'} />
						<AlertText>Please enter a valid email</AlertText>
					</Alert>
				)}
			</View>
		</SignUpLayout>
	)
}

export default SignUpEmailPage
