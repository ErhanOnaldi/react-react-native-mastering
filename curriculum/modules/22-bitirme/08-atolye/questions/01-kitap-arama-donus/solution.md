## Neden böyle?

Arama metni ve sayfa, kullanıcının paylaşabileceği bir seçim — bu yüzden bileşen state'inde değil adres çubuğunda yaşar (12. ve 16. modüldeki aynı karar). Sorgu kimliğine hem metni hem sayfayı koymak, her (metin, sayfa) ikilisinin kendi önbellek girdisine sahip olmasını sağlar: geri tuşuyla önceki sayfaya dönüldüğünde aynı kimlikle eşleşen sonuç anında geri gelir, yeni bir istek atılmaz.

**Alternatif:** Sonuçları `useSearchParams`'tan bağımsız bir `useState`'te tutup URL'i yalnızca "görünüm için" güncelleyebilirdin; ama o zaman geri/ileri tuşları React state'ini haberdar etmez, adres çubuğu ile ekran birbirinden kopar. URL'i tek doğru kaynak yapmak bu senkronizasyon sorununu baştan ortadan kaldırır.

**Tuzaklar:**
- Sorgu kimliğine yalnızca metni koyup sayfayı unutursan, sayfa değiştiğinde eski sonuç ekranda kalır (13. modülde gördüğün yanlış kimlik hatasının aynısı).
- `enabled` koşulunu unutursan boş arama kutusuyla da isteğe çıkarsın; sunucu boş sorguda zaten sonuç döndürmez ama gereksiz bir ağ isteği atılır.
- `limit=1` bu alıştırmaya özgü küçük bir sayfa boyutu; gerçek bir üründe kullanıcı deneyimi için çok daha büyük bir değer seçersin.

Bir sonraki görevde aynı eser artık tek başına değil, bağımlı bir yazar sorgusuyla birlikte ele alınacak — orada sorgu kimliğini doğru kurmanın önemi ikinci bir katmanda tekrar karşına çıkacak.
