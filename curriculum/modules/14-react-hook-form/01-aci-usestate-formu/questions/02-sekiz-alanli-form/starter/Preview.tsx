import { ManualWatchlistForm } from './ManualWatchlistForm'
export default function Preview() {
  return <ManualWatchlistForm onSave={(draft) => window.alert(draft.name)} />
}
