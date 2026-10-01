Uygulamanın kodlamasına geçmeden önce, tüm bilgi akışını tek bir sahiplik çatısı altında toplayan bir state haritası ve geri dönüşü pahalı mimari kararları gerekçelendiren ADR belgeleri hazırlaman gerekiyor.

## Gereksinimler

`projects/kitaplik/docs/` altında şu iki temel dokümantasyonu tamamla:

1. **State Haritası (`docs/state-map.md`):**
   - Gereksinimlerdeki her bilgiyi (arama sorgusu, sayfa numarası, liste filtresi, açık eser kimliği, arama sonuçları, eser detayları, yazar bilgisi, okuma listesi kayıtları, detay form taslağı, menüdeki liste sayısı, yükleniyor/hata durumları) bir satır olarak listele.
   - Sütunlar: **Bilgi · Kategori · Sahibi (tek doğru kaynak) · Okuyan · Yazan · Kalıcılık**.
   - Kategoriler: Sunucu, İstemci, URL, Form, **Türetilmiş**. Türetilmiş değerlerin saklanmadığını, hangi kaynaktan hesaplandığını açıkça belirt.
   - Belgenin sonuna veri akışını özetleyen kurallar (örneğin "Sunucu verisi `useState` içine kopyalanmaz", "URL tek doğruluk kaynağıdır") ekle.

2. **Mimari Karar Kayıtları (`docs/adr/`):**
   - `0001-....md`: Sunucu verisinin (arama, eser, yazar) nasıl yönetileceğine ve önbellekleneceğine dair karar.
   - `0002-....md`: Okuma listesinin nerede tutulacağına, tarayıcıda nasıl kalıcı hale getirileceğine ve bozuk depolama verisinin nasıl ele alınacağına dair karar.
   - *(İsteğe bağlı)* `0004-....md`: Klasör yapısı (feature-based) ve modül sınırları kararı. `0003` numarası test stratejisi ADR'si için ayrılmıştır.
   - Her ADR'de şu bölümler yer almalıdır: **Durum, Tarih, İlgili gereksinimler, Bağlam, Karar, Değerlendirilen alternatifler (en az iki somut seçenek), Sonuçlar (kazançlar ✅ ve bedeller ⚠️)**.

## Örnek

Bir ADR karar bölümü örneği:

```markdown
# ADR 0001 — Arama durumu URL üzerinde tutulur

- **Durum:** Kabul edildi
- **Tarih:** 2026-09-25
- **İlgili gereksinimler:** K-2, K-4

## Bağlam
Arama sorgusu ve sayfa numarası kullanıcılar tarafından paylaşılabilmeli ve tarayıcı geri/ileri butonlarıyla tutarlı çalışmalıdır.

## Karar
`q` ve `page` parametreleri yalnızca adres çubuğunda tutulur; istemci tarafında ayrı bir kopyası saklanmaz.

## Değerlendirilen alternatifler
- `useState`: Sayfa yenilendiğinde veya bağlantı paylaşıldığında arama kaybolur.
- Global istemci store'u: URL ile iki yönlü senkronizasyon yükü ve yarış koşulları doğurur.

## Sonuçlar
- ✅ Doğal bağlantı paylaşımı ve geri tuşu desteği sağlanır.
- ⚠️ URL'den gelen string değer her okumada sınır doğrulamasına tabi tutulmalıdır.
```

## Sözleşme

- Dosya yolları:
  - `projects/kitaplik/docs/state-map.md`
  - `projects/kitaplik/docs/adr/0001-*.md`
  - `projects/kitaplik/docs/adr/0002-*.md`

## Kısıtlar

- Testler seçtiğin kütüphanenin adına (örneğin Context veya harici bir kütüphane) değil; yalnızca sabit arayüz ve rota sözleşmelerine bakar. Ancak seçilen her kararın somut gerekçesi ve kabul edilen bedeli ADR'de belgelenmelidir.
