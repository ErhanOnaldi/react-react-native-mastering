Sinema'nın detay sayfasında özet, oyuncular ve (varsa) videolar alt alta uzayıp gidiyor. Bunları erişilebilir sekmelere ayır.

## Dosya ve export sözleşmesi
- `src/shared/ui/tabs/Tabs.tsx` → named export `Tabs` (compound):

```tsx
<Tabs defaultValue="summary">
  <Tabs.List aria-label="Film bilgileri">
    <Tabs.Trigger value="summary">Özet</Tabs.Trigger>
    <Tabs.Trigger value="cast">Oyuncular</Tabs.Trigger>
    <Tabs.Trigger value="videos">Videolar</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Panel value="summary">…</Tabs.Panel>
  <Tabs.Panel value="cast">…</Tabs.Panel>
  <Tabs.Panel value="videos">…</Tabs.Panel>
</Tabs>
```

## Tabs davranışı
- `List` → `tablist` (+ `aria-label`), `Trigger` → `<button type="button" role="tab">`, `Panel` → `tabpanel`.
- Seçili sekme `aria-selected="true"` ve `tabIndex={0}`; diğerleri `tabIndex={-1}`.
- Trigger `aria-controls` ile paneline, panel `aria-labelledby` ile sekmesine bağlı. Sayfada iki `Tabs` olsa da kimlikler çakışmasın.
- ArrowRight/ArrowLeft döngüyle, Home/End ilk/son sekmeye gider; seçim ve focus birlikte taşınır.
- Seçili olmayan paneller görünmez (DOM'dan çıkar ya da `hidden`).

## Detay sayfası (`src/pages/MovieDetailsPage.tsx`)
- Mevcut export'u, Suspense/Query akışını, favori/puan/izleme listesi/yorum bölümlerini koru.
- **Film bilgileri** adlı sekmeler:
  - **Özet**: filmin özeti (`overview`).
  - **Oyuncular**: kadro (`credits.cast`, ilk 10 kişi). 550 için "Edward Norton" görünür.
  - **Videolar**: video adları. 550 için "Fight Club Trailer HD". Filmin videosu yoksa bu sekme **hiç olmasın**.
- Önceki görevin **Fragmanı aç** düğmesi sekmelerin dışında kalsın (hep görünür olsun).

## A11y düzeltmesi (rubric)
Detay sayfasındaki ve film kartındaki favori düğmesi hem adı değiştiriyor hem `aria-pressed` kullanıyor (1. dersteki çelişki). Adları koru; çelişen `aria-pressed`'i ve görünür metni tekrar eden `aria-label`'ı kaldır.
