import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  project: 'atolye',
  title: 'Okuma listesi tasarla',
  difficulty: 'zor',
  concepts: ['arch.state-categories', 'arch.feature-folders', 'capstone.state-map'],
  reviewFiles: ['src/okuma-listesi-tasarla/**'],
  hints: [
    'Üç tür veri var: arama sonucu, açık eserin sunucu verisi ve kullanıcının okuma listesi. Hangisi nerede yaşamalı?',
    'Okuma listesi kullanıcının kendi seçimi; sayfa yenilenince de kalıcı kalması gerekiyorsa tarayıcıda saklanmalı.',
    'Arama metnini ve açık eseri adres çubuğunda tut; okuma listesini kalıcı bir istemci deposunda (ör. localStorage) sakla.',
  ],
  rubric: [
    'Gerçek Open Library araması çalışır ve sonuçlar eser başlıklarını gösterir.',
    'Bir eserin detayına gidilebilir ve gerçek eser verisi görünür.',
    'Kitap okuma listesine eklenip çıkarılabilir; sayfa yenilense de liste kalıcıdır.',
    'Arama ve açık eser adres çubuğunda paylaşılabilir bağlantı olarak tutulur.',
    'Sonuç yokken ve istek hata verince ekran anlaşılır bir durum gösterir.',
    'Arama/eser sunucu verisi, kalıcı okuma listesi ve geçici ekran durumu ayrı sorumluluklarla yönetilir.',
  ],
})
