import { useEffect } from 'react'
import { Dialog } from 'radix-ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: { name: record.name, email: record.email },
  })

  // Pencere açıkken de gösterilen kayıt değişebilir: kimliği değişince formu tazele.
  useEffect(() => {
    reset({ name: record.name, email: record.email })
  }, [record.id, record.name, record.email, reset])

  function onSubmit(values: FormValues) {
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
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <label>
              Ad
              <input {...register('name')} />
            </label>
            {errors.name && <p role="alert">{errors.name.message}</p>}
            <label>
              E-posta
              <input type="email" {...register('email')} />
            </label>
            {errors.email && <p role="alert">{errors.email.message}</p>}
            <button type="submit">Kaydet</button>
            <Dialog.Close asChild>
              <button type="button">İptal</button>
            </Dialog.Close>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
