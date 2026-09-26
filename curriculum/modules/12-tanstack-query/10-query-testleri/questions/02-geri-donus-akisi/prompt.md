Modül 7’deki acı günlüğünün aynı akışını tekrar çalıştır: arama → detay → geri. Bu kez Query cache ile `requests('/3/search/movie')` **1** kalmalı.

## İstenen

`SearchAgain({ query })` içinde `Detay` butonu `Detay sayfası` görünümüne, `Geri` butonu yeniden aramaya götürsün. Arama sonucu TMDB’den Bearer ile gelsin. Aynı aramaya 60 saniye içinde dönünce yeni GET gitmesin; farklı query gelince yeni GET olsun. `Dövüş` sonucu `Dövüş Kulübü` gösterilmeli.
