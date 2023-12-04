import { useHydrateAtoms } from 'jotai/utils'

export function HydrateAtoms({ initialValues, children }: any) {
  useHydrateAtoms(initialValues)
  return children
}