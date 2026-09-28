TMDB'de bazı filmlerin videosu yok. Sabit üç sekme render etmek boş bir Videolar paneli ve işe yaramayan bir focus durağı demek. Önizlemedeki film (videosu olmayan Dövüş Kulübü) bunu gösteriyor.

## Görev
`MovieSections({ title, cast, videos })` bileşenini veriden türeyen, klavyeyle çalışan bir sekme grubuna çevir.

## Gereksinimler
- Sekmeler: **Özet**, **Oyuncular** ve yalnızca `videos.length > 0` ise **Videolar**. Başlangıçta Özet seçili.
- Sekmeler bir `tablist` içinde gerçek `<button role="tab">` olsun. Seçili olan `aria-selected="true"` ve `tabIndex={0}`, diğerleri `tabIndex={-1}`.
- ArrowRight/ArrowLeft **görünen** sekmeler arasında döngüyle ilerlesin; seçim ve focus birlikte taşınsın.
- Tek bir `tabpanel` seçili içeriği göstersin: Özet → film başlığı, Oyuncular → isimler virgülle (`Brad Pitt, Edward Norton`), Videolar → video adları virgülle.
- Panel `aria-labelledby` ile seçili sekmeye bağlı olsun (ekran okuyucu "Oyuncular, sekme paneli" desin).
- Videolar seçiliyken video verisi boşalırsa (yeni props) seçim Özet'e dönsün; focus Videolar sekmesindeyse focus da Özet'e geçsin.

Bu, Tabs pattern'inin gerçek veri kirliliğiyle karşılaştığı durum.
