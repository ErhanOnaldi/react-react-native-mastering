## Sorun
Sinema arama kutusu yazıyı gösteriyor ama Enter ile aramayı başlatmıyor. Callback’i tek başına çağıran test bunu yakalamaz.

## Görev
`SearchBox` kontrollü bir form olsun. `value`, `onChange(value)` ve `onSubmit(value)` props’larını al. Etiket "Film ara", buton adı "Ara" olsun. Yazma `onChange`’i güncellesin; form gönderildiğinde `preventDefault` ile sayfa yenilenmesin ve kırpılmış değer `onSubmit`’e gitsin. Boş değerde `onSubmit` çağırma.

## Örnek
`value=" Matrix "` → Ara → `onSubmit("Matrix")`.
