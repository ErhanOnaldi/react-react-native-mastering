Referans belge: `curriculum/checkpoints/kitaplik/22/REQUIREMENTS.md`. Birebir aynısını yazman beklenmiyor; karşılaştırırken şu noktalara bak:

- **Kriterler numaralı ve tekil.** “K-8 Yeni sayfa yüklenirken önceki sonuçlar ekranda kalır” tek bir davranış anlatır; 4. dersteki test adlarından biri neredeyse bu cümledir. Numaralar ADR’lerde ve testlerde referans olur (“İlgili gereksinimler: K-2, K-7”).
- **Kenar durumları gerçek veriden.** “Kapak yoksa yer tutucu” kuralı, `curl` çıktısında `cover_i` alanı olmayan bir kaydı görünce doğar. Kafadan yazılan gereksinimler en sık burada eksik kalır.
- **Kapsam dışı cesurca yazılmış.** “Sonsuz kaydırma yok” demek, demo gününe yetişmenin en ucuz yoludur.
- **Çözüm yok.** Belgede “Context”, “Redux”, “useQuery” geçmiyor; bunlar bir sonraki dersin ADR’lerine ait.

Sektörde bu belge “yaşayan” bir dokümandır: açık sorular cevaplandıkça ve kapsam değiştikçe güncellenir, değişiklikler de Git geçmişinde görünür. Commit’le:

```bash
git add projects/kitaplik/REQUIREMENTS.md
git commit -m "docs(kitaplik): v1 gereksinimlerini yaz"
```
