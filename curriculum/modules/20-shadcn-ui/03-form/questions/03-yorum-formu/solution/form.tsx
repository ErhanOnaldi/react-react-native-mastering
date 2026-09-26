import { createContext, useContext, useId, type ComponentProps } from 'react'
import { Slot } from 'radix-ui'
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldError,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'

// ---------- Hazır: RHF bağlantısı ----------

export const Form = FormProvider

const FormFieldContext = createContext<{ name: string } | null>(null)

/** Controller'ı sarar ve alan adını Context'e koyar. */
export function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext>
  )
}

const FormItemContext = createContext<{ id: string } | null>(null)

// ---------- Senin görevin ----------

export function FormItem(props: ComponentProps<'div'>) {
  const id = useId()
  return (
    <FormItemContext value={{ id }}>
      <div {...props} />
    </FormItemContext>
  )
}

export function useFormField(): {
  name: string
  error: FieldError | undefined
  formItemId: string
  formMessageId: string
} {
  const field = useContext(FormFieldContext)
  const item = useContext(FormItemContext)
  if (!field || !item) throw new Error('Form parçaları <FormField> ve <FormItem> içinde kullanılmalı')
  const { getFieldState } = useFormContext()
  // useFormState bu alanın durumuna abone olur: hata değişince yeniden render ederiz.
  const formState = useFormState({ name: field.name })
  const { error } = getFieldState(field.name, formState)
  return {
    name: field.name,
    error,
    formItemId: `${item.id}-control`,
    formMessageId: `${item.id}-message`,
  }
}

export function FormLabel(props: ComponentProps<'label'>) {
  const { formItemId } = useFormField()
  return <label htmlFor={formItemId} {...props} />
}

export function FormControl(props: ComponentProps<typeof Slot.Root>) {
  const { error, formItemId, formMessageId } = useFormField()
  return (
    <Slot.Root
      id={formItemId}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? formMessageId : undefined}
      {...props}
    />
  )
}

export function FormMessage(props: ComponentProps<'p'>) {
  const { error, formMessageId } = useFormField()
  if (!error?.message) return null
  return (
    <p id={formMessageId} {...props}>
      {error.message}
    </p>
  )
}
