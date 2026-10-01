import { DraftEditor, type Draft } from './DraftEditor'

const draft: Draft = { id: 'a', title: 'Film notu', dueDate: '' }

export default function Preview() {
  return <DraftEditor draft={draft} onSave={(values) => console.log('kaydedildi', values)} />
}
