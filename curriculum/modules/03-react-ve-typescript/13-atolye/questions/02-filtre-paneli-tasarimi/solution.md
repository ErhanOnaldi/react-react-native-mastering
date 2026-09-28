## Neden böyle?

Burada kompozisyon parçaları seçildi. Panel arama alanını `children` olarak alır; başka bir ekran aynı panel içine ek filtre yerleştirebilir. Tek `mode` prop'lu panel, sabit ve az sayıda görünüm için daha kısa bir API olabilir. İki tasarım da geçerli: önemli olan seçimin gerekçesi ve filtre değerinin tek kaynakta tutulması.

Alternatif olarak panelin `mode` prop'una göre arama alanı gibi hazır kontrolleri gösterip üst bileşenden `value` ve `onChange` alabilirsin. Bu yaklaşım tek ekran için parça sayısını azaltır, ama yeni yerleşimler geldikçe `mode` seçenekleri büyüyebilir. Input'a `defaultValue` verip filtreyi ayrı state'te tutmak ekrandaki değerle sonuçları ayırabilir; controlled değer kullanmak bunu önler.

Modül 9'da panel tür ve sıralama kontrolleriyle genişleyecek. O zaman bugünkü basit API seçiminin maliyetini yeniden tartacaksın.
