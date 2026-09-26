---
title: "Asenkron ekranlar"
minutes: 9
kind: concept
---

# Asenkron ekranlar

:::pain[Problem]
Film listesi için getByText yazdın. İstek birkaç milisaniye sonra dönüyor; test yüklenirken bitti.
:::

## Ekranın zaman içindeki hâlleri

Ağlı bir component tek anda tamamlanmaz: önce bekleme, sonra başarı veya hata görünür. Testin de bu durum geçişini izlemesi gerekir. `getBy` mevcut öğeyi hemen arar, `findBy` sonradan belirecek öğeyi bekler; `waitFor` ise belirli bir assertion'ı koşul sağlanana kadar tekrar dener. Sabit uyku süresi gerçek davranışa bağlanmaz.

Sinema film detayı ilk render'da bilinmez. Effect ve Query derslerinde gördüğün asenkron durumlar şimdi kullanıcı gözünden sınanıyor. Loading mesajının kaybolması ve hata yüzeyinin görünmesi de başarı başlığı kadar önemli olabilir.

## İhtiyaç ve çözüm

Başta görünen loading durumunu `getByRole` ile hemen sınarsın. Sonradan gelen film için `await screen.findByRole("heading", { name: "Dövüş Kulübü" })` kullan. Öğenin kaybolmasını `waitForElementToBeRemoved(() => screen.queryByRole("status"))` ile izle; çağrı anında öğe mevcut olmalı.

`waitFor`, istek sayısı gibi DOM dışı assertion’ları tekrar dener. Sabit `setTimeout` testi yavaş ve kırılgan yapar.

## Üç ayrı zaman noktası

Film detayı ilk render’da henüz bilinmez. Kullanıcı önce yükleniyor mesajını, yanıt gelince başlığı ya da hatayı görür. Test de bu sırayı izlemeli.

```tsx title="MovieTitle.test.tsx"
render(<MovieTitle id={550} />)
expect(screen.getByRole('status')).toHaveTextContent('Yükleniyor')
expect(await screen.findByRole('heading', { name: 'Dövüş Kulübü' })).toBeInTheDocument()
```

Başlığın gelmesini `findByRole` bekler. `waitFor` ise DOM dışında bir koşulu, örneğin `requests('/3/movie/550')` uzunluğunu, assertion başarılı olana dek tekrarlar. `waitFor` içine sonuç dönmeyen bir ifade yazarsan yeniden denemesi için hata fırlatılmaz; `expect(...)` kullan.

Loading’in **kaybolması** özel olarak önemliyse `waitForElementToBeRemoved` uygundur:

```tsx title="MovieTitle.test.tsx"
const status = screen.getByRole('status')
await waitForElementToBeRemoved(status)
```

Öğe çağrı anında mevcut olmalı. Başta hiç render edilmiyorsa `getByRole` zaten kırılır; bu iyi, çünkü boş ekran bug’ını yakalar. 404 yanıtta `fetch` Promise’i reddetmez; `response.ok` kontrol edilmeden hata görünümü oluşmaz. Bu yüzden ikinci test, bilinmeyen id ile alert’i bekler.

:::mistake
`await new Promise(resolve => setTimeout(resolve, 1000))` sabit beklemesi testin gerçek koşulla ilişkisini koparır. Yavaş makinede hâlâ yetmeyebilir; hızlı makinede zamanı boşa harcar.
:::

:::sector[Sektörde]
Ağ süresini milisaniye olarak sabitlemek yerine durum geçişlerini bekleyen testler CI makinelerinde daha kararlı çalışır.
:::
