---
title: "Lint neyi görür, format neyi değiştirir?"
minutes: 14
kind: concept
---

# Lint neyi görür, format neyi değiştirir?

:::pain[Problem]
Sinema’da detay sayfasını `/movie/550` adresinden `/movie/155` adresine götürüyorsun. Adres değişiyor ama ekranda hâlâ Dövüş Kulübü var. `tsc -b` hatasız tamamlanıyor; aynı dosyada artık kullanılmayan bir import da duruyor. Dosyayı baştan sona elle taramak, her benzer dosyada bu iki sorunu yeniden aramak demek.
:::

## İki ayrı kontrol, iki ayrı çıktı

TypeScript derleyicisi tip ilişkilerini denetler. Örneğin sayı beklenen yere string verdiğinde ya da olmayan bir alanı okuduğunda hata verir. Derleyici, effect’in hangi route parametresine bağlı olması gerektiğini veya import edilen bir bileşenin artık kullanılmadığını her projede tek başına söylemez. Bu boşlukta statik kod analizi devreye girer: ESLint kaynak metnini çalıştırmadan inceler, seçtiğin kurallara uymayan kalıpları raporlar.

ESLint’in raporu genellikle dosya, satır, sütun, kural kimliği ve açıklama taşır. Kural kimliği, uyarının hangi ölçüte dayandığını bulmana yardım eder. Bir mesajın error ya da warning olması da config’teki önem seviyesine bağlıdır. Bu çıktı uygulamanın doğru olduğunu kanıtlamaz; yalnızca seçilmiş kuralların bu kaynakta sorun bulmadığını söyler.

```text
src/pages/Detail.tsx
  18:6  error  React Hook useEffect has a missing dependency: 'filmId'  react-hooks/exhaustive-deps
  2:10  error  'Poster' is defined but never used                      @typescript-eslint/no-unused-vars
```

Burada iki farklı iş var. İlk mesaj veri yenilenmesiyle ilgili bir ilişkiyi, ikincisi gereksiz bir tanımı gösteriyor. Satır numarasına git, kodun niyetini oku, sonra mesajın gerçek bir hata olup olmadığına karar ver. Otomatik araçların önerisini körlemesine uygulamak da, uyarıyı hemen susturmak da inceleme değildir.

![Lint kodun anlamlı kalıplarını, format görünüşünü düzenler](diagrams/lint-ve-format.svg)

## Lint ve format sınırını çiz

Zihinde iki farklı soru tut:

1. **Lint, “Bu kod yapısı seçtiğim kurallara uyuyor mu?” diye sorar.** Kullanılmayan tanım, şüpheli eşitlik, kurallara aykırı Hook sırası veya eksik effect bağımlılığı gibi anlam taşıyan kalıpları arar.
2. **Formatter, “Bu kod ortak biçim tercihimize göre nasıl görünmeli?” diye sorar.** Girinti, satır kırma, tırnak ve noktalı virgül gibi sunum kararlarını düzenler.
3. **Tip denetimi, “Bu ifadeler tanımlanan tip sözleşmelerine uyuyor mu?” diye sorar.** Dönüş tipi, parametre tipi ve alan erişimi gibi statik ilişkileri kontrol eder.
4. **Hiçbiri bütün davranışı ispatlamaz.** Derlenip lint’ten ve format kontrolünden geçen kod yine yanlış film gösterebilir; kullanıcı davranışı için test ve elle inceleme gerekir.

ESLint, kuralına bağlı olarak bazı düzeltmeleri otomatik yapabilir. Fakat bir davranış kararını formatter’a bırakmamalısın. Prettier da hatalı effect’i düzeltmez. Bu araçları ayrı sorumluluklarla çalıştırırsan, hata mesajını hangi araçtan bekleyeceğini bilirsin.

## Bir route değişimini izleyelim

Bir sayfa `filmId` prop’unu kullanarak dış sistemden film bilgisi alıyor. İlk render’da `filmId` değeri `550`; effect bu değeri okuyor ama bağımlılık listesi boş. Sonra route parametresi `155` oluyor. Olayları sırayla yazalım:

| Sıra | Kaynakta ne var? | Araç neyi görür? | Olası sonuç |
| --- | --- | --- | --- |
| 1 | `filmId` string, state Film tipi | TypeScript ifadelerin tip uyumunu kontrol eder | Tip hatası yoksa derleme geçer |
| 2 | Effect `filmId` okuyor, liste `[]` | Hook kuralı okunan reaktif değerle listeyi karşılaştırır | Eksik bağımlılık mesajı |
| 3 | `Poster` import edilmiş ama kullanılmıyor | Kullanılmayan tanım kuralı import’u bulur | Satır ve kural kimliği raporlanır |
| 4 | Tırnak ve boşluklar farklı | Formatter biçim kararlarını uygular | Anlam aynı kalırken metin düzenlenir |
| 5 | Kod uygulamada çalıştırılır | Test ve kullanıcı akışı gerçek davranışı görür | Yanlış sonuç ayrıca ortaya çıkabilir |

TypeScript’ten geçmek, ikinci adımdaki ilişkiyi doğrulamış olmaz. Lint, effect’in React yaşam döngüsünde nasıl çalıştığını çalıştırmaz; kaynakta eksik beyanı statik olarak saptar. Düzeltmeden sonra `/movie/155` için yeni veri geldiğini ayrıca uygulamada ya da davranış testinde doğrulaman gerekir.

## Elle incelemeden kurala

Önce aynı kodu araç olmadan düşün. Import listesinde bir bileşen görüyorsun; dosyada başka yerde adı geçmiyorsa kaldırılması muhtemel. Effect gövdesinde prop okunuyor, ancak render’lar arasında ne değiştiğini söyleyen listede bu prop yoksa effect’in hangi durumda yenileneceği belirsizleşiyor. İnsan bu bağı kurabilir, ama her commit’te her dosyayı aynı dikkatle taramak sürdürülebilir değildir.

Bir lint kuralı bu tekrarlı gözlemi makineye taşır. Kuralı hata seviyesinde seçtiğinde CI’da süreci durdurabilir; warning seviyesinde seçtiğinde rapora ekleyip geçiş planı yapabilirsin. Seviyeyi seçmek teknik olduğu kadar ekip kararıdır: canlıda eski veriye yol açan eksik bağımlılığın sessizce kalması kabul edilebilir mi? Genelde cevap hayırdır.

Lint mesajını okurken mesajın türünü de ayırt et. Parse hatası varsa ESLint kaynak kodu kurallara uygun sözdizimine çevirememiş olabilir; parser veya dosya kapsamını incele. Kural mesajı varsa kod parse edilmiştir ve seçilmiş bir ölçüt ihlali bulunmuştur. Warning ile error aynı etkiyi yaratmaz: çoğu lint komutunda ikisi de listelenir, ama CI’da yalnız error build’i durdurabilir. Ekip `--max-warnings 0` seçerse uyarılar da komutun başarısız olmasına neden olabilir; bu tercih config ve script davranışının parçasıdır.

ESLint bazı hatalar için güvenli otomatik düzeltme sunabilir. `--fix` veya editörün “quick fix” önerisi yalnızca kuralın mekanik olarak dönüştürebildiği kodu değiştirir. Eksik effect bağımlılığını eklemek gibi bir düzenleme davranışın ne zaman çalışacağını etkileyebilir; değişikliği yine okuman gerekir. Otomatik düzeltilebilir olması, değişikliğin etkisiz olduğu anlamına gelmez.

Raporu küçük adımlarla incele: dosya yolunu doğrula, ilk mesajın satırına git, işaretlenen kuralı anla, düzeltmenin kullanıcı davranışına etkisini düşün, sonra aynı dosyayı yeniden lint et. Aynı anda onlarca mesaj varsa önce parser ve kapsam sorunlarını çöz; yanlış parser nedeniyle gelen gürültü gerçek kural mesajlarını saklayabilir. Ardından tek tek gerçek sorunlara dön.

Kuralın kapsamını da düşün. Sadece `src` dosyaları inceleniyorsa `scripts` altındaki kod bu denetimden geçmeyebilir. Sadece `.js` dosyaları kapsanıyorsa `.tsx` bileşenler atlanabilir. “Lint temiz” demeden önce hangi dosyaların gerçekten incelendiğini ve kaç hata/uyarı çıktığını kontrol et.

## Önce kırık, sonra doğru

Bir bileşen dosyasını temsilen şu küçük örneğe bak. İsimler eğitim örneğine aittir; amaç unused import işaretini anlamak:

```tsx title="Kırık örnek"
import { Badge } from './Badge'

export function StatusLabel({ status }: { status: string }) {
  return <p>{status}</p>
}
```

`Badge` kullanılmadığı için satır kodun niyetine katkı yapmıyor. Bu uyarıyı `void Badge` gibi yapay bir kullanımla susturmak yerine import’u sil:

```tsx check
export function StatusLabel({ status }: { status: string }) {
  return <p>{status}</p>
}
```

İkinci örnek ilk görevin cevabını vermez; burada başka ad ve arayüz kullandık. Değişikliği küçük tutmak, lint’in gösterdiği bir gerçek sorunu düzeltir ve kodun okunabilir niyetini korur.

## Sık hatalar

:::mistake[Derleme geçtiyse davranış doğrudur]
Belirti → `tsc` başarılı, ama route değişince başlık değişmiyor. Neden → Tipler veri türünü denetledi; effect’in hangi değer değişince yeniden çalışacağını doğrulamadı. Düzeltme → Hook lint kuralını etkinleştir, mesajı incele ve veri değişimi davranışını ayrıca doğrula.
:::

:::mistake[Uyarıyı susturmak düzeltme sanılıyor]
Belirti → Mesaj kayboldu ama eski ekran hâlâ görünüyor. Neden → Kural kapatıldı veya kod anlamsız bir ifadeyle kullanılmış gibi gösterildi. Düzeltme → Önce niyeti belirle; gereksiz import’u kaldır, gerekli reaktif ilişkiyi doğru kur. Susturma gerekiyorsa kapsamı ve gerekçesi kod incelemesinde açık olmalı.
:::

:::mistake[Formatter’dan anlam denetimi beklemek]
Belirti → Dosya Prettier’dan geçiyor ama kullanılmayan import veya eski closure hatası kalıyor. Neden → Formatter kaynak kodun görünüşünü düzenler, uygulama davranışını analiz etmez. Düzeltme → Lint’i kod kuralları için, Prettier’ı görünüş için, testleri davranış için çalıştır.
:::

:::sector
Ekipler genellikle her geliştiriciye aynı lint config’ini verip CI’da aynı komutu çalıştırır. Böylece editörde erken görülen hata, ana dala birleşmeden önce yeniden denetlenir. Lint gözden geçirmeyi hızlandırır; ürün davranışı ve veri doğruluğu için testlerin yerini almaz.
:::

## Özet

- TypeScript tip ilişkilerine; ESLint seçilmiş kaynak kalıplarına; Prettier görünüşe bakar.
- Lint mesajını satır, kural kimliği ve kodun niyetiyle birlikte oku.
- Lint’in temiz olması yalnız etkin kuralları ve kapsanan dosyaları anlatır.
- Biçim denetimi davranışın doğru olduğunu kanıtlamaz.

**Kendini yokla:** Effect içinde okunan `filmId` için lint neden TypeScript’ten farklı bir katkı sağlar?
*Cevap:* TypeScript tipi denetler; Hook lint kuralı effect’in reaktif bağımlılık beyanını denetler.

**Kendini yokla:** Tırnakları tek biçime getirmek için hangi aracı, kullanılmayan import’u bulmak için hangisini beklersin?
*Cevap:* Tırnaklar için Prettier, kullanılmayan import için ESLint.
