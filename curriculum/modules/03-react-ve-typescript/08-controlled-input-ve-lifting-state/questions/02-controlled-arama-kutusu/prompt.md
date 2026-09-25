Bu kez arama kutusunu tekrar kullanılabilir bileşen yap. `SearchBox({ value, onChange })` içinde etiketi “Film ara” olan controlled input göster. `onChange` callback’i yeni string değeri alsın. Props değişince görünen değer de değişmeli. Önceki dersten fark: kutu kendi state’ini tutmaz; değer sahibine döner.

**Örnek:** `value="Kara"` → input’ta Kara; yeni karakter yazılınca `onChange` yeni metni alır.
