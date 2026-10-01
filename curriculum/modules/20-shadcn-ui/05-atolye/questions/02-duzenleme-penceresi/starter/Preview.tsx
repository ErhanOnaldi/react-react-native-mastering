import { useState } from 'react'
import { EditDialog, type EditDialogRecord } from './EditDialog'

const records: EditDialogRecord[] = [
  { id: '1', name: 'Ada Lovelace', email: 'ada@example.com' },
  { id: '2', name: 'Grace Hopper', email: 'grace@example.com' },
]

export default function Preview() {
  const [open, setOpen] = useState(true)
  const [recordId, setRecordId] = useState('1')
  const record = records.find((r) => r.id === recordId) ?? records[0]!

  return (
    <div>
      <button onClick={() => setRecordId('1')}>Ada'yı seç</button>
      <button onClick={() => setRecordId('2')}>Grace'i seç</button>
      <button onClick={() => setOpen(true)}>Pencereyi aç</button>
      <EditDialog
        open={open}
        record={record}
        onOpenChange={setOpen}
        onSave={(values) => {
          console.log('kaydedildi', values)
          setOpen(false)
        }}
      />
    </div>
  )
}
