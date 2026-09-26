import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Formlu ve kalıcı okuma listesi',
  difficulty: 'zor',
  concepts: [
    'form.rhf-register',
    'form.rhf-errors',
    'zod.resolver',
    'zod.refine',
    'react.context',
    'react.useReducer',
    'router.search-params',
    'react.derived-state',
  ],
  project: 'kitaplik',
  focusFiles: [
    'src/app/providers.tsx',
    'src/features/reading-list/ReadingListForm.tsx',
    'src/features/reading-list/ReadingListPage.tsx',
  ],
  reviewFiles: [
    'src/features/reading-list/**/*.{ts,tsx}',
    'src/app/providers.tsx',
    'src/app/RootLayout.tsx',
  ],
  rubric: [
    'Form RHF ve Zod ile tek şemadan doğrulanıyor mu; “Okudum” dışındaki durumlarda puan zorunluluğu kaldırılıyor mu?',
    'Alan hataları label ile ilişkili ve ekran okuyucunun duyabileceği biçimde mi?',
    'Liste tek kaynaktan okunuyor mu; detay, menü sayısı ve liste görünümü anında tutarlı mı?',
    'localStorage okuması hem JSON sözdizimini hem kayıt biçimini doğruluyor mu; bozuk veri güvenli biçimde boş listeye düşüyor mu?',
    'Kayıt güncelleme aynı eser id’sini çoğaltmıyor; silme ve status filtresi URL ile birlikte çalışıyor mu?',
    'Kalıcılık tarayıcıya özgü olduğu ve hesaplar arası senkron sağlamadığı kullanıcıya açık mı?',
  ],
  hints: [
    'Önce Zod ile kayıt biçimini ve localStorage okuma/yazma sınırını kur. Bozuk veri için boş liste döndür.',
    '`AppProviders` içinde seçtiğin paylaşılan state’i kur; menüde sayıyı listeden hesapla. Detay formu kayıtlı esere göre `defaultValues` almalı.',
    'Şemada `status === "read"` iken `rating` için 1–5 şartını `superRefine` ile `path: ["rating"]` üzerine yaz; `useWatch` ile Puan alanını koşullu göster.',
  ],
})
