## Neden böyle?

- **Alternatif:** Ayrı loading/data/error değişkenleri tutarsız kombinasyonlara izin verirdi.
- **Tuzak:** `data?` ve `error?` içeren tek nesne, başarıda bile veri garantisi vermez.
- **Sektörde:** Ayırt edici union istek durumları ve reducer action’ları için sık kullanılır.
- **Sonraki adım:** Bir sonraki görevde `never` ile yeni durumların unutulmasını engelleyeceksin.
