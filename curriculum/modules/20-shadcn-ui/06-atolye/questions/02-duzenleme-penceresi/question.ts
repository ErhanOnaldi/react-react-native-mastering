import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Düzenleme penceresi',
  difficulty: 'orta',
  concepts: ['form.rhf-reset', 'zod.resolver', 'a11y.focus'],
  files: ['EditDialog.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Pencere açıkken de gösterilen kayıt değişebilir; formun hangi anda değerlerini tazelemesi gerekir?',
    'Seçilen kaydın kimliği değiştiğinde formun varsayılan değerlerini o kayda göre sıfırla.',
    'Şemayı bir doğrulama kütüphanesinin çözücüsüyle forma bağla; geçersiz girişte kütüphanenin kendi odak davranışı hatalı alana geçer.',
  ],
})
