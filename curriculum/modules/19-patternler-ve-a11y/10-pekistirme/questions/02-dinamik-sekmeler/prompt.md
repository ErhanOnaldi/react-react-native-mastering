Bazı filmlerde video verisi yok. Boş bir Videolar sekmesi ve focus durağı bırakma; görünen sekmeler ile seçili panel her zaman eşleşsin.

## Gereksinimler

- Sekmeler Özet, Oyuncular ve yalnız video varsa Videolar olsun; başlangıçta Özet seçili.
- Her sekme `tablist` içindeki erişilebilir bir button tab olsun. Seçili olan `aria-selected="true"` ve `tabIndex=0`; diğerleri `-1` olsun.
- ArrowRight/ArrowLeft görünen sekmeler arasında döngü yapsın; focus ve seçim birlikte taşınsın.
- Tek `tabpanel` seçili içeriği göstersin: Özet film başlığı, diğerleri adları virgülle birleştirir.
- Panel adı ve id ilişkisi seçili sekmeye bağlı olsun.
- Video verisi güncelleme sonrası boşalırsa Videolar sekmesi kaldırılsın, Özet seçilsin. Focus kaldırılan sekmedeyse Özet focus alsın.

## Örnek

`title="Matrix"`, `cast=["Keanu Reeves"]`, `videos=[]` için yalnız Özet ve Oyuncular görünür. Özet'te ArrowRight, Oyuncular'ı seçer; orada tekrar ArrowRight, Özet'e döner.

## Sözleşme

- `MovieSections.tsx` içinden named export `MovieSections({ title, cast, videos })`.
- `title: string`, `cast: string[]`, `videos: string[]`.
- Roller: `tablist`, `tab`, `tabpanel`; sekme adları Özet, Oyuncular, Videolar.
