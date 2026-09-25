Sinema arama alanı yazdığını üst bileşene bildirmeli. `SearchField({ value, onChange })` yaz; `onChange` tipi `(value: string) => void` olsun. `<input aria-label="Film ara">` controlled kalsın. Handler’ı ayrı `ChangeEvent<HTMLInputElement>` fonksiyonuyla tiple ve `currentTarget.value` gönder. `value="Kara"` verilirse input Kara göstermeli.

**Örnek:** Boş input’a `M` yaz → `onChange("M")` çağrısı.
