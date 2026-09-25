## Neden böyle?

- **Alternatif:** Dört ayrı setter yerine tek saf geçiş fonksiyonu durumları birlikte değiştirir.
- **Tuzak:** `{ ...state, status: "loading" }` eski `data`yı sızdırabilir; her dalda yeni nesne kur.
- **Sektörde:** Saf reducer’lar test etmesi kolay durum makineleridir.
- **Sonraki adım:** React Hook’lar modülünde `useReducer` ile aynı geçişleri UI’ye bağlayacaksın.
