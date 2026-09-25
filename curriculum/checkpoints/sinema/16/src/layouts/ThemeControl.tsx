import { useAppDispatch, useAppSelector } from '@/app/store'
import { setTheme } from '@/features/ui/store/uiSlice'

export function ThemeControl() {
  const theme = useAppSelector((state) => state.ui.theme)
  const dispatch = useAppDispatch()
  return (
    <button
      type="button"
      className="mt-3 rounded border px-3 py-1"
      onClick={() => dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'))}
    >
      {theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
    </button>
  )
}
