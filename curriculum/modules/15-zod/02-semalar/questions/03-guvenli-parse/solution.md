## Neden böyle?

`safeParse` beklenen veri hatasını exception akışına sokmaz. Kart gibi bağımsız bir yerde kontrollü yedek metin işe yarar. API client'ta ise bütün sorguyu hata durumuna taşımak daha uygundur; bunu 8. derste yapacağız.

## Alternatif, tuzak ve devamı

`try/catch` ile `.parse` de yapılabilir; bu beklenen kart yedeği için gereksiz exception akışıdır. Sadece `z.string()` boş başlığı kabul eder. API client görevinde ise bütün sorgunun hata durumuna geçmesi için `parse` kullanacaksın.
