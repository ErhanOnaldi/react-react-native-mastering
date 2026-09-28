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
    'Okuma listesi durumunu (`want`, `reading`, `read`), verilen puanı ve notu tek bir paylaşılan istemci deposunda yönet; detay formu ve liste sayfası aynı veriyi okusun.',
    'Form yönetiminde React Hook Form ve Zod resolver kullan; durum “Okudum” (`read`) seçildiğinde puan alanını koşullu göster ve 1–5 aralığını zorunlu kıl (`refine` veya `superRefine`).',
    'Kalıcılığı `localStorage` anahtarı `kitaplik:reading-list` üzerinden sağla; depodan okurken veriyi mutlaka Zod şemasıyla doğrula. Bozuk JSON veya şema uyuşmazlığında güvenle boş diziye düş.',
    'Menüdeki liste sayacını (`Okuma listem (n)`) ayrı bir state olarak tutma; mevcut okuma listesi dizisinin uzunluğundan (`list.length`) türet.',
  ],
})
