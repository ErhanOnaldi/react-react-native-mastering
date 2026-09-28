Arama, sorguyu temizleyip doğru dil ve sayfa bilgisiyle istemciye göndermeli. Boş sorguda ağ isteği oluşturmamalı.

## Gereksinimler

- “  dövüş  ” girdisi query dövüş değerine dönüşmeli.
- İstek page 2 ve language tr-TR taşımalı.
- Authorization başlığı Bearer test-token olmalı.
- Başarılı yanıttaki Dövüş Kulübü başlığı korunmalı.
- Yalnız boşluk içeren sorgu boş sonuç vermeli ve fetch çağırmamalı.

## Örnek

| Girdi | Beklenen |
| --- | --- |
| sorgu “  dövüş  ”, sayfa 2 | query dövüş, page 2, language tr-TR |
| sorgu yalnız boşluk | boş sonuç, sıfır istek |

## Sözleşme

- Yazılacak dosya: searchMovies.test.ts
- Test edilecek modül: @impl/searchMovies
- Çağrı: searchMovies(query: string, page: number)

## Kısıtlar

- URL query parametrelerinin sırasına bağlanma.
- Gerçek ağa istek gönderme.
