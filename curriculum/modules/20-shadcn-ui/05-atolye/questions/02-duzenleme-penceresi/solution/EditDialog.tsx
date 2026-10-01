import { useEffect } from 'react'
import { Dialog } from 'radix-ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from './ui'

export interface EditDialogRecord {
  id: string
  name: string
  email: string
}

export interface EditDialogProps {
  open: boolean
  record: EditDialogRecord
  onOpenChange: (open: boolean) => void
  onSave: (values: EditDialogRecord) => void
}

const editSchema = z.object({
  name: z.string().trim().min(1, { error: 'Ad gerekli' }),
  email: z.email({ error: 'Geçerli bir e-posta gir' }),
})

type FormValues = z.infer<typeof editSchema>

export function EditDialog({ open, record, onOpenChange, onSave }: EditDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: { name: record.name, email: record.email },
  })

  useEffect(() => {
    form.reset({ name: record.name, email: record.email })
  }, [record.id, form.reset])

  function submit(values: FormValues) {
    onSave({ id: record.id, ...values })
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Kaydı düzenle</Dialog.Title>
          <Dialog.Description>Ad ve e-posta bilgisini güncelle.</Dialog.Description>
          <Form {...form}>
            <form noValidate onSubmit={form.handleSubmit(submit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-posta</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button type="submit">Kaydet</button>
              <Dialog.Close asChild>
                <button type="button">İptal</button>
              </Dialog.Close>
            </form>
          </Form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
