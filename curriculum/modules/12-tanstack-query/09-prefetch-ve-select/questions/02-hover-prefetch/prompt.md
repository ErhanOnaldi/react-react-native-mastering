Film kartına fareyle gelindiğinde detayını hazırla ki detay açılışında aynı film için ikinci GET gitmesin.

## Gereksinimler

- Film başlığını erişilebilir button olarak göster.
- Pointer kartın üzerine girdiğinde `id`’ye ait detay verisini hazırla.
- Aynı id’nin hazır detayını okuyunca ikinci GET oluşmasın.
- Farklı id başka detay cevabı kullansın.

## Örnek

`id=550`, `title="Dövüş Kulübü"` → adlı button; üzerine gel → detay cevabı cache’e yazılır; aynı id’yi oku → toplam bir GET.

## Sözleşme

- `MovieHover.tsx` dosyasından `MovieHover({ id, title }: { id: number; title: string })` named export edilir.
- `movieQueries.ts` salt okunur kaynaktır; `movieQueries.detail(id)` sağlar.
- Button’ın accessible name değeri `title` prop’undan gelir.

## Kısıtlar

- Detay tarifi 60 saniye taze kalır ve `Authorization: Bearer test-token` başlığını kullanır.
