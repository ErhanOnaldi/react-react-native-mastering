import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sinema izleme listesi formu',
  difficulty: 'zor',
  concepts: [
    'form.rhf-register',
    'form.rhf-field-array',
    'form.rhf-errors',
    'form.a11y',
    'ts.omit',
    'ts.partial',
    'react.custom-hooks',
  ],
  project: 'sinema',
  focusFiles: [
    'src/features/watchlists/WatchlistForm.tsx',
    'src/features/watchlists/useWatchlists.ts',
    'src/features/watchlists/types.ts',
  ],
  reviewFiles: [
    'src/features/watchlists/WatchlistForm.tsx',
    'src/features/watchlists/useWatchlists.ts',
    'src/features/watchlists/types.ts',
  ],
  hints: [
    'Kalıcı liste kaydı ile kullanıcının yazdığı form değerlerini ayır; kimlik ve tarih form alanı değildir.',
    '`Omit` ile form tipini domain tipinden türet; RHF `useFieldArray` ve `useWatchlists` custom hook ile alanları ve kalıcılığı yönet.',
    "Local storage'dan ilk değeri oku, eklemede yeni kayıtla React state'i ve depoyu birlikte güncelle; başarılı submit'te `reset()` çağır.",
    'Etiket satırlarını nesne olarak sakla; boş etiketleri atma ancak görev sözleşmesinde istenmediği için veriyi sessizce değiştirme.',
  ],
  rubric: [
    'Form alanları görünür label taşıyor; başlık hatası input ile ilişkilendirilmiş mi?',
    'Form ve tam kayıt tipleri doğru ayrılmış; patch tipi form alanlarının alt kümesini destekliyor mu?',
    'Etiket ekleme/silme sırası ve satır kimliği korunuyor mu?',
    'Yeni kayıt id/tarih alıyor ve localStorage ile hook state aynı sonucu gösteriyor mu?',
    'Hata sonrası veri korunuyor, başarı sonrası durum ve form temizliği tutarlı mı?',
  ],
})
