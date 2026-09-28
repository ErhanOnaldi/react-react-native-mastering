## Neden böyle?

İki ayrı hata aynı köke iniyor: effect'in "ne zaman, ne kadar" çalışacağı net değildi. `token` state'i `initialToken` prop'unu görmezden alınca, jeton zaten elde olsa bile effect hiçbir zaman "jeton var" durumuna geçmiyordu — bu yüzden sayfa yenileme simülasyonu boş ekranda kalıyordu. İkinci hata ise aynı effect gövdesinde iki kez tetiklenen aynı istekti; `token` değiştiğinde tek bir çağrı yeterliyken kod iki çağrı bırakıyordu.

Çözüm iki parçalı: `useState(initialToken)` ile başlangıç değerini prop'tan al, effect gövdesinde tek bir `fetchMe` çağrısı bırak ve bir `ignore` bayrağıyla eski (artık geçersiz) cevabın state'i güncellemesini engelle. `ignore` bayrağı burada süslü değil; `token` hızlı değişirse (örn. çıkış yapıp başka hesapla giriş) önceki isteğin geç gelen cevabının ekranı ele geçirmesini önler.

**Alternatif yaklaşım:** `AbortController` kullanıp effect cleanup'ında `controller.abort()` çağırabilirsin; `fetch` REST hatası yerine `AbortError` fırlatır, `catch` bloğunda bunu ayırt etmen gerekir. İkisi de "eski cevap yeni ekranı ele geçirmesin" sözleşmesini sağlar.

**Tuzaklar:** `ignore` bayrağını `useRef` yerine effect'in kendi kapanışında (closure) bir `let` olarak tutmak yeterli — her effect çalışması kendi bayrağını taşır, önceki çalışmanınkiyle karışmaz. Bayrağı effect dışında (component-level state) tutarsan farklı çalışmalar birbirini yanlışlıkla etkileyebilir.

**Köprü:** Bir sonraki görevde (`SessionPanel`) aynı jeton artık süresi dolabilen bir şey olacak; `/auth/me` 401 döndüğünde "sonsuza dek yükleniyor" kalmamak için bu effect'e bir de refresh denemesi ekleyeceksin.
