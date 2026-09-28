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

export function EditDialog(_props: EditDialogProps) {
  return null
}
