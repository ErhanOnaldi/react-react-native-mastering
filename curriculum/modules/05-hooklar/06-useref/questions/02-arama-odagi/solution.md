DOM odağı dış dünya ile etkileşimdir; event handler buna uygun yerdir. Odağı state içinde tutmak gereksiz render üretir. React 19’da bu ref’i kendi `SearchInput` bileşenine `ref` prop’u olarak da geçirebilirsin.

## Alternatif ve tuzak

`document.querySelector` global ağaca bağımlıdır; ref doğrudan bu input’u işaret eder. `focus` düğme event’inde yapılır.

## Sektörde ve sonra

İleri bileşen kalıplarında ref aktarımı ve erişilebilir odak yönetimi yeniden karşına çıkacak.
