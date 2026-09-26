## Neden böyle?
Sekme listesini **veriden türettik**. Video yoksa sekme yok; yön tuşları da görünen sekmelerin DOM sırasını izlediği için "üç sekme var" varsayımı hiçbir yerde yazılı değil.

Seçili sekme veriden düştüğünde state'i bir effect içinde `setSelected('summary')` ile "düzeltmek" cazip gelir. Ama `active` zaten render sırasında hesaplanabiliyor: `selected` listede yoksa Özet'i gösteriyoruz. 5. modüldeki kural: türetebildiğin şeyi state'e senkronize etme. Effect yalnızca **gerçek bir dış sistemle** (DOM focus'u) senkronizasyon için kaldı.

Focus'u neden koşullu taşıyoruz? Focus'lu bir öğe DOM'dan kalkınca tarayıcı focus'u `body`'ye düşürür; kullanıcı klavyede nerede olduğunu kaybeder. Ama kullanıcı o sırada sayfanın başka bir yerindeyse (örneğin arama kutusunda) focus'u çalmak daha kötü olur. Bu yüzden yalnızca focus `body`'ye düştüyse Özet'e taşıyoruz.

### Alternatif ve sınır
Videolar sekmesini `disabled` bırakmak da bir seçenek; APG buna izin verir. İçerik hiç yoksa sekmeyi kaldırmak daha az gürültülü.

### Sık hata
`useEffect(() => setSelected('summary'), [videos])` gibi bir effect hem gereksiz bir ek render üretir hem de React Compiler/ESLint'in `set-state-in-effect` kuralına takılır.

### Sıradaki adım
Proje görevinde gerçek detay sayfasında TMDB `videos.results` boş olabiliyor; aynı koşulu orada da kullanacaksın.
