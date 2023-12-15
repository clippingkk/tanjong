import { AlertCircleIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText, Input, InputField, Textarea, TextareaInput } from '@gluestack-ui/themed'
import React from 'react'
import { ControllerFieldState, FormState } from 'react-hook-form'

type FormFieldProps = {
  formState: FormState<any>
  fieldState: ControllerFieldState
  type?: 'text' | 'textarea'
  label: string
  value: any
  helperText?: string
  onChange: any
  errorMessage?: string
}

function FormField(props: FormFieldProps) {
  const { formState, fieldState, label, value, onChange, helperText, errorMessage, type = 'text' } = props
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
      {type === 'text' && (

        <Input>
          <InputField
            type='text'
            value={value}
            onChange={onChange}
            placeholder={label}
          />
        </Input>
      )}
      {type === 'textarea' && (
        <Textarea
          size="md"
          isReadOnly={false}
          isDisabled={formState.disabled}
          isInvalid={fieldState.invalid}
          w="$full"
        >
          <TextareaInput placeholder={label} value={value} onChange={onChange} />
        </Textarea>
      )}

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