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

/** Her alan için benzersiz bir kimlik üretip FormItemContext'e koymalı. */
export function FormItem(props: ComponentProps<'div'>) {
  return <div {...props} />
}

/** İki Context'i ve RHF alan durumunu birleştirmeli. */
export function useFormField(): {
  name: string
  error: FieldError | undefined
  formItemId: string
  formMessageId: string
} {
  return { name: '', error: undefined, formItemId: '', formMessageId: '' }
}

export function FormLabel(props: ComponentProps<'label'>) {
  return <label {...props} />
}

/** Kendi DOM öğesini üretmez; ARIA bağlarını tek çocuğuna geçirmeli. */
export function FormControl(props: ComponentProps<typeof Slot.Root>) {
  return <Slot.Root {...props} />
}

export function FormMessage(props: ComponentProps<'p'>) {
  return null
}
