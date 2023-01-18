import { useColorModeValue } from "native-base";

export function useTextColor(): string {
  return useColorModeValue('grey.100', 'grey.900')
}