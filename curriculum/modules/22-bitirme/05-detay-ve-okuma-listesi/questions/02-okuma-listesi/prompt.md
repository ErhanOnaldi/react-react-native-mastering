Sinema'daki favoriler yalnız bir işaretti. Kitaplık'ta her eser için **durum, puan ve not** tutacaksın; detay formu ve liste sayfası aynı veriyi kullanacak.

## Sözleşme

| Yer | Beklenen davranış |
| --- | --- |
| `src/app/providers.tsx` | `AppProviders` içinden okuma listesinin paylaşılan state'ini de sağla. Seçtiğin state mimarisi ADR'ndeki kararla uyumlu olsun. |
| `/works/:workId` | `Durum` (varsayılan **Okumak istiyorum**), `Not` ve **Listeye ekle** butonlu form. Durum seçenekleri sırasıyla **Okumak istiyorum**, **Okuyorum**, **Okudum**. |
| Puan kuralı | `Puan` yalnız **Okudum** seçilince görünür; o durumda 1–5 arası değer zorunlu. Puan yoksa hata metni tam olarak **“Okuduğun kitaba 1–5 arası puan ver.”** olsun. |
| Not kuralı | 280 karakter sınırını aşan girdi kaydedilmez; hata **“Not en fazla 280 karakter olabilir.”** olsun. Hataları alanın altında erişilebilir şekilde göster. |
| Kayıtlı eser | Detaya yeniden gelince form kayıtlı değerlerle açılsın; buton **Güncelle** olsun, ikinci kayıt oluşmasın. Listeden çıkarma yolu bulunsun. |
| Üst menü | Her sayfada `/reading-list` linki **“Okuma listem (n)”** biçiminde güncel sayıyı göstersin. |
| `/reading-list` | `h1` **Okuma listem**; liste boşsa **“Okuma listen boş.”**. Kayıtlı eser için başlık detay linki, durum, varsa **“Puan: 4/5”** biçimi ve not. Her eserde erişilebilir **“{başlık} kitabını listeden çıkar”** butonu. |
| Filtre | `?status=read` okunanları, `?status=want` okunacakları gösterir. Filtre URL'de kalır; bozuk değer tüm listeye düşebilir. |
| Kalıcılık | `localStorage` anahtarı **`kitaplik:reading-list`**. Yenilemede liste gelir. Bozuk JSON, yanlış kayıt biçimi veya dizi olmayan değer uygulamayı çökertmez; boş listeyle başlar. |

## Örnek akış

`/works/OL893414W` → **Okudum** seç → puan 5, not “Baharat akmalı.” → **Listeye ekle** → menü **Okuma listem (1)**. `/reading-list?status=read` açıldığında Dune, **Puan: 5/5** ve not görünür. Sayfayı yenileyince kayıt korunur.

Saklanan veriyi **okurken** de biçimini doğrula. State haritanda “liste sayısı”nı ayrı state olarak işaretlemediysen burada da ayrı state ekleme; kayıt sayısından hesapla.
