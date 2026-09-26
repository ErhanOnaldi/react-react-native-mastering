Film keşif ekranında tür ve sayfa seçimi paylaşılabilir olmalı; kullanıcının işaretlediği favoriler gezinirken kaybolmamalı.

`MovieWorkspace.tsx` içindeki `MovieWorkspace` bileşenini tamamla:

- Tür seçimi ve sayfa numarası URL'de tutulmalı; tarayıcının geri tuşu önceki tür/sayfa seçimine dönmeli.
- TMDB'nin türe göre film keşfi sonucundan gelen filmler listelenmeli; yükleme ve hata durumları okunabilir olmalı.
- Bir film favori işaretlendiğinde, tür veya sayfa değişse bile — o film listeden geçici olarak kaybolsa bile — aynı film tekrar göründüğünde favori işareti korunmalı.

## Arayüz sözleşmesi

- Her filmin favori düğmesi `{film adı} favori` biçiminde adlandırılsın (ör. `Örümcek-Adam: Yepyeni Bir Gün favori`); düğmenin `aria-pressed` değeri durumu göstersin.
