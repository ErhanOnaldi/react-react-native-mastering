Arama URL'sinden sayfa numarasını ve arşiv filtresini uygulamada kullanılacak değerlere dönüştür.

## Gereksinimler
- page pozitif tam sayı olur; eksik, geçersiz, kesirli veya sıfır değerinde 1 kullanılır.
- archived true/false ve 1/0 metinlerini yorumlar; yoksa veya geçersizse false kullanılır.
- Sonuç nesnesi yalnızca page ve archived alanlarını içerir.

## Örnek
?page=2&archived=false → { page: 2, archived: false }. Boş arama metni → { page: 1, archived: false }.

## Sözleşme
- filters.ts dosyasında readFilters(search: string): { page: number; archived: boolean } named export'unu tanımla.

## Kısıtlar
- Sayfa değeri tam sayıya ve en az 1'e uymalıdır.
- Flag true/false ve 1/0 metinlerini tanımalıdır.
