Sinema film detayında özet, oyuncular ve mevcutsa videolar bölümü sayfayı uzatıyor. İçerikleri fare ve klavyeyle kullanılabilen sekme gruplarına dönüştür.

## Gereksinimler

- Özet, Oyuncular ve yalnızca video varsa Videolar sekmesini göster.
- Seçili sekme erişilebilir olarak işaretlensin; Tab gruba bir kez girsin, ok tuşları ve Home/End seçimi ve focus'u taşısın.
- Seçili panel görünsün ve sekmesiyle programatik olarak ilişkilensin.
- Bir sayfada iki grup varsa id'ler çakışmasın.
- 550 filminde Oyuncular panelinde Edward Norton, Videolar panelinde Fight Club Trailer HD görünsün.
- Videosu olmayan filmde Videolar sekmesi bulunmasın.
- Fragman düğmesi sekme grubunun dışında ve her zaman görünür kalsın.
- Detay sayfası ile film kartındaki favori kontrollerinde değişen eylem adı korunurken çelişen basılı durumu ve yinelenen erişilebilir ad kaldırılmış olsun.
- Sayfanın mevcut export'u, Suspense/Query akışı, puanlama, izleme listesi ve yorum bölümleri çalışmaya devam etsin.

## Örnek

Video verisi olmayan filmde sekmeler Özet ve Oyuncular'dır. Özet seçiliyken ArrowRight Oyuncular'ı seçer; focus ve görünen panel birlikte değişir.

## Sözleşme

- `src/shared/ui/tabs/Tabs.tsx` → named export `Tabs`.
- Compound API: `Tabs.List({ 'aria-label' })`, `Tabs.Trigger({ value })`, `Tabs.Panel({ value })`; tab/panel rolleri kullanılmalı.
- `src/pages/MovieDetailsPage.tsx` içindeki mevcut named export korunur.
