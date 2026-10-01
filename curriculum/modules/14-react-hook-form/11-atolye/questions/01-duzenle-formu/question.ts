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
    'Kayıt kimliği değiştiğinde forma yeni bir başlangıç ver; `key={list.id}` ile form bileşenini yeniden kurabilir, düğmeyi `formState.isDirty` ile yönetebilirsin.',
    'Başarılı kayıttan sonra `reset(values)` ile yeni değerleri başlangıç yap; hata dalında girdiyi koru.',
  ],
})
