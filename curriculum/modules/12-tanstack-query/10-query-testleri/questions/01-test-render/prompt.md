Provider isteyen component’leri kolay test etmek için tekrar kullanılabilir, yalıtılmış render yardımcısı kur.

## Gereksinimler

- Her çağrı yeni bir cache istemcisi oluştursun.
- Render edilen UI sağlayıcı üzerinden client’a erişsin.
- Testte sorgu hatası için otomatik retry kapalı olsun.
- Yardımcı hem client’ı hem RTL render dönüşündeki `rerender` ve `unmount` gibi araçları döndürsün.

## Örnek

İki `renderWithQuery(<Film />)` çağrısı farklı client verir. Dönüş değerinden `client` okunur; UI içindeki film sonunda görünür.

## Sözleşme

- `renderWithQuery.tsx` dosyasından `renderWithQuery(ui: ReactElement)` named export edilir.
- Dönüş nesnesinin `client` alanı `QueryClient` örneğidir; geri kalan alanlar RTL render sonucudur.
- `@testing-library/react` içindeki `render` fonksiyonu `wrapper` seçeneğini kabul eder.
