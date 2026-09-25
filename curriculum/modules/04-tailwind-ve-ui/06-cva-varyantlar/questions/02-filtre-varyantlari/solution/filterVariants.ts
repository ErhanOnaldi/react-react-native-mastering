import { cva, type VariantProps } from 'class-variance-authority'
export const filterVariants = cva('rounded-lg', {
  variants: {
    tone: { selected: 'bg-sky-700 text-white', plain: 'bg-slate-100 text-slate-900' },
    size: { sm: 'px-2 py-1', md: 'px-4 py-2' },
  },
  defaultVariants: { tone: 'plain', size: 'md' },
  compoundVariants: [{ tone: 'selected', size: 'sm', class: 'font-bold' }],
})
export type FilterVariantProps = VariantProps<typeof filterVariants>
