import React, { useEffect, useMemo, useState } from 'react';
import SignUpLayout from './layout';
import { Alert, AlertIcon, AlertText, Button, InfoIcon, Input, InputField, Text, View } from '@gluestack-ui/themed';
import { RouteKeys, RouteParamList } from '../../routes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
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
      return false
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
        <Button
          // disabled={!pwd || !isPasswordValid}
          variant='link'
          onPress={() => {
            if (!pwd || !isPasswordValid) {
              toast.error('password at least 6 characters long')
              return
            }
            props.navigation.navigate(RouteKeys.SignUpOTP, { email, password: pwd })
          }}
        >
          <Text>
            Next
          </Text>
        </Button>
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
              Password must be at least 6 characters long and less than 32 characters
            </AlertText>
          </Alert>
        )}
      </View>
    </SignUpLayout>
  );
}

export default SignUpPasswordPage;