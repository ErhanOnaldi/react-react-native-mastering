---
title: "Ortak state büyüyünce"
minutes: 13
kind: concept
---

# Ortak state büyüyünce

:::pain[Sinema’da sorun]
Bir filmi favoriye ekledin. Favori sayacı değişirken üst üste sarılmış beş Context’in içinden tema menüsü, izleme listesi özeti ve son bakılanlar paneli de render oldu. React Profiler’da tek tıklamanın ardından değişmemesi gereken üç bileşenin de çalıştığını görüyorsun. Sorun Context’in hatalı olması değil; değişen veriyi hangi bileşenlerin dinlediğini göremeyecek kadar geniş bir sınır kurmuş olman.
:::

## Değişimin yayılma alanı

Context bir değeri ağaçtaki uzak bileşenlere taşır. Provider’ın `value` değeri değiştiğinde o Context’i okuyan tüketiciler yeni değeri alır. Beş Context’in iç içe olması kendi başına beş kat render demek değildir. Maliyet, her değerin ne sıklıkla değiştiği, kaç tüketicisinin olduğu ve tüketicilerin ne kadar iş yaptığıyla ilgilidir.

Şunu ayıralım: parent’ın yeniden render olması çocuk fonksiyonlarını yeniden çağırabilir; Context güncellemesi ise o Context’i kullanan bileşenlere yeni değer ulaştırır. Profiler’da bir bileşenin çalıştığını görmek tek başına Context’in suçlu olduğunu kanıtlamaz. Önce tek etkileşimi kaydet, sonra hangi state’in değiştiğini ve hangi tüketicilerin gerçekten o değeri okuduğunu incele.

Context’in iyi bir kullanım alanı vardır. Seyrek değişen tema, locale veya oturum bilgisi küçük uygulamalarda gayet uygun olabilir. Değişkenin sahibi bir parent ise ve birkaç alt bileşen kullanıyorsa state’i yukarı taşımak da yeterlidir. Sorun, bağımsız yaşam süreleri olan çok sayıda değeri tek, sık güncellenen nesneye koyup geniş bir ağaca dağıtmaktır.

## Provider ağacını nasıl düşünmelisin?

1. **Provider erişim sınırı kurar.** Altındaki bileşenler değeri okuyabilir; üstündekiler okuyamaz.
2. **Provider değeri kimlik taşır.** Her render’da yeni nesne üretirsen, içindeki alanlar aynı olsa bile referans değişir.
3. **Tüketici okuduğu Context’e bağlanır.** `theme` alanını seçtiğini düşünmek, tek Context’in içindeki diğer alanlardan otomatik olarak ayrıştığı anlamına gelmez.
4. **Provider sayısı maliyet ölçüsü değildir.** Beş küçük ve seyrek değişen Context, tek dev ve sık değişen Context’ten daha iyi olabilir.
5. **Ölçüm karar verir.** Değişmeyen etkileşimde hangi bileşenlerin çalıştığını Profiler veya sayaçla gözle; tahminle araç değiştirme.

![Context Provider değeri değişince tüketicilere yayılan güncellemeyi gösteren diyagram](diagram:context-yayilimi)

Bu diyagramda oklar veri erişimini anlatır. Provider’ın değişen değeri, ilgili tüketicilere ulaşır. Tüketici olmayan bileşenler için Context güncellemesi doğrudan bir abonelik değildir; yine de parent render’ı onları ayrıca çalıştırabilir. Bu ayrım, ölçüm sonucunu doğru yorumlamana yardım eder.

## Bir tıklamanın izini sürelim

Bir favori tıklamasından önce ve sonra Profiler kaydı aldığını düşün. Başlangıçta her Context farklı bir Provider’da olsa bile tema menüsü ortak bir `AppContext` okuyor olabilir.

| Sıra | Olay | Gözlem | Soracağın soru |
| --- | --- | --- | --- |
| 1 | Kullanıcı yıldız düğmesine basar | Event handler favori dizisini günceller | Hangi state gerçekten değişti? |
| 2 | Provider render olur | `value={{ favorites, theme, lists }}` yeni nesnedir | Bu nesne neden değişti? |
| 3 | Context tüketicileri yeni değeri alır | Tema menüsü de çalışabilir | Tema menüsü bu değişime bağlı mı? |
| 4 | Bileşenler commit eder | DOM’da bazı içerikler aynı kalır | Render edilen iş gerçekten gerekli miydi? |
| 5 | Profiler kaydı okunur | Süre ve tekrar sayısı görünür | Daraltmaya değer bir maliyet var mı? |

Yalnızca sayaç kullanıyorsan mutlak sayıyı ezberleme. Geliştirme StrictMode’u ilk render’ı ek olarak çağırabilir. Tıklamadan önceki sayıyı kaydet, sonra tıklama sonrası farkı karşılaştır. Böylece “bir kez render oldu” gibi ortama bağlı bir hedef yerine etkileşimin etkisini ölçersin.

Render maliyetini değerlendirirken component fonksiyonunun çağrılması ile kullanıcıya görünen DOM’un değişmesini de ayır. React yeni JSX hesaplamış olabilir ama commit aşamasında ekranda farklı bir node oluşmayabilir. Bu yine de pahalı hesap varsa önemlidir; fakat tek başına “kullanıcıya zarar veren yavaşlık” kanıtı değildir. Profiler’da commit süresi, component’in harcadığı zaman ve aynı etkileşimde kaç alt dalın çalıştığına birlikte bak.

Provider’ı bölmek her durumda daha iyi değildir. İki Context değeri aynı sıklıkta değişiyor ve aynı tüketiciler tarafından okunuyorsa ayırma yeni API ve daha fazla wiring getirip ölçülebilir fayda sağlamayabilir. Buna karşılık tema günde bir kez değişirken canlı arama filtresi her tuşta güncelleniyorsa aynı değere bağlamak tema tüketicilerini gereksiz hareket ettirebilir. Değerleri yalnızca adlarına göre değil, zaman içindeki değişim örüntülerine göre grupla.

Bir performans incelemesinde küçük bir karşılaştırma kurabilirsin: bir kez değişen değer, onu kullanan bileşenler ve etkilenmemesi beklenen bileşenler. Bu beklentiyi ölçümden önce yaz. Böylece ölçüm çıktısını seçtiğin çözümü savunmak için değil, çözümün işe yarayıp yaramadığını görmek için kullanırsın.

## Aynı değer, yeni nesne

Kırık örnekte Provider değeri her render’da yeniden oluşturuluyor. Favori değişmediği halde parent’ın başka bir güncellemesi de bütün değerin kimliğini değiştirir:

```tsx title="Tek ve geniş Context"
const value = { favorites, theme, watchlists, recentIds }
return <AppContext.Provider value={value}><Application /></AppContext.Provider>
```

Bir değişiklik sık yaşanıyor, alanlar ise farklı tüketicilere aitse bu tasarım gereksiz güncellemeleri görünmez kılar. Önce state’leri yaşam döngülerine göre ayır. Küçük bir uygulamada Context’leri ayırmak, değeri `useMemo` ile sabitlemek veya state’i ortak parent’ta tutmak yeterli olabilir. Birçok ekranda paylaşılan ve sık değişen client state için action/reducer sınırı da düşünülebilir.

Redux Toolkit’in katkısı “Context’i hızlandırmak” değildir. State geçişlerini action’larla adlandırır, reducer kurallarını tek yerde toplar ve bileşenlerin seçtikleri sonuca abone olmasını sağlar. Bunun da kurulum ve kavrama maliyeti vardır; iki bileşenli bir ayar paneli için store kurmak gereksiz olabilir.

## Sınır durumları

:::mistake[Belirti → Profiler’da tema bileşeni de yanıyor]
Belirti → Favori tıklamasından sonra tema menüsünün gövdesi çalışıyor.  
Neden → Tema menüsü geniş bir Context’i okuyor veya üst bileşen yeniden render oluyor. Profiler’da commit zincirini ayırmadan yalnızca Context’i suçlamak yanıltır.  
Düzeltme → Hangi Context’in değiştiğini ve bileşenin hangi değeri okuduğunu ölç. Gerekirse veri sahipliğini ve abonelik sınırını daralt.
:::

:::mistake[Belirti → Değer değişmediği halde tüketici çalışıyor]
Belirti → `theme` aynı, fakat tüketici yeniden render oluyor.  
Neden → Provider her render’da `{ theme }` gibi yeni nesne verir; referans eşitliği bozulur.  
Düzeltme → Önce parent render’ının gerçekten gerekip gerekmediğini bul. Sonra uygun yerde değeri sabitle veya farklı yaşam döngülü verileri ayrı Context’lere taşı.
:::

:::mistake[Belirti → Redux’a geçince her şey daha hızlı olacak sanıyorsun]
Belirti → Store kuruldu ama ekranda ölçülebilir iyileşme yok.  
Neden → State seçimi hâlâ geniş olabilir, ya da asıl maliyet pahalı render işidir.  
Düzeltme → Önce Profiler kaydıyla hangi bileşenin ne kadar iş yaptığını gör; mimari değişikliği ölçülen soruna bağla.
:::

:::sector
Ekipler genellikle Context veya Redux adını standartlaştırmaktan önce state sahipliği, güncelleme sıklığı ve tüketici sınırları üzerine konuşur. Küçük bir ayar değeri ile bütün uygulamada değişen bir koleksiyon aynı çözümü gerektirmez. Performans kod incelemesinde “kaç provider var?” yerine “bu etkileşim hangi bileşenlerde ne kadar iş başlatıyor?” sorusu daha kullanışlıdır.
:::

## Özet

- Context değeri alt ağaçta paylaşır; değeri okuyan tüketiciler Provider güncellemesine bağlanır.
- Her render’da yeni nesne üretmek, alanlar aynı olsa da referansı değiştirir.
- Provider sayısı tek başına maliyeti göstermez; değişim sıklığını ve tüketici işini ölç.
- Redux Toolkit state geçişlerini ve seçim sınırlarını düzenler; her Context sorununa otomatik performans çözümü değildir.

**Kendini yokla:** Tek Context’teki `theme` alanı değişmediyse tema tüketicisinin çalışmayacağını söyleyebilir misin?  
*Cevap:* Hayır. Provider’ın verdiği bütün `value` nesnesi referans olarak değişmiş olabilir.

**Kendini yokla:** Beş Context’i tek Context’te birleştirmek neden kendiliğinden iyileştirme sayılmaz?  
*Cevap:* Farklı sıklık ve tüketicilere sahip değerleri daha geniş bir güncelleme sınırında toplayabilir.
