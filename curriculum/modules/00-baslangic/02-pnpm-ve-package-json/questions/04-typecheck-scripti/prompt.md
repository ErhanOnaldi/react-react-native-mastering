İlk VS Code görevin! 🎉

Sinema projesinin `build` script'i önce tip kontrolü yapıyor (`tsc -b`), sonra paketliyor (`vite build`). Bazen **sadece** tip kontrolü yapmak isteriz — hızlıca "projede tip hatası var mı?" diye bakmak için.

1. VS Code'da `projects/sinema/package.json` dosyasını aç (sağdaki bağlantı doğrudan açar).
2. `scripts` içine `typecheck` adında, `tsc -b` çalıştıran bir script ekle.
3. Terminalde dene:

```bash
cd projects/sinema
pnpm typecheck
```

Hata yoksa komut sessizce biter — Unix dünyasında "sessizlik = başarı" demektir.

4. Platformdan **Testleri çalıştır**'a bas ya da kökte `pnpm check 0.2.4` yaz.
