Kod yazmadan önce kararlarını kâğıda dök. Bu görevde iki tür belge yazıyorsun.

## 1. State haritası

`projects/kitaplik/docs/state-map.md` dosyasını oluştur.

- `REQUIREMENTS.md`’deki **her bilgiyi** bir satır yap: arama sorgusu, sayfa, liste filtresi, eser id’si, arama sonuçları, eser detayı, yazar adı, okuma listesi, formdaki alanlar, menüdeki liste sayısı, yükleniyor/hata durumu…
- Sütunlar: **Bilgi · Kategori · Sahibi (nerede yaşar) · Okuyan · Yazan · Kalıcılık**.
- Kategoriler: sunucu, istemci, URL, form, **türetilmiş**. Türetilmiş değerlerin sahibi yoktur; neyden hesaplandığını yaz.
- Altına verinin akışını gösteren küçük bir çizim (ASCII ya da Mermaid) ve 2–3 kural ekle (örn. “Sunucu verisi `useState`’e kopyalanmaz”).

## 2. ADR’ler

`projects/kitaplik/docs/adr/` klasöründe **en az iki** ADR yaz:

| Dosya | Karar |
| --- | --- |
| `0001-….md` | Sunucu verisi (arama, eser, yazar) nasıl yönetilecek? |
| `0002-….md` | Okuma listesi nerede tutulacak, nasıl kalıcı olacak, bozuk kayıt nasıl ele alınacak? |
| `0003-….md` *(isteğe bağlı)* | Klasör yapısı ya da form yaklaşımı |

Her ADR’de şu bölümler olsun: **Durum, Tarih, İlgili gereksinimler, Bağlam, Karar, Değerlendirilen alternatifler, Sonuçlar** (artılar ✅ ve bedeller ⚠️).

:::warning
Testler hangi aracı seçtiğine bakmaz; yalnızca sabit sözleşmeye (adresler, metinler, `createRoutes`/`AppProviders` export’ları — 3. derste) bakar. Yani burada verdiğin karar gerçekten **senin**. Redux da seçebilirsin, Zustand da; yeter ki gerekçesi yazılı olsun. Kök `package.json`’da olmayan bir paket seçersen (örn. Zustand), 3. derste onu kendin kurman gerektiğini ADR’nin “Sonuçlar” bölümüne yaz.
:::

## Kontrol

Otomatik test yok. **AI review prompt’unu kopyala** ile belgelerini inceletip geri bildirimleri uygula, commit’le ve **Tamamladım**’a bas.

```bash
git add projects/kitaplik/docs
git commit -m "docs(kitaplik): state haritası ve ilk ADR'ler"
```
