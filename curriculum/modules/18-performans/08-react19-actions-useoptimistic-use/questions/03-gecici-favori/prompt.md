Favori butonuna tıklandığında ağ isteğinin cevabı beklenmeden arayüzün anında güncellenmesini, istek başarısız olduğunda ise butonun önceki gerçek durumuna geri dönmesini istiyorsun.

## Gereksinimler
- Butonun başlangıç durumunu `initial` prop'una göre belirle.
- Buton metni aktifken "Favorilerden çıkar", pasifken "Favorilere ekle" olmalıdır.
- Butondaki `aria-pressed` özniteliği anlık görünen durumu yansıtmalıdır (`true` veya `false`).
- Tıklandığında sunucu cevabı henüz gelmeden önce ekrandaki durum iyimser (optimistic) olarak derhal değişmelidir.
- Arka planda `save(next)` çağrılmalıdır. Kayıt başarılı olursa kalıcı durum güncellenmelidir.
- Ağ hatası durumunda iyimser görünüm otomatik olarak son onaylanmış temel duruma geri dönmelidir.

## Örnek
Kullanıcı "Favorilere ekle" butonuna bastığı milisaniyede buton "Favorilerden çıkar" ve `aria-pressed="true"` olur. İstek ağ hatasıyla sonuçlanırsa buton sessizce tekrar "Favorilere ekle" haline geri çekilir.

## Sözleşme
- Dosya ve export: `OptimisticFavorite.tsx` → `OptimisticFavorite({ initial, save }: { initial: boolean, save: (next: boolean) => Promise<void> })`
- Arayüz: `button` elementi ("Favorilere ekle" veya "Favorilerden çıkar").
