## Neden böyle?

- **Alternatif:** Her endpoint için ayrı arama fonksiyonu yazmak aynı davranışı tekrar ederdi.
- **Tuzak:** `T` kısıtsız olursa ID erişimi, `T` yerine yalnız `{id:number}` döndürülürse ek alanlar kaybolur.
- **Sektörde:** API cevap kabuğu ile öğe davranışını ayrı modellemek client kodunu sadeleştirir.
- **Sonraki adım:** İleride tipli endpoint haritasında bu kabuğu tekrar kullanacaksın.
