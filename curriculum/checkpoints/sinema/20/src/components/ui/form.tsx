import { createContext, useContext, useId, type ComponentProps } from 'react'
import { Slot, type Label as LabelPrimitive } from 'radix-ui'
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'
import { cn } from '@/shared/lib/cn'
import { Label } from './label'

export const Form = FormProvider

const FormFieldContext = createContext<{ name: string } | null>(null)
const FormItemContext = createContext<{ id: string } | null>(null)

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext>
  )
}

// CLI `useFormField`'ı da export eder. Dışarıda kullanmadığımız ve react-refresh lint kuralı
// bileşen dosyasından hook export'u istemediği için modül içinde tutuyoruz.
function useFormField() {
  const field = useContext(FormFieldContext)
  const item = useContext(FormItemContext)
  if (!field || !item)
    throw new Error(
      'Form parçaları <FormField> ve <FormItem> içinde kullanılmalı.',
    )
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: field.name })
  const fieldState = getFieldState(field.name, formState)
  return {
    name: field.name,
    formItemId: `${item.id}-form-item`,
    formDescriptionId: `${item.id}-form-item-description`,
    formMessageId: `${item.id}-form-item-message`,
    ...fieldState,
  }
}

export function FormItem({ className, ...props }: ComponentProps<'div'>) {
  const id = useId()
  return (
    <FormItemContext value={{ id }}>
      <div
        data-slot="form-item"
        className={cn('grid gap-2', className)}
        {...props}
      />
    </FormItemContext>
  )
}

export function FormLabel({
  className,
  ...props
}: ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField()
  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn('data-[error=true]:text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

export function FormControl(props: ComponentProps<typeof Slot.Root>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
  return (
    <Slot.Root
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}

export function FormDescription({ className, ...props }: ComponentProps<'p'>) {
  const { formDescriptionId } = useFormField()
  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

export function FormMessage({ className, ...props }: ComponentProps<'p'>) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error.message ?? '') : props.children
  if (!body) return null
  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn('text-sm text-destructive', className)}
      {...props}
    >
      {body}
    </p>
  )
}
