Kitaplık uygulamasında kullanıcıların bir esere okuma durumu atamasını, puan ve not vermesini sağlayan bir form ve bu kayıtları tarayıcıda güvenle saklayıp filtreleyen bir okuma listesi özelliği geliştirmen gerekiyor.

## Gereksinimler

Okuma listesi özelliğini ve form entegrasyonunu şu gereksinimlere göre kur:

1. **Paylaşılan İstemci Durumu:**
   - `src/app/providers.tsx` içindeki `AppProviders` bileşeni üzerinden okuma listesi durumunu tüm uygulamaya sağla. Seçtiğin yapı ADR'deki kararınla uyumlu olmalıdır.
2. **Eser Detayındaki Form (`/works/:workId`):**
   - Eser detay sayfasında `Durum`, `Not` alanları ve **Listeye ekle** butonu içeren bir form yer almalıdır.
   - Durum seçenekleri sırasıyla **Okumak istiyorum** (`want`), **Okuyorum** (`reading`) ve **Okudum** (`read`) olmalıdır; varsayılan durum "Okumak istiyorum"dur.
   - **Puan kuralı:** `Puan` alanı yalnızca **Okudum** seçildiğinde görünmelidir. Bu durumda 1–5 arası bir puan seçilmesi zorunludur. Puan seçilmezse gösterilecek hata metni tam olarak **“Okuduğun kitaba 1–5 arası puan ver.”** olmalıdır.
   - **Not kuralı:** Not alanı en fazla 280 karakter olabilir; sınırı aşan girişlerde tam olarak **“Not en fazla 280 karakter olabilir.”** hatası verilmelidir. Hata mesajları ilgili alanın altında erişilebilir biçimde gösterilmelidir.
3. **Kayıt Güncelleme ve Çıkarma:**
   - Daha önce kaydedilmiş bir eserin detayına tekrar gelindiğinde form kayıtlı değerlerle açılmalı; buton metni **Güncelle** olmalıdır. Aynı eser kimliği için ikinci bir kayıt oluşturulmamalıdır.
4. **Üst Menü Sayacı:**
   - Tüm sayfalarda görünen üst gezinme çubuğunda `/reading-list` adresine yönlendiren bağlantı, ekrandaki güncel kayıt sayısını **“Okuma listem (n)”** biçiminde göstermelidir. Sayı dizinin uzunluğundan türetilmelidir.
5. **Okuma Listesi Sayfası (`/reading-list`):**
   - Seviye 1 başlık `h1` **Okuma listem** olmalıdır. Liste boşsa ekranda **“Okuma listen boş.”** mesajı görünmelidir.
   - Kayıtlı her eser için: başlık (detay sayfasına bağlantı), durum metni, puan verilmişse **“Puan: 4/5”** biçiminde puan ve eklenmişse not gösterilmelidir.
   - Her eserin yanında erişilebilir adı **“{başlık} kitabını listeden çıkar”** olan bir silme butonu bulunmalıdır.
6. **URL Filtresi:**
   - `/reading-list?status=read` yalnızca okunanları, `?status=want` yalnızca okunacakları listelemelidir. Filtre parametresi URL üzerinde korunmalıdır; tanımsız durumlarda tüm liste gösterilmelidir.
7. **Kalıcılık ve Güvenlik:**
   - Liste `localStorage` üzerinde **`kitaplik:reading-list`** anahtarıyla saklanmalıdır.
   - Sayfa yenilendiğinde veriler korunmalıdır.
   - Depodan okuma anında bozuk JSON veya şemaya uymayan veriyle karşılaşılırsa uygulama çökmeyip güvenle boş listeye düşmelidir.

## Örnek

Kullanıcı `/works/OL893414W` sayfasını açar:
- Durum olarak "Okudum" seçer; Puan alanı belirir.
- Puana 5 seçip not olarak "Harika bir bilimkurgu klasiği." yazar ve "Listeye ekle"ye tıklar.
- Menüdeki bağlantı anında "Okuma listem (1)" olarak güncellenir.
- `/reading-list?status=read` adresine gidildiğinde Dune, "Puan: 5/5" ve not görüntülenir.
- Sayfa yenilendiğinde kayıtlar aynen korunur.

## Sözleşme

- Dışa aktarılan bileşenler:
  - `src/app/providers.tsx` → `AppProviders` okuma listesi durumunu kapsar.
- Arayüz metinleri:
  - Durum seçenekleri: `Okumak istiyorum`, `Okuyorum`, `Okudum`
  - Form butonları: `Listeye ekle`, `Güncelle`
  - Form hata mesajları: `Okuduğun kitaba 1–5 arası puan ver.`, `Not en fazla 280 karakter olabilir.`
  - Menü bağlantısı: `Okuma listem (n)`
  - Liste başlığı: `Okuma listem`
  - Boş liste mesajı: `Okuma listen boş.`
  - Puan gösterim biçimi: `Puan: 5/5`
  - Silme butonu erişilebilir adı: `{başlık} kitabını listeden çıkar`
- Kalıcılık:
  - `localStorage` anahtarı: `kitaplik:reading-list`

## Kısıtlar

- Liste sayısı ayrı bir state olarak saklanmamalı; okuma listesi dizisinden hesaplanmalıdır.
- Depolamadan okunan veri Zod ile sınırda doğrulanmalıdır.
