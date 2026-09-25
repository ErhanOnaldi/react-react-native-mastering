İyi bir projenin ilk kapısı README'dir: yeni gelen bir geliştirici (ya da altı ay sonraki sen) projeyi **sadece README'yi okuyarak** çalıştırabilmeli.

1. `projects/sinema/README.md` dosyasını oluştur. Şunları anlat:
   - Proje ne? (1-2 cümle)
   - Kurulum: bağımlılıklar, `.env` ayarı
   - Komutlar: `dev`, `build`, `preview`, `typecheck` — her biri ne yapar?
   - Ortam değişkenleri: `VITE_TMDB_TOKEN` (nereden alınır?), `VITE_APP_TITLE`
2. **AI review prompt'unu kopyala** ile README'ni bir AI aracına inceletip geri bildirimleri uygula.
3. Bu modülde yaptığın her şeyi commit'le:

```bash
git status
git add projects/sinema
git commit -m "docs(sinema): kurulum rehberi ekle"
```

4. Bitince **Tamamladım**'a bas.

:::warning
README'ye gerçek token'ını **yazma**. Örnek değer ya da boş bırak.
:::
