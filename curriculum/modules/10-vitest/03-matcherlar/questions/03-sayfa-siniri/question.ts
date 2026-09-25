import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Geçersiz sayfayı açıkça reddet',
  difficulty: 'orta',
  concepts: ['test.matchers', 'fetch.query-params', 'ts.functions'],
  files: ['requirePage.ts'],
  hints: [
    'TMDB sayfaları 1’den başlar; 0, negatif, ondalık ve 500’den büyük değerler geçersiz.',
    '`Number.isInteger(page)` ile tam sayı koşulunu denetle, sınır dışını `RangeError` ile bildir.',
    'Geçersizde `throw new RangeError("Sayfa 1 ile 500 arasında olmalı")`; geçerlide gelen sayıyı döndür.',
  ],
})
