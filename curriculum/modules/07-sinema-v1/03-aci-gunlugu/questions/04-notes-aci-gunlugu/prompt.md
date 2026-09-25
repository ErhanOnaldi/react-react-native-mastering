Sinema v1 çalışıyor. Şimdi sorunları kanıtlarıyla kaydet ki sonraki araçları gerçek ihtiyaç üzerine seçebilesin.

## Dosya ve teslim sözleşmesi

`projects/sinema/NOTES.md` oluştur. Bu görev yalnızca **rubric** ile değerlendirilir; otomatik test yoktur.

En az üç gözlem yaz. Her birinde **nasıl tekrarlanır → ne gördün → olası neden → kullanıcı etkisi** olsun:

1. `/search?q=Matrix` → detay → geri akışında aynı arama isteğinin tekrarını say. Dev ortamında `StrictMode` etkisinin sayıyı artırabileceğini ayrıca belirt.
2. Home, Search, Details, Favorites sayfalarındaki loading/error state ve render tekrarını somut dosya adlarıyla anlat.
3. `/movie/550` sayfasından aynı detay route'unun başka id'sine uygulama içi geçişte eski film kalıyorsa yaz; `useEffect` dependency array'ini incele.
4. Favorilerde birden fazla id için giden detay istekleri veya tür değişiminde giden yeni keşfet isteği gibi bir ek gözlem yap.

Henüz çözüm kütüphanesi ekleme. Modül 8–13 bu notlardaki sorunları sırayla ele alacak.
