import React, { useEffect } from 'react';
import { Button, Text, View } from '@gluestack-ui/themed';
import SignUpLayout from './layout';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteParamList, RouteKeys } from '../../routes';
import { Link } from '@react-navigation/native';

type SignUpOTPPageProps = NativeStackScreenProps<RouteParamList, RouteKeys.SignUpOTP>

function SignUpOTPPage(props: SignUpOTPPageProps) {
  const { email, password: pwd } = props.route.params
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
        // disabled={!isPasswordValid}
        >
          <Text>
            Next
          </Text>
        </Link>
      )
    })
  }, [pwd])
  return (
    <SignUpLayout title='OTP'>
      <View>
        <Button
          onPress={() => { }}
          isDisabled={true}
        >
          <Text>
            Refresh
          </Text>
        </Button>
      </View>
    </SignUpLayout>
  );
}

export default SignUpOTPPage;