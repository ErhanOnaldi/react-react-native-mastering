import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Dışa aktarma işlemi',
  difficulty: 'orta',
  concepts: ['redux.async-thunk', 'js.async-await'],
  files: ['exportList.ts'],
  hints: [
    'İşlem tanımı fulfilled değeri üretir; slice da her lifecycle action’ında ortak durumu günceller.',
    '`createAsyncThunk` içinde yeni ID dizisi döndür; ardından `extraReducers` builder’ında üç lifecycle case’ini eşle.',
    'Pending yalnız `status` alanını, fulfilled `status` ile `ids` alanlarını, rejected yalnız `status` alanını güncellesin.',
  ],
})
