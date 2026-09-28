Arama ekranı, hazır durum bilgisine göre uygun kullanıcı mesajını veya film listesini göstermeli. Uzak istek başlatma; bileşene gelen state'i sun.

## Gereksinimler

- Idle → “Arama yap”; loading → “Yükleniyor” göster.
- Error durumunda hata mesajı `alert` rolüyle görünmelidir.
- Başarı durumunda film başlıkları listelenmelidir.
- Başarı verisi boşsa “Film bulunamadı” görünmelidir.
- Dört durum birbirinden farklı ve doğru görünmelidir.

## Örnek

`{ status: "error", message: "Bağlantı yok" }` → alert içinde “Bağlantı yok”.

## Sözleşme

- Dosya ve export: `RemoteView.tsx` → named export `RemoteView`
- Props: `{ state: RemoteData<{ id: number; title: string }[]> }`; `RemoteData` dört status'lu discriminated union olarak starter'da tanımlıdır.
- Arayüz: başarı listesi `li` öğeleri olarak görünür.
