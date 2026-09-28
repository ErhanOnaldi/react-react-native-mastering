---
title: "Sanal saatle zamanı sınırla"
minutes: 17
kind: concept
---

# Sanal saatle zamanı sınırla

:::pain[Sinema’da ne oldu?]
Sinema’da “Kaydedildi” bildirimi çıktıktan iki saniye sonra mesaj “Güncellendi” olarak değişiyor. İlk mesaj için kurulan üç saniyelik timer yeni bildirimi bir saniye sonra gizliyor; gerçek süreyi beklemek yavaş ve bu ara davranışı yakalamak zor.
:::

## Zamanı da test girdisi say

Toast kapanması, retry veya animasyon yalnızca değere değil geçen zamana bağlıdır. Gerçek saati beklemek testi yavaşlatır; işletim sistemi yükü ve zamanlayıcı planlaması da sınır anlarını belirsiz kılar. Fake timers test içindeki saati sanal hale getirir: süreyi beklemeden belirli bir noktaya taşırsın.

Hook’lar modülünde effect setup ve cleanup’ın ne zaman çalıştığını, eski callback’in değerleri nasıl yakalayabildiğini gördün. Burada bu bilgi toast timer’ına uygulanıyor: yeni bildirim geldiğinde eski gizleme callback’i iptal edilmeli. Dış gözlem “yeni mesaj kendi süresi dolana kadar görünür kalsın” ise hem eski timer’ın bitiş anını hem yeni sürenin sonunu ölç.

## Sanal saat kuralları

1. vi.useFakeTimers() testin kontrolündeki timer’ları sanallaştırır.
2. vi.advanceTimersByTime(ms) saati tam belirtilen süre kadar ilerletir; 2999 ms ile 3000 ms farklı sınanabilir.
3. Timer React state’ini değiştiriyorsa ilerletmeyi act(() => ...) içine al; React güncellemeleri assertion’dan önce tamamlanır.
4. Yeni bildirim gelince önceki timer’ın dolacağı ara anda, eski timer’ın temizlenip temizlenmediğini kontrol et.
5. afterEach içinde vi.useRealTimers() çağır; sanal saati diğer testlere sızdırma.
6. Fake timer varken user-event timer’ları da etkilenebilir; userEvent.setup({ advanceTimers: vi.advanceTimersByTime }) kullan.

![Sanal saat: yeni toast gelince eski gizleme timerı iptal edilir](diagrams/sanal-saat.svg)

## Zaman çizelgesini izle

Toast üç saniye görünür kalsın. “Kaydedildi” bildirimi geldikten 2000 ms sonra “Güncellendi” ile değişsin:

| Saat | Olay | Doğru toast durumu |
| --- | --- | --- |
| 0 ms | “Kaydedildi” görünür, timer A başlar | mesaj görünür |
| 2000 ms | “Güncellendi” gelir, timer B başlar | yeni mesaj görünür |
| 3000 ms | A’nın eski bitiş noktası | yeni mesaj görünür kalmalı |
| 4999 ms | B’nin süresi dolmadan | yeni mesaj görünür kalmalı |
| 5000 ms | B’nin üç saniyesi tamamlanır | bildirim gizlenir |

Testi yalnızca 5000 ms’de kontrol edersen eski timer’ın 3000 ms’de mesajı erkenden gizlediğini kaçırabilirsin. İki kontrol noktası gereklidir: eski timer’ın bitişi ve yeni bildirimin kendi süresinin bitişi. Fake timer testinin gücü tam sınırları gözle görünür kılmasıdır.

## Önce kırık, sonra doğru

Her yeni bildirimde eski timer temizlenmiyorsa iki gizleme callback’i de çalışabilir. Gerçek süreyi beklemek yerine sanal saat kullan:

    import { afterEach, expect, it, vi } from 'vitest'

    afterEach(() => vi.useRealTimers())

    it('yeni toast için eski gizleme timerını çalıştırmaz', () => {
      vi.useFakeTimers()
      const values: string[] = []
      setTimeout(() => values.push('bildirim gizlendi'), 3000)
      setTimeout(() => values.push('yeni mesaj gizlendi'), 5000)
      vi.advanceTimersByTime(3000)
      expect(values).toEqual(['bildirim gizlendi'])
    })

Bu kırık örnekte iki timer da kurulu kaldığından 3000 ms’de bildirim kapanır. Doğru uygulama ilk timer’ı temizler ve yalnız yenisini bırakır. Gerçek hook testinde renderHook ile görünür mesajı okur; rerender ile yeni mesaj verip süreyi act içinde ilerletirsin. Böylece sahte React state üretmek yerine hook’un gerçek effect ve cleanup’ını çalıştırırsın.

    import { act, renderHook } from '@testing-library/react'
    import { afterEach, expect, it, vi } from 'vitest'

    afterEach(() => vi.useRealTimers())

    it('yeni bildirimi kendi süresi dolana kadar gösterir', () => {
      vi.useFakeTimers()
      const { result, rerender } = renderHook(
        ({ value }) => useNotice(value, 3000),
        { initialProps: { value: 'Kaydedildi' } },
      )
      act(() => vi.advanceTimersByTime(2000))
      rerender({ value: 'Güncellendi' })
      act(() => vi.advanceTimersByTime(1000))
      expect(result.current).toBe('Güncellendi')
      act(() => vi.advanceTimersByTime(1999))
      expect(result.current).toBe('Güncellendi')
      act(() => vi.advanceTimersByTime(1))
      expect(result.current).toBe(null)
    })

Bu örnek eski timer’ın dolacağı anı ve yeni mesajın kapanacağı son anı ölçer. Toast süresini kısaltan hata ilk assertion’da görünür; gerçek zamana bağlı yaklaşık bekleme bu kesinliği sağlamaz. act, React state güncellemesinin assertion’dan önce tamamlandığını garanti eden test sınırıdır.

## Bekleme ve cleanup ayrıntıları

Fake saat kullanırken gerçek Promise davranışıyla timer davranışını karıştırma. Bazı kodlar timer callback’inde Promise başlatır; bu durumda yalnız saati ilerletmek callback sonrasındaki microtask’ları tamamlamayabilir. Vitest’in async timer API’leri gerektiğinde kullanılabilir; basit effect timeout için senkron ilerletme yeterlidir. Her durumda hangi zaman kaynağını kontrol ettiğini bil.

Timer’ı kurduktan sonra bileşen unmount oluyorsa cleanup’ın timer’ı iptal ettiğini de sınayabilirsin. Unmount sonrası geç state update veya callback gerçek bir yaşam döngüsü hatası olabilir. Fakat yalnız tüm timer’ların sayısını ölçmek hangi davranışı koruduğunu söylemez. Kullanıcının gördüğü sonuca bağla.

Fake saat açıkken userEvent iç etkileşimleri de timer kullanabilir. Varsayılan ayar bu timer’ı bekleyebilir; advanceTimers seçeneği saati ilerletme sorumluluğunu Vitest’e bağlar. Testten sonra gerçek saat geri gelmelidir, aksi halde takip eden testin Date.now() veya timeout davranışı şaşar. Cleanup afterEach içinde olursa assertion geçse veya kalsa da çalışır.

Sanal saatle test yazmadan önce timer’ın amacı nedir diye sor. Toast’ta yeni bildirim geldiğinde gizleme süresi yeniden başlar. Retry’de belirli bir başarısızlıktan sonra tekrar deneme zamanı gelir. Animasyonda görünür geçiş belirli süreyle sürer. Aynı araç farklı iş kuralını sınar; test, bu kuralı test adında ve zaman çizelgesinde açık etmelidir.

:::mistake[Eski timer’ı kontrol etmeden yalnız final değere bakmak]
Belirti: Yeni toast erken kaybolur. → Neden: Eski bildirimin timer’ı temizlenmemiştir. → Düzeltme: Eski timer’ın dolacağı ara noktada yeni mesajın hâlâ göründüğünü doğrula.
:::

:::mistake[React güncellemesini act dışında ilerletmek]
Belirti: Uyarı çıkar veya assertion eski state’i okur. → Neden: Timer callback’i state’i günceller ama test tamamlanmayı beklemez. → Düzeltme: Saati act(() => vi.advanceTimersByTime(...)) içinde ilerlet.
:::

:::mistake[Sanal saati açık bırakmak]
Belirti: Başka testte timeout veya tarih davranışı anlamsızlaşır. → Neden: Test global saat ortamını geri yüklememiştir. → Düzeltme: Her testten sonra vi.useRealTimers() çağır.
:::

Toast için yeni mesajın ne kadar süreyle görünmesi gerektiği ile hangi anda gizlenmemesi gerektiği iki ayrı bilgidir. Ara kontrol önceki timer’ın iptal edildiğini, son assertion yeni timer’ın tamamlandığını gösterir. Bu noktalar hatalı cleanup ve hatalı süreyi birbirinden ayırmaya yardım eder.

Örnekteki süreleri testten önce aritmetik olarak hesapla. Yeni toast 2000 ms sonra geldiyse ilk timer’ın kalan süresi 1000 ms olur; fakat doğru uygulamada o timer artık iptal edilmiştir. Yeni mesajın kendi süresi 3000 ms olduğundan toplam sanal saat 5000 ms’de bildirim kapanır. Zamanı toplamdan değil son değişiklik anından ölçmek gerekir.

:::sector
Sanal saatler toast süresi, retry ve cache expiration gibi zaman kurallarını CI’da hızlı ve tekrarlanabilir biçimde sınar. Ekipler yalnızca final değeri değil, sınırdan hemen önce ve sonra oluşan davranışı da tarif eder.
:::

İleri sarma miktarı mevcut saati toplar. Önce 2000 ms ilerletip sonra 1000 ms ilerletmek toplamda 3000 ms noktasıdır; yeni toast bu anda hâlâ görünür olmalıdır. Son mesajın kendi üç saniyelik süresi 5000 ms’de tamamlanır. Küçük zaman çizelgesi her başlangıç anını ve kontrol noktasını görünür kılar.

Timer callback’i çalıştıktan sonra yeniden timer kuruyorsa tek advance çağrısında kaç callback’in çalıştığını anlamak zorlaşabilir. Beklenen olay sayısı sınırlıysa süreyi kontrollü parçalara böl. Sonsuz tekrarlı interval’ı tamamen çalıştırmaya çalışma; test bitmeyebilir veya ilgisiz gelecekteki olayları da çalıştırabilir.

Sanal saati yalnız gereken senaryoda aç. Her testten sonra gerçek saate dön; aksi halde takip eden testin Date.now() veya timeout davranışı şaşar. Saat global ortamın parçası olduğundan test sırası bağımsızlığı fake timer’larda özellikle önemlidir.

Zaman sınırını milisaniye olarak yazmak davranışı anlaşılır kılar. “Bir süre sonra” assertion’ı testi belirsiz bırakır; 2999 ms ve 3000 ms noktaları üç saniyelik toast sözleşmesini doğrudan gösterir. Süreyi ürün kararının parçası olarak gör: kapanma süresi değişirse testin beklenen sınırı da bilinçli olarak güncellenmelidir.

Fake timer, uygulamanın Date değerlerini de etkileyebilir. Bir test duvar saati tarihini ve timeout’ı aynı anda kullanıyorsa neyin sanallaştırıldığını bil. Mümkün olduğunda test edilen zaman davranışını tek bir kontrol noktasında tutmak, testin hangi olayı beklediğini açık eder.

## Özet

- Zaman bağımlı davranışın süresi test girdisidir.
- Fake timer gerçek bekleme olmadan saati kontrollü ilerletir.
- Eski timer’ın dolacağı ara an cleanup hatasını açığa çıkarır.
- React state’i etkileniyorsa timer ilerletmesini act içine al.
- User-event ve fake timer kullanırken saati bağla; testten sonra gerçek saate dön.

**Kendini yokla:** Üç saniyelik toast için 2999 ms kontrolü neyi kanıtlar? Bildirim henüz erken gizlenmemelidir.

**Kendini yokla:** Yalnız 5000 ms’de toast’ın gizlendiğini kontrol etmek hangi hatayı kaçırabilir? Eski timer’ın bildirimi 3000 ms’de erkenden kapatmasını.
