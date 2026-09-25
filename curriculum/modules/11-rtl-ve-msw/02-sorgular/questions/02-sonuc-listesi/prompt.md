## Sorun
Arama sonucunda film bulunduğunda başlık; bulunmadığında "Film bulunamadı" mesajı görünmeli. Bir CSS seçicisi iki hatayı da kaçırabilir.

## Görev
`@impl/MovieResults` için iki test yaz: verilen "Matrix" filmini heading rolüyle ve adıyla bul; boş listede "Film bulunamadı" status mesajını bul. Boş listede film başlığı olmadığını `queryByRole` ile doğrula.

## Örnek
`movies={[]}` → status; `movies={[{ id: 603, title: 'Matrix' }]}` → heading.
