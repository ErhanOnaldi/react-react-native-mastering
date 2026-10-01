import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Rotation sonrası hangi token’lar saklanır?',
  difficulty: 'orta',
  concepts: ['auth.token-storage', 'auth.refresh'],
  question:
    'DummyJSON refresh isteği token rotation uygular. Sunucu yeni `accessToken` ve `refreshToken` döndürdüğünde istemci ne yapmalı?',
  options: [
    {
      text: 'İki yeni değeri birlikte kaydet; sonraki yenilemede eski `refreshToken` kullanılmasın.',
      correct: true,
      explanation: 'Rotation eski refresh token’ı tüketir; yeni çift birlikte saklanmalıdır.',
    },
    {
      text: 'Yalnız yeni `accessToken` sakla, eski `refreshToken` değerini koru.',
      explanation:
        'Eski refresh token kullanılmış kabul edilir ve sonraki yenilemede 403 alabilir.',
    },
    {
      text: 'Yeni çifti bellekte kullan; depodaki değerleri yenilemeye gerek yok.',
      explanation:
        'F5 sonrası ya da bir sonraki istekte depodaki eski çift okunur ve rotation bozulur.',
    },
  ],
})
