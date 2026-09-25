import { cva, type VariantProps } from 'class-variance-authority'
export const filterVariants = cva('rounded-lg')
export type FilterVariantProps = VariantProps<typeof filterVariants>
