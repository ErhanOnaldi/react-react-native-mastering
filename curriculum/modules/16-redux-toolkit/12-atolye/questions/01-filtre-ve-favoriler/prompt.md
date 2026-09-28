Film keşif ekranında filtre seçimi gezinme geçmişine yazılmalı; kişisel film tercihleri tür değişiminden etkilenmemeli.

## Gereksinimler

- Tür ve sayfa seçimi URL ile uyumlu olur; geri tuşu önceki seçime döner.
- TMDB tür keşfi sonuçları listelenir; yükleme ve hata durumları okunabilir olur.
- Film favorisi tür veya sayfa değişip film yeniden göründüğünde korunur.

## Örnek

Bir filmi işaretle, başka türe geç ve geri dön: aynı film hâlâ işaretli görünür. İkinci sayfaya git: adres çubuğundaki sayfa değeri `2` olur.

## Sözleşme

- Dosya ve export: `MovieWorkspace.tsx` → `MovieWorkspace`
- Her filmin favori düğmesi `{film adı} favori` biçiminde adlandırılsın (ör. `Örümcek-Adam: Yepyeni Bir Gün favori`); düğmenin `aria-pressed` değeri durumu göstersin.
