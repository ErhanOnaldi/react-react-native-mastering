---
title: "Testleri okumak"
minutes: 16
kind: concept
---

# Testleri okumak

:::pain[Problem]
Kodu yazdın, "Çalıştır" butonuna bastın ve ekran kırmızıya büründü: onlarca satır İngilizce hata mesajı, karmaşık dosya yolları ve yığın izleri (stack trace). Panikle terminali kapatıp kodun orasını burasını rastgele değiştirmeye başladın — ama neyin yanlış olduğunu bilmediğin için her denemede başka bir yer bozuldu.
:::

## Test bir çalıştırılabilir şartnamedir

Yazılım geliştirirken karşına çıkan en büyük tuzaklardan biri, kodun ne yapması gerektiğini tahmin etmeye çalışmaktır. "Kullanıcı adı boş gelirse ne dönecek?", "Puan sıfırsa ekranda ne yazacak?", "Geçersiz bir id verildiğinde hata mı fırlatılacak yoksa null mı dönecek?" gibi soruların yanıtını kafanda kurmak yerine doğrudan **test dosyasından** okursun.

Testler yalnızca hata yakalamak için yazılmış bekçiler değildir; testler aynı zamanda projenin **çalıştırılabilir gereksinim belgesidir** (executable specification). Bir fonksiyonun hangi girdiye karşılık hangi çıktıyı vermesi gerektiği, hangi sınır durumlarını desteklediği ve nerede nasıl davranacağı test dosyasında satır satır kayıtlıdır.

Platformumuzda ve modern JavaScript dünyasında testler **Vitest** ile koşulur. Vitest testleri belirli bir düzende organize eder:

1. **`describe` bloğu:** Birbiriyle ilişkili bir grup testi çatısı altında toplar. Genelde test edilen fonksiyonun ya da bileşenin adını taşır.
2. **`it` (veya `test`) bloğu:** Tek bir davranışı, yani tek bir gereksinimi tanımlar. İyi yazılmış bir test adı, doğrudan bir gereksinim cümlesidir (örneğin: `"0 puan için 'Henüz oy yok' döner"`).
3. **`expect` ve matcher:** Gerçekleşen sonuç ile beklenen şartı karşılaştırır. `toBe`, `toEqual`, `toThrow` gibi matcher'lar bu karşılaştırmayı yapar.

Bu yapı yazılım mühendisliğinde evrensel bir düzene oturur: **Hazırla → Çalıştır → Doğrula** (Arrange → Act → Assert ya da kısaca AAA).

![Test anatomisi: hazırla, çalıştır, doğrula](diagram:test-anatomisi)

Modeli şu temel kurallarla zihninde sabitle:

1. **1 · Hazırla (Arrange):** Fonksiyonun ihtiyaç duyduğu girdiler, sahte veriler veya başlangıç durumu oluşturulur.
2. **2 · Çalıştır (Act):** Test edilen birim (fonksiyon, hook veya bileşen) hazırlanan girdilerle çağrılır ve ürettiği sonuç bir değişkene alınır.
3. **3 · Doğrula (Assert):** `expect(sonuc).toBe(beklenen)` satırıyla elde edilen değer şartnameyle kıyaslanır. Eşleşme yoksa test hemen o satırda durur ve rapor üretir.
4. **Mutant yakalama (Mutant):** Kodda bilerek veya kaza eseri yapılan mantık hatalarına "mutant" denir. Kaliteli bir test paketi, kodun yanlış bir değer üretmesi durumunda anında kırmızıya düşerek hatayı yakalar.

:::model[Test anatomisi]
Her test fonksiyonu küçük bir deney laboratuvarıdır. Önce laboratuvar ortamı ve deney tüpleri hazırlanır (Arrange), deney gerçekleştirilir (Act), ardından mikroskop altına bakılarak beklenen reaksiyonun gerçekleşip gerçekleşmediği doğrulanır (Assert). Test kırmızı yanıyorsa hipotezinle gözlemin uyuşmuyordur.
:::

## Test sonucunu adım adım okuyalım

Bir test kaldığında terminalde veya platformun sonuç panelinde beliren çıktıyı satır satır okumayı öğrenmek, geliştirme hızını en az üç katına çıkarır. Aşağıdaki tipik Vitest hata raporunu inceleyelim:

```text
FAIL src/utils/formatCurrency.test.ts > formatCurrency > sıfır değerinde ücretsiz etiketi döner
AssertionError: expected '0 ₺' to be 'Ücretsiz' // Object.is equality

- Expected:
"Ücretsiz"

+ Received:
"0 ₺"

 ❯ src/utils/formatCurrency.test.ts:14:38
     12|   it('sıfır değerinde ücretsiz etiketi döner', () => {
     13|     const result = formatCurrency(0)
     14|     expect(result).toBe('Ücretsiz')
       |                            ^
     15|   })
```

Bu raporda dikkat etmen gereken 4 kritik bilgi vardır:

| Sıra | Alan | Gördüğün Değer | Anlamı ve Çıkarım |
| --- | --- | --- | --- |
| 1 | Başarısız test yolu | `formatCurrency.test.ts > formatCurrency > sıfır değerinde...` | Hangi dosyadaki, hangi `describe` içindeki, hangi gereksinim cümlesi patladı? |
| 2 | Hata türü | `AssertionError` | Kod çökmedi, söz dizimi doğru; sadece `expect` şartı sağlanamadı. |
| 3 | `- Expected` (Beklenen) | `"Ücretsiz"` | Testin sözleşmeye göre beklediği doğru değer. |
| 4 | `+ Received` (Gelen) | `"0 ₺"` | Senin kodunun o girdi için gerçekten ürettiği hatalı değer. |

Rastgele kod değiştirmek yerine gözün hemen `- Expected` ve `+ Received` satırlarına gitmelidir. Burada fark aşikardır: Kod `0` sayısı geldiğinde özel durumu yakalayamamış ve standart para birimi biçimlendirmesine girerek `"0 ₺"` üretmiştir. Yapman gereken tek şey `if (amount === 0) return 'Ücretsiz'` kontrolünü eklemektir.

## Tip hatası ile test hatasını ayırmak

Platformumuzda kodunu çalıştırdığında iki ayrı denetim mekanizması devreye girer:
1. **TypeScript derleyicisi (`tsc`):** Kodun tiplerini inceler. Değişkenlerin, fonksiyon parametrelerinin ve dönüş tiplerinin kontrata uyup uymadığını kontrol eder.
2. **Vitest test çalıştırıcısı:** Kodu fiilen çalıştırarak mantıksal sonuçları dener.

Bu iki hata türünün mesajları birbirinden tamamen farklıdır:

```text
// ÖRNEK 1: TIP HATASI (TypeScript)
src/utils/formatCurrency.ts:3:10 - error TS2322: Type 'null' is not assignable to type 'string'.
3   return null
           ~~~~
```

```text
// ÖRNEK 2: MANTIKSAL TEST HATASI (Vitest)
FAIL src/utils/formatCurrency.test.ts > formatCurrency > para birimi ekler
AssertionError: expected '100' to be '100 ₺'
```

Tip hatasında `TSxxxx` kodu ve dosyadaki satır numarası gösterilir. Bu aşamada testler henüz koşulmamıştır bile; kod derleme bariyerini aşamamıştır. Mantıksal test hatasında ise kod başarıyla derlenmiş, çalışmış fakat beklenen sonucu vermemiştir.

## Kırık örnek

Para birimini biçimlendiren bir yardımcı fonksiyon üzerinden süreci izleyelim. Gereksinimimiz şudur: Pozitif sayılara `" ₺"` eklenmeli, sıfır veya negatif sayılarda ise `"Ücretsiz"` dönmelidir.

Aşağıdaki implementasyon ilk bakışta doğru görünebilir:

```ts
export function formatTicketPrice(amount: number): string {
  // Kırık: Sınır durumları göz ardı edilmiş
  return `${amount} ₺`
}
```

Bu fonksiyon için yazılan test dosyasını çalıştırdığımızda:

```text
FAIL formatTicketPrice.test.ts > formatTicketPrice > 0 değerinde Ücretsiz döner
AssertionError: expected '0 ₺' to be 'Ücretsiz'
- Expected: "Ücretsiz"
+ Received: "0 ₺"

FAIL formatTicketPrice.test.ts > formatTicketPrice > negatif değerde Ücretsiz döner
AssertionError: expected '-10 ₺' to be 'Ücretsiz'
- Expected: "Ücretsiz"
+ Received: "-10 ₺"
```

İki test kalmıştır. İki raporda da `Received` değeri, kodun koşulsuz olarak string şablonu (`${amount} ₺`) döndürdüğünü açıkça göstermektedir.

## Doğru örnek

Test çıktısından edindiğimiz bilgilerle fonksiyonumuzu erken dönüş (early return) deseni kullanarak düzeltelim:

```ts check
export function formatTicketPrice(amount: number): string {
  if (amount <= 0) {
    return 'Ücretsiz'
  }
  return `${amount} ₺`
}
```

Fonksiyon yeniden çalıştırıldığında tüm `AssertionError` mesajları kaybolur ve Vitest çıktısı yeşile döner:

```text
✓ formatTicketPrice.test.ts (3 tests) 4ms
  ✓ pozitif fiyata para birimi ekler (12ms)
  ✓ 0 değerinde Ücretsiz döner (1ms)
  ✓ negatif değerde Ücretsiz döner (1ms)
```

## Bilinmeyen gereksinimi testten keşfetmek

Geliştiricilerin sıklıkla düştüğü bir yanılgı, görev metninde veya Jira kartında yazan 1-2 cümlenin projenin tüm kapsamını anlattığını varsaymaktır. Gerçek dünyada ürün yöneticileri ya da tasarımcılar en uç sınır durumlarını metne dökmeyi unutabilir; ancak kıdemli bir mühendis bu durumları test dosyasına çoktan eklemiştir.

Örneğin görev metninde yalnızca şu yazıyor olabilir:
*"Kullanıcının ad ve soyadının baş harflerini alıp avatar için iki harfli kısaltma üreten bir fonksiyon yaz."*

Hemen koda dalıp `name.split(' ')[0][0] + name.split(' ')[1][0]` yazarsan testler patlayabilir. Çünkü test dosyasına baktığında şunları görürsün:

```ts
it('tek isim verildiğinde tek harf döner', () => {
  expect(getInitials('Cher')).toBe('C')
})

it('ikiden fazla kelime varsa ilk ve son kelimenin harfini alır', () => {
  expect(getInitials('Ahmet Hamdi Tanpınar')).toBe('AT')
})

it('fazladan boşlukları temizler', () => {
  expect(getInitials('   Halide   Edib   ')).toBe('HE')
})
```

Gördüğün gibi görev metninde hiç geçmeyen üç hayati kural (tek isim, üç isim ve gereksiz boşluklar) doğrudan test dosyasında açıkça yazılıdır! Testi okumadan kod yazmaya başlayan biri bu gereksinimleri tahmin edemez.

## Sınır durumları ve sık hatalar

:::mistake[Sık hata: Sadece hata veren son satıra bakıp içeriği okumamak]
Belirti → Test patladığında terminalin en altında kırmızı bir hata görünce hemen rastgele satırları değiştirmek.  
Neden → Vitest çıktısının en altındaki kısımlar genellikle kütüphanenin iç çağrı yığınıdır (node_modules/vitest/...).  
Düzeltme → Gözünü yukarı kaydır; `AssertionError` başlığı altındaki `- Expected` ve `+ Received` bloklarını oku. Problem o iki değer arasındaki farktadır.
:::

:::mistake[Sık hata: Test dosyasındaki değişken adını kendi kodunda aramak]
Belirti → Test çıktısında `expect(received).toBe(...)` yazınca kendi kodunda `received` adında bir değişken aramak.  
Neden → `received`, Vitest'in test edilen ifadenin sonucuna verdiği genel addır.  
Düzeltme → Test dosyasındaki `it` bloğuna git ve `const result = benimFonksiyonum(...)` satırında neyin çağrıldığına bak.
:::

:::mistake[Sık hata: Tip hatası varken testlerin geçtiğini zannetmek]
Belirti → Vitest yeşil yandı ama görev kabul edilmedi.  
Neden → Kod mantıksal olarak doğru sonuç verse de TypeScript tip denetiminde bir uyarı veya eksik tip (örneğin parametre tipi `any` bırakılmış) vardır.  
Düzeltme → Çıktı panelinde "Tip Kontrolü" sekmesine bak ve `tsc` tarafından işaretlenen satırları düzelt.
:::

:::sector
Yazılım sektöründe büyük ekipler yeni bir özellik yazmadan önce testleri yazar. Buna **TDD** (Test-Driven Development) denir. Testler önce kırmızıdır; kod yazıldıkça tek tek yeşile döner. Bir hata bildirildiğinde (bug report) ilk yapılan iş, o hatayı canlandıran ve başarısız olan yeni bir test yazmaktır. Böylece hata düzeltildiğinde test yeşile döner ve gelecekte aynı hatanın tekrarlanması (regresyon) kalıcı olarak engellenir.
:::

## Özet

- Test dosyaları bir projenin çalışan şartnameleridir; kodun tüm gereksinimlerini en kesin şekilde ifade eder.
- Vitest testleri `describe` (küme), `it` (davranış/gereksinim) ve `expect` (doğrulama) hiyerarşisiyle kurgulanır.
- Test yapısı evrensel Arrange-Act-Assert (Hazırla-Çalıştır-Doğrula) adımlarını takip eder.
- Başarısız bir testte daima `- Expected` (şartnamenin beklediği) ve `+ Received` (kodun ürettiği) satırları kıyaslanır.
- TypeScript derleme hataları (`TSxxxx`) ile Vitest çalışma zamanı doğrulama hataları (`AssertionError`) birbirinden bağımsızdır; ikisi de temizlenmelidir.

**Kendini yokla:** Vitest çıktısında `- Expected: "10 dk"` ve `+ Received: "10"` gördüğünde kodunda ne eksiktir?  
*Cevap:* Fonksiyonun ürettiği sonucun sonuna `" dk"` birim eki eklenmemiştir; çıktı sayı veya eksik string olarak dönmektedir.

**Kendini yokla:** Görev metninde belirtilmeyen bir uç durumun (örneğin boş dizi veya tanımsız girdi) nasıl ele alınacağını nereden kesin olarak öğrenirsin?  
*Cevap:* Görevin test dosyasını açıp ilgili fonksiyonun `it(...)` bloklarındaki test senaryolarını ve `expect` beklentilerini okuyarak öğrenirsin.
