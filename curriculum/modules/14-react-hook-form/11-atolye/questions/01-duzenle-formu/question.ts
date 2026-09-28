import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Düzenle formu başka kayda geçmiyor',
  difficulty: 'orta',
  concepts: ['form.rhf-reset', 'form.rhf-form-state', 'react.props'],
  files: ['WatchlistEditor.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Sorunu iki ayrı anda incele: başka kayıt seçildiğinde ve hiçbir değişiklik yapmadan Kaydet’e basıldığında.',
    'RHF `defaultValues` yalnız ilk kurulumda uygulanır; yeni kayıt kimliği değişince alan başlangıçlarını güncelle.',
    '`list.id` değişimini izleyip `reset({ name: list.name, description: list.description })` çağır; düğmeyi `formState.isDirty` ile yönet.',
    "Kullanıcı aynı kayıt üzerinde düzenlerken her render'da reset çağırma; bu onun yazısını siler.",
  ],
})
