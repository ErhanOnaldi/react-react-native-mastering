import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Film detayı için asenkron test yaz',
  difficulty: 'orta',
  concepts: ['test.async', 'test.msw', 'fetch.loading-states'],
  files: ['MovieTitle.test.tsx'],
  hints: [
    'İlk ekrana hemen bak, sonra film başlığı ya da hata gibi istek sonucunu bekle.',
    '`screen.getByRole` ilk durumu; `screen.findByRole` daha sonra beliren sonucu arar.',
    'İstek sayısını `requests()` ile denetle; bulunmayan film için alert bekle.',
  ],
  testWriting: {
    mutants: [
      { id: 'no-loading', label: 'istek sürerken yüklenme durumunu göstermeyen sürüm' },
      { id: 'ignore-http-error', label: '404 yanıtını başarı gibi gösteren sürüm' },
    ],
  },
})
