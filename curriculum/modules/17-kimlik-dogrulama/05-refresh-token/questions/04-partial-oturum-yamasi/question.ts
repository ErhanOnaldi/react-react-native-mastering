import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Token çiftinin kısmi güncellemesi',
  difficulty: 'orta',
  concepts: ['ts.partial', 'auth.refresh'],
  question:
    'Refresh cevabı bazen yalnız yeni `accessToken` döndürüyor; saklanan `refreshToken` korunmalı. `type Tokens = { accessToken: string; refreshToken: string }`. Güncelleme parametresi için hangi tip, gelen alanı seçmeli tutarken mevcut tam oturumu ayrı tutar?',
  options: [
    {
      text: '`Partial<Tokens>`; mevcut `Tokens` ile birleştirdikten sonra tam çiftin hâlâ geçerli olduğunu doğrula.',
      correct: true,
      explanation:
        'Doğru. Kısmi yama tipi eksik alanı kabul eder; kalıcı oturumda iki token’ın varlığı ayrıca korunur.',
    },
    {
      text: '`Tokens`; sunucu her zaman iki alanı yollamıyorsa boş string doldur.',
      correct: false,
      explanation:
        'Boş refresh token önceki geçerli oturumu bozabilir; cevap her iki alanı zorunlu tutmuyor.',
    },
    {
      text: '`Pick<Tokens, "refreshToken">`; access token sonra kendiliğinden güncellenir.',
      correct: false,
      explanation:
        'Yenilenen alan access token’dır; yalnız refresh token seçmek asıl güncellemeyi ifade etmez.',
    },
  ],
})
