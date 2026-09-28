import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Giriş hatası ve düzeltme',
  difficulty: 'orta',
  concepts: ['fetch.error-handling', 'a11y.basics', 'react.conditional-rendering'],
  files: ['LoginPanel.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    "Hata durumunda hangi state'lerin korunması ve istek sürerken butonun nasıl kilitlenmesi gerektiğini incele.",
    'Form submit işleminde bir `loading` veya `isSubmitting` bayrağı tutarak butonu `disabled` yap ve erken dönüş uygula.',
    'Hata oluştuğunda yalnızca şifreyi temizle ya da dokunma; kullanıcı adını sıfırlayan `setUsername("")` gibi kodları kaldır; `if (isSubmitting) return;` ile çift tıklamayı engelle.',
    'Hata mesajını `role="alert"` ile basarken, başarılı girişte bu hata uyarısını kaldırmayı (`setError(null)`) unutma.',
  ],
})
