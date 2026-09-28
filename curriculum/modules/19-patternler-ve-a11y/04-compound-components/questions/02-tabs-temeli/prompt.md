Film detayındaki Özet ve Oyuncular bölümlerinde seçili sekme ile görünen panel birbirinden kopuyor. Sekme grubunu tek bir seçim kaynağıyla çalışır hale getir.

## Gereksinimler

- Seçim kökte dursun ve başlangıç değeri `defaultValue` olsun.
- Liste erişilebilir `tablist` rolü alsın ve verilen `aria-label` değerini taşısın.
- Her sekme gerçek `<button type="button">` olsun; `role="tab"`, doğru `aria-selected` ve click ile seçim desteği taşısın.
- Seçili `tabpanel` gösterilsin; seçili olmayan panel DOM'da bulunmasın.
- Parçalar kök olmadan kullanılırsa anlaşılır hata oluşsun.
- Bu aşamada klavye yön tuşları ve tab/panel id bağları beklenmiyor.

## Örnek

Başlangıç değeri `summary` iken `Özet` seçilidir ve yalnızca özeti içeren panel görünür. `Oyuncular`'a tıklayınca seçili durum ve panel birlikte değişir.

## Sözleşme

- `Tabs.tsx` içinden named export `Tabs`.
- Bileşik API: `Tabs.List`, `Tabs.Trigger({ value })`, `Tabs.Panel({ value })`.
- `List` `aria-label` alır; Trigger button, Panel `tabpanel` rolü kullanır.
