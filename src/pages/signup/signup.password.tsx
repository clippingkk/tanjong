import React, { useEffect, useMemo, useState } from 'react';
import SignUpLayout from './layout';
import { Alert, AlertIcon, AlertText, InfoIcon, Input, InputField, Text, View } from '@gluestack-ui/themed';
import { RouteKeys, RouteParamList } from '../../routes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Link } from '@react-navigation/native';
import toast from 'react-hot-toast/headless';

type SignUpPasswordPageProps = NativeStackScreenProps<RouteParamList, RouteKeys.SignUpPassword>

function SignUpPasswordPage(props: SignUpPasswordPageProps) {
  const [pwd, setPwd] = useState<string | undefined>()
  const email = props.route.params.email

  const isPasswordValid = useMemo(() => {
    if (!pwd) {
      return true
    }
    if (pwd.length < 6) {
      return true
    }
    if (pwd.length > 32) {
      return false
    }
    return true
  }, [pwd])

  useEffect(() => {
    props.navigation.setOptions({
      title: email,
      headerRight: (hprops) => (
        <Link
          to={{
            screen: RouteKeys.SignUpOTP, params: {
              email,
              password: pwd
            }
          }}
          disabled={!pwd || !isPasswordValid}
        >
          <Text>
            Next
          </Text>
        </Link>
      )
    })
  }, [pwd])
  return (
    <SignUpLayout title='Password'>
      <View>
        <Input
          borderColor={isPasswordValid ? '$green500' : '$red400'}
        >
          <InputField
            placeholder='password'
            type='password'
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry
            returnKeyType='next'
            value={pwd}
            onEndEditing={() => {
              if (!isPasswordValid || !pwd) {
                toast.error('Please enter a valid password')
                return
              }
              props.navigation.navigate(RouteKeys.SignUpOTP, { email, password: pwd })
            }}
            onChangeText={setPwd}
          />
        </Input>
        {!isPasswordValid && (
          <Alert
            variant='solid'
            action='warning'
            mt={'$3'}
          >
            <AlertIcon as={InfoIcon} w={'$4'} h={'$4'} mr={'$2'} />
            <AlertText>
              Please enter a valid password
            </AlertText>
          </Alert>
        )}
      </View>
    </SignUpLayout>
  );
}

export default SignUpPasswordPage;