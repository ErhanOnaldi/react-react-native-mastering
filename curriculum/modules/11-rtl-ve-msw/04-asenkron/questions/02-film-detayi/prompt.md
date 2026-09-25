## Sorun
`getByRole` istek bitmeden başlığı arıyor. Önce loading göstermeyen bir bileşen de kullanıcıyı boş ekrana bırakıyor.

## Görev
`MovieTitle({ id })` mount olduğunda `${TMDB_BASE}/movie/${id}` adresinden filmi getir. `Authorization: Bearer test-token` gönder. Başlangıçta `role="status"` ile "Yükleniyor", başarıda `h2` ile film başlığı, HTTP hata ya da ağ hatasında `role="alert"` ile "Film yüklenemedi" göster. `id` değişirse yeni filmi getir; eski effect’i cleanup ile geçersiz kıl.

## Örnek
`id={550}` → önce Yükleniyor → Dövüş Kulübü.
