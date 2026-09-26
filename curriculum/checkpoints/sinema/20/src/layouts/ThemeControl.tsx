import { useAppDispatch, useAppSelector } from '@/app/store'
import { setTheme } from '@/features/ui/store/uiSlice'
import { Button } from '@/components/ui/button'

export function ThemeControl() {
  const theme = useAppSelector((state) => state.ui.theme)
  const dispatch = useAppDispatch()
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="mt-3"
      onClick={() => dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'))}
    >
      {theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
    </Button>
  )
}
