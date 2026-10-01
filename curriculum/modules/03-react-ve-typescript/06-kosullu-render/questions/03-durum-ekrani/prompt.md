Arama ekranına verilen dört durumdan birini uygun mesaj veya film listesiyle göster. Bu bileşen yalnızca gelen durumu ekrana çizer.

## Gereksinimler

- `idle` durumunda “Arama yap” görünmelidir.
- `loading` durumunda “Yükleniyor” görünmelidir.
- `error` durumunda gelen hata metni `alert` rolüyle görünmelidir.
- `success` durumunda film başlıkları liste öğesi olmalıdır.
- Başarı verisi boşsa “Film bulunamadı” görünmelidir.

## Örnek

`{ status: "error", message: "Bağlantı yok" }` → alert içinde “Bağlantı yok”.

## Sözleşme

- Dosya ve export: `RemoteView.tsx` → named export `RemoteView`
- Props: dört durumlu `RemoteData<{ id: number; title: string }[]>`
- `RemoteData` alanları: `idle`; `loading`; `error` + `message`; `success` + `data`.
- Arayüz: başarı listesi `li` öğeleri olarak görünür.
