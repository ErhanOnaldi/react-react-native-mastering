Dövüş Kulübü için yorum formu oluştur ve metni DummyJSON'a kaydet. Kullanıcı başarılı ve başarısız ağ sonuçlarını ayırt edebilsin.

## Gereksinimler

- “Yorum” label'lı textarea ve “Gönder” düğmesi göster.
- Boş yorumda “Yorum gerekli” hatası göster ve istek atma.
- Geçerli yorumda `POST https://dummyjson.com/comments/add` adresine JSON `{ body, postId, userId: 1 }` gönder; `postId` prop'u varsayılan `550` olsun.
- İstek sürerken düğme devre dışı olsun.
- Başarılı 201 cevabında “Yorum kaydedildi” göster ve alanı temizle.
- HTTP hatasında “Yorum gönderilemedi” göster ve girilen metni koru.

## Örnek

`Dövüş Kulübü harika` yorumu ve varsayılan film kimliği → `{ body: 'Dövüş Kulübü harika', postId: 550, userId: 1 }`.

## Sözleşme

- Dosya ve export: `CommentForm.tsx` → named export `CommentForm`.
- Prop: `postId?: number`.
- Arayüz: “Yorum” textbox, “Gönder” düğmesi, alan hatası `role="alert"`; başarı `role="status"` ile bulunabilsin.
- Bileşen, uygulamanın mevcut `QueryClientProvider` ağacında çalışır.

## Kısıtlar

- Puan veya başka form dışı alanı JSON gövdesine ekleme.
