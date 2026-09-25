Paket yöneticilerinin içinde, bir sürümün `^` aralığına uyup uymadığını kontrol eden küçük bir fonksiyon vardır. Şimdi onu sen yazacaksın.

`satisfiesCaret(version, range)` fonksiyonunu tamamla:

```ts
satisfiesCaret('19.3.5', '^19.3.0') // true
satisfiesCaret('20.0.0', '^19.3.0') // false
```

Kurallar (MAJOR ≥ 1 varsay):

1. MAJOR'lar aynı olmalı.
2. Sürüm, aralığın başındaki sürümden **büyük ya da eşit** olmalı.

`parseVersion` yardımcı fonksiyonu hazır; onu kullan.
