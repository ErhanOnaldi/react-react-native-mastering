import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sinema yorum formu',
  difficulty: 'zor',
  concepts: [
    'form.rhf-controller',
    'form.rhf-register',
    'form.rhf-errors',
    'query.useMutation',
    'form.a11y',
  ],
  project: 'sinema',
  focusFiles: ['src/features/watchlists/ReviewForm.tsx'],
  reviewFiles: ['src/features/watchlists/ReviewForm.tsx'],
  hints: [
    'Puan bir özel seçim, yorum ise metin alanı; ikisi aynı form kaynağında buluşmalı ama endpoint yalnız bazı alanları kabul eder.',
    'RHF `Controller` ile controlled yıldızları, `register` ile native textarea alanını bağla; TanStack Query `useMutation` yazma isteğini yönetir.',
    "Puan için başlangıç 0 ve en az 1 kuralı tanımla; mutation payload'ında yalnız `body`, `postId`, `userId` alanlarını oluştur.",
    'HTTP hatasında alan değerlerini koru; `response.ok` false ise mutation error durumuna geçir.',
  ],
  rubric: [
    'Form alanları görünür etiketli ve hatalar erişilebilir mi?',
    'Puan ve yorum alanları doğru aralıkta doğrulanıyor mu?',
    'Gönderilen JSON yalnız endpoint sözleşmesindeki değerleri içeriyor mu?',
    'Pending, success ve error durumları doğru gösteriliyor mu?',
    'Başarıda temizleme ve hata sonrası değer koruma davranışı doğru mu?',
  ],
})
