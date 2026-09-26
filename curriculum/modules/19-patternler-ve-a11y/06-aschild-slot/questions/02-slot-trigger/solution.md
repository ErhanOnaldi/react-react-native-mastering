## Neden böyle?
İç içe button geçersiz DOM ve belirsiz klavye davranışı üretir. Slot tek semantik öğe bırakır. `preventDefault` politikası child'a açmayı iptal etme imkânı verir; handler sırası bu yüzden bilinçlidir. React 19'da `ref` prop'u doğrudan alınabilir; eski `forwardRef` kodunu okuyabilirsin ama yeni API'de şart değil. Sonraki modülde hazır Slot primitive'iyle karşılaştıracaksın.

### Alternatif ve sınır
Ayrı bir `renderTrigger` prop’u benzer esneklik verir ama kullanımı farklı bir API olur.

### Sık hata
Sırf prop spread ile child handlerı veya ref’i ezmek sessiz bozulmadır; callback/object ref ikisini de dene.

### Sektörde ve sıradaki adım
Hazır Slot primitive’lerini sonraki modülde incelerken bu merge politikasını karşılaştır.
