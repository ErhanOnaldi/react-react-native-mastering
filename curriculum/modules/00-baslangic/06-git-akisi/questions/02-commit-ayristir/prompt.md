Commit mesajlarını kontrol eden araçların (commitlint gibi) kalbindeki fonksiyonu yazıyoruz.

`parseCommit(message)`, geçerli bir Conventional Commit mesajını parçalarına ayırır; geçersizse `null` döner.

```ts
parseCommit('feat(sinema): puan rozeti ekle')
// { type: 'feat', scope: 'sinema', breaking: false, subject: 'puan rozeti ekle' }

parseCommit('fix!: oturum yapısını değiştir')
// { type: 'fix', scope: undefined, breaking: true, subject: 'oturum yapısını değiştir' }

parseCommit('düzeltmeler') // null
```

- Geçerli türler `TYPES` dizisinde hazır.
- Sadece ilk satır incelenir (mesajın geri kalanı gövde olabilir).
- Açıklama boş olamaz.
