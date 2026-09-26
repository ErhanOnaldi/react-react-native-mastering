## Neden böyle?
Headless hook aynı davranışı birbirine benzemeyen UI'larda paylaşır: dialog, çekmece, menü. `toggle` updater biçimini kullandığı için aynı olaydaki iki çağrı eski snapshot'a takılmaz.

`useCallback` burada süs değil, sözleşmenin parçası. Hook'un döndürdüğü `close`, örneğin şöyle kullanılacak:

```tsx
const { pathname } = useLocation()
useEffect(() => close(), [pathname, close]) // rota değişince menüyü kapat
```

`close` her render'da yeni olsaydı bu effect **her render'da** çalışırdı. React Compiler açık bir projede compiler bunu senin için de sabitleyebilir; ama paylaşılan bir hook, compiler'sız bir ortamda da doğru çalışmalı.

### Alternatif ve sınır
- Her bileşende ayrı `useState` yazmak da geçerli. Aynı davranış üçüncü kez tekrar edince ortak bir sözleşme değer kazanır.
- `useReducer` ile `{ type: 'open' | 'close' | 'toggle' }` yazmak da mümkün; `dispatch` zaten kararlıdır. Üç eylem için `useState` daha okunur.

### Sık hata
`toggle: () => setIsOpen(!isOpen)` tek tıklamada çalışır, çift çağrıda bozulur; üçüncü test bu farkı yakalar.

### Sıradaki adım
Proje görevinde `Modal` kökü bu hook'u kullanacak; `Modal.Trigger` `open`'ı, `Modal.Close` ve Escape `close`'u çağıracak.
