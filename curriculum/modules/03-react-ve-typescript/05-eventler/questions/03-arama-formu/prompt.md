Formu Enter ile göndermek istiyoruz, sayfanın yenilenmesini değil. `SearchForm({ onSearch })` yaz. Controlled input’un etiketi “Film ara”, submit düğmesi “Ara” olsun. Submit’te `preventDefault()` çağırıp kırpılmış sorguyu `onSearch` ile bildir; boş/yalnız boşluk sorguda çağırma. Handler için `FormEvent<HTMLFormElement>` kullan.

**Örnek:** `"  Matrix  "` yazıp Enter’a bas → `onSearch("Matrix")`; yalnız boşluk → çağrı yok.
