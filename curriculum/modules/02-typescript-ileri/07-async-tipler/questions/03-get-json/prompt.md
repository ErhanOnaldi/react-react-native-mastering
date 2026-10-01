Sinema'nın test verisindeki JSON metnini bir tipli sonuca dönüştür. Geçersiz metin için gelen parse hatasının Promise üzerinden çağırana ulaşması gerekir.

## Gereksinimler

- Geçerli JSON metni parse edilip `T` sonucu olarak dönmeli.
- Geçersiz JSON metni için dönen Promise reddedilmeli.
- `T` dönüş tipi, metindeki alanların runtime'da doğrulandığı anlamına gelmez.

## Örnek

`'{"id":550,"title":"Dövüş Kulübü"}'` metni `{ id: 550, title: 'Dövüş Kulübü' }` sonucunu verir.

## Sözleşme

- Dosya: `task.ts`
- Export fonksiyon: `getJson<T>(text: string): Promise<T>`.
