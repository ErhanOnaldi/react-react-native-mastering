## Neden böyle?

İki tasarım da dışarıya aynı sözleşmeyi verebilir: `role="radiogroup"` + `role="radio"` ile erişilebilir isimler, ok tuşuyla gezinme, seçim yapılınca kaybolan bir hata. Bu görevde tek yapılandırma listesini (`OPTIONS`) seçtim çünkü üç seçenek de aynı şekle sahip (`value`+`label`) ve sayı sabit; küçük parçalara bölmek (`ChoiceControl.Option` gibi) burada okumayı kolaylaştırmaz, yalnızca dolaylama ekler.

Hata ile seçim kontrolü `aria-describedby` üzerinden bağlanıyor: ekran okuyucu kullanıcısı radiogroup'a odaklandığında hem etiketini ("Kitap biçimi") hem de varsa hata açıklamasını duyar. Seçim yapıldığı an `error` state'i temizleniyor; böylece hata mesajı yalnızca gerçekten geçersiz durumda görünür.

**Alternatif yaklaşım:** Küçük parçalar API'si şöyle görünürdü: `<ChoiceControl.Root value={value} onChange={setValue}><ChoiceControl.Option value="ekitap">E-kitap</ChoiceControl.Option>...</ChoiceControl.Root>`. Bu, seçenek başına özel içerik (ikon, alt açıklama) gerektiğinde daha okunur olur; bedeli, ortak state'i taşımak için bir Context kurmandır (tıpkı 4. derste `Tabs` için yapacağın gibi).

**Genişleme maliyeti:** Tek yapılandırma listesinde yeni bir seçenek eklemek `OPTIONS` dizisine bir satır eklemektir. Küçük parçalar API'sinde ise çağıran tarafın JSX'ine yeni bir `<ChoiceControl.Option>` eklemesi gerekir — çağıran taraf sayısı arttıkça bu, aynı değişikliği birden çok yerde tekrar etmek anlamına gelebilir.

**Köprü:** shadcn/ui modülünde (20) aynı radiogroup/tab deseninin Radix ile hazır, test edilmiş bir sürümünü kullanacaksın; burada kendi elinle kurduğun sözleşme, o kütüphanenin neyi çözdüğünü anlamanı sağlıyor.
