Modül 7’deki acı günlüğünün aynı akışını tekrar çalıştır: arama → detay → geri. Bu kez Query cache ile `requests('/3/search/movie')` **1** kalmalı.

## İstenen

`SearchAgain({ query })` `Detay` butonuyla arama alt bileşenini unmount etsin; `Geri` ile tekrar mount etsin. Arama sonucu TMDB’den Bearer ile gelsin; query key arama metnini taşısın; `staleTime: 60_000` olsun. `Dövüş` sonucu `Dövüş Kulübü` gösterilmeli. Farklı query gelince yeni GET olmalı.
