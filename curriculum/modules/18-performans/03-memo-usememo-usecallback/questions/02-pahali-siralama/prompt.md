## Durum
500 filmin puan sıralaması pahalı. Kullanıcı yalnız temayı değiştirince `rank` yeniden çağrılıyor.

## Yap
- `rank(movies)` sonucunu gerçekten bağımlı olduğu değerler için sakla.
- Tema değişimi sıralamayı tekrarlamasın; film dizisi veya `rank` işlevi değişirse tekrar çalışsın.
- Giriş dizisini mutasyona uğratma (testte `rank` kopya alır).

| Değişim | Beklenen |
|---|---|
| `theme` | Aynı hesaplama sonucu |
| `movies` | Yeni sıralama |
