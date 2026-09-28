Arama sonuçları listelenirken arayüz güncellemelerinin ne sıklıkla commit edildiğini izlemek istiyorsun.

## Gereksinimler
- Liste bileşeninin render ve commit aşamalarını izleyen bir ölçüm sarmalayıcısı ekle.
- Ölçüm kimliği olarak `movie-list` değerini kullan.
- Ölçüm geri çağırma (callback) fonksiyonunu doğrudan bileşene gelen `onCommit` fonksiyonuna bağla.
- Film başlıklarını mevcut `ul > li` yapısı içinde koru.

## Örnek
Bileşen ilk kez ekrana basıldığında (`mount`) ve liste her güncellendiğinde (`update`) ilgili commit olayı `onCommit` fonksiyonuna iletilir.

## Sözleşme
- Dosya ve export: `ProfiledMovies.tsx` → `ProfiledMovies({ titles, onCommit }: { titles: string[], onCommit: ProfilerOnRenderCallback })`
- Arayüz: `ul > li` içinde başlıklar (`screen.getAllByRole('listitem')`).
