## Sorun
Sinema’nın altyapısı var ama kullanıcı arama yapınca hangi başlığın geldiğini, 404’te ne gördüğünü koruyan test yok.

## Görev
Tam bu iki dosyaya component test yaz:

- `src/pages/SearchPage.test.tsx`: `renderWithRouter` ile `?q=Matrix` adresini aç. `userEvent.setup()` ile arama kutusuna da yaz; debounce sonrası istekte `query=Matrix` olduğunu ve Matrix başlığının göründüğünü denetle. `server.use(http.get(...))` ile boş sonuçta açıklayıcı durum mesajı, 500’de alert/hata metni sınansın. `findBy` veya `waitFor` ile asenkron sonucu bekle.
- `src/pages/MovieDetailsPage.test.tsx`: `/movie/550` adresinde Dövüş Kulübü başlığını gör. `/movie/999999` için 404 cevabını ve kullanıcıya görünen hata durumunu sınayarak test yaz. `createMemoryRouter` helper içinden route parametresini geçir.

TMDB fixture başlıkları Türkçe: 550 **Dövüş Kulübü**, 603 **Matrix**. `Authorization: Bearer` zorunlu; gerçek ağa çıkma. Testler `@testing-library/react`, `@testing-library/user-event`, `src/test/setup.ts` ve MSW handler’larını kullansın. Farklı sayfaların testleri birbirinden bağımsız olsun.

## Kontrol
Sinema’da `pnpm test` çalıştır; bir testte beklenen başlığı bilerek değiştirip kırmızı sonucu gör, sonra düzelt.
