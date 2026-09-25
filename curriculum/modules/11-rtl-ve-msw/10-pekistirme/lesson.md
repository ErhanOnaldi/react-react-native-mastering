---
title: "Arama akışını birlikte sınamak"
minutes: 9
kind: practice
---

# Arama akışını birlikte sınamak

:::pain[Problem]
Arama testin yalnızca fetch çağrıldı diyor. Loading, boş liste ve hata bozulsa da yeşil kalıyor.
:::

## İhtiyaç ve çözüm

Kullanıcı Matrix yazar; MSW tam arama adresine yanıt verir. Test loading’den sonuca ya da hataya geçişi rollerle izler. `requests()` ile istek sayısını, DOM ile kullanıcı sonucunu birlikte sınarsın.

Diğer senaryolar boş listeyi ve 500 yanıtını kapsar. Böylece user-event, async sorgu ve handler override birleşir.

## Akışı bir cümleye indir

"Kullanıcı Matrix yazar ve Ara’ya basar; istekte `query=Matrix` olur; önce Yükleniyor, sonra Matrix başlığı görünür." Bu cümle bir testin Arrange–Act–Assert sırasını verir. Önceki derslerin sorgusu, etkileşimi, asenkron beklemesi ve MSW’si şimdi tek akışta birleşir.

```tsx title="SearchPanel.test.tsx"
const user = userEvent.setup()
render(<SearchPanel />)
await user.type(screen.getByRole('searchbox', { name: 'Film ara' }), 'Matrix')
await user.click(screen.getByRole('button', { name: 'Ara' }))
expect(screen.getByRole('status')).toHaveTextContent('Yükleniyor')
expect(await screen.findByRole('heading', { name: 'Matrix' })).toBeInTheDocument()
```

İkinci test boş `results` döndürür ve "Film bulunamadı" durumunu bekler. Üçüncü test 500 döndürür ve alert’i bekler. Bunlar aynı testin yeniden adlandırılmış kopyaları değildir: başarı, boşluk ve hata farklı kullanıcı yollarıdır.

İstek günlüğü query parametresini doğrular. Sayfa yalnız doğru başlığı gösteriyorsa ama yanlış URL’ye istek atıyorsa başka bir fixture tesadüfen testi geçirebilir. İki gözlem birlikte bu riski azaltır.

:::mistake
Loading status’ünü `findByRole('status')` ile aramak yeterli değildir: boş sonuç status’ü de aynı role sahip olabilir. Hemen ilk render sonrası `getByRole` ile "Yükleniyor" metnini sınayıp sonradan gelen metni ayrıca bekle.
:::

:::sector[Sektörde]
Bir kullanıcı akışında DOM sonucu ile HTTP isteğini birlikte doğrulamak yanlış endpoint’in tesadüfen doğru kartı göstermesini önler.
:::
