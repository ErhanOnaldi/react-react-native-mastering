## Neden böyle?
Bu görev önceki derslerin birleşimi: kendi state'i, portal, erişilebilir ad, focus trap ve focus'u geri verme. Yeni olan tek parça arka plan tıklaması ve o tek satır:

```tsx
if (event.target === event.currentTarget) setOpen(false)
```

Tıklama olayı en içteki öğeden (başlık, düğme) başlar ve atalara kabarcıklanır. Arka planın `onClick`'i, dialogun içindeki her tıklamayı da duyar. `target` (tıklanan öğe) ile `currentTarget` (dinleyicinin sahibi) aynıysa kullanıcı gerçekten arka plana tıklamıştır.

Portal bu kuralı değiştirmez: React olayları portal içinden **React ağacındaki** atalara yayılır. Yani arka planı kartın içine koysaydın ve kartın bir `onClick`'i olsaydı, dialog içi tıklamalar karta da ulaşırdı.

### Alternatifler
- Dialog içeriğinde `onClick={(e) => e.stopPropagation()}` da işe yarar, ama sayfadaki başka dinleyicileri (analitik, dışarı tıklama algılayan menüler) de susturur. Hedef kontrolü daha dar ve güvenli.
- Tarayıcının yerel `<dialog>` elementi + `showModal()` focus trap ve Escape'i kendisi yapar; `::backdrop` tıklaması için yine hedef kontrolü gerekir.

### Sık hata
Arka plan tıklamasını ekleyip Escape'i unutmak: fare kullanıcısı kapatabilir, klavye kullanıcısı kapatamaz.

### Sıradaki adım
Proje görevinde bu akışı yeniden kullanılabilir bir `Modal` compound API'sine taşıyacaksın. Orada içerik sabit iki düğme değil, rastgele `children` olacak; focus trap'in "ilk" ve "son" kontrolü dinamik olarak bulması gerekecek.
