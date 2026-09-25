## Neden böyle?

- **Alternatif:** Ayrı elle yazılmış union ve seçenek dizisi zamanla farklılaşabilir.
- **Tuzak:** `as const` yoksa değerler `string`e genişler; URL’den gelen string yine guard ister.
- **Sektörde:** Tek kaynaklı seçenek listeleri filtre arayüzlerini güvenli tutar.
- **Sonraki adım:** Config dersinde bu literal bilgiyi `satisfies` ile sözleşmeye bağlayacaksın.
