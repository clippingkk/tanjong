import { AlertCircleIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText, Input, InputField } from '@gluestack-ui/themed'
import React from 'react'
import { ControllerFieldState, FormState } from 'react-hook-form'

type FormFieldProps = {
  formState: FormState<any>
  fieldState: ControllerFieldState
  label: string
  value: any
  helperText?: string
  onChange: any
  errorMessage?: string
}

function FormField(props: FormFieldProps) {
  const { formState, fieldState, label, value, onChange, helperText, errorMessage } = props
  return (
    <FormControl
      size="md"
      isDisabled={formState.disabled}
      isInvalid={fieldState.invalid}
      isReadOnly={false}
      isRequired={false}
    >
      <FormControlLabel mb="$1">
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>
      <Input>
        <InputField
          type='text'
          value={value}
          onChange={onChange}
          placeholder='Your name'
        />
      </Input>
      <FormControlHelper>
        <FormControlHelperText>
          {helperText}
        </FormControlHelperText>
      </FormControlHelper>
      <FormControlError>
        <FormControlErrorIcon as={AlertCircleIcon} />
        <FormControlErrorText>
          {errorMessage}
        </FormControlErrorText>
      </FormControlError>
    </FormControl>
  )
}

export default FormField