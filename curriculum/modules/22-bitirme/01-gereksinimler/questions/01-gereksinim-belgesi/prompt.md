Kitaplık’ın ilk dosyası bir kod dosyası değil, **gereksinim belgesi**.

## Hazırlık

Proje klasörünü oluştur (Vite iskeletini 3. derste bu klasöre kuracaksın):

```bash
mkdir -p projects/kitaplik
```

Sonra Open Library’yi kendin incele. En az şu üç isteği at, cevaplara göz gezdir:

```bash
curl 'https://openlibrary.org/search.json?q=dune&limit=3&fields=key,title,author_name,first_publish_year,cover_i'
curl 'https://openlibrary.org/works/OL893414W.json'
curl 'https://openlibrary.org/works/OL24252290W.json'
```

## Görev

`projects/kitaplik/REQUIREMENTS.md` dosyasını yaz. Beklenen bölümler:

| Bölüm | İçerik |
| --- | --- |
| Amaç | 2–3 cümle: ne, kimin için, neden |
| Kullanıcı | Somut bir persona: kim, nerede, hangi cihazda kullanıyor |
| Sözlük | En az: eser (work), baskı (edition), eser id’si, okuma listesi, durum |
| Hikâyeler ve kabul kriterleri | Arama, sayfalama, eser detayı, listeye ekleme, listeyi yönetme, kalıcılık. Kriterleri **numarala** (K-1, K-2…) |
| Kenar durumları | `curl` çıktısında gördüğün kirli veriler ve her birinde beklenen davranış |
| İşlevsel olmayan gereksinimler | Erişilebilirlik, mobil, gizlilik, API nezaketi, kalite (CI) |
| Kapsam dışı | v1’de **yapılmayacaklar** |
| Açık sorular | Müşteriye sorman gerekenler |

Dersteki **sabit sözleşme** tablosunun tamamı belgende yer almalı: adresler, sayfa başına 10 sonuç, form gönderilince arama, `kitaplik:reading-list` anahtarı ve arayüz metinleri.

## Kontrol

Bu görevin otomatik testi yok. Bitirince **AI review prompt’unu kopyala** ile belgeni bir yapay zekâ aracına inceletip geri bildirimleri uygula, sonra **Tamamladım**’a bas.

:::tip
Her kabul kriterine “Bunun testini nasıl yazardım?” diye bak. 6. derste kendi testlerini yazarken bu kriterleri test başlığı olarak kullanacaksın.
:::
