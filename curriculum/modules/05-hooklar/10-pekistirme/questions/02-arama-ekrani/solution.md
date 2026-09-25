Önceki görev hook’un iç davranışını sınadı; burada kullanıcı input’u ve ekrandaki listeyi sınarsın. `userEvent` gerçek etkileşim yolunu çalıştırır. Projede bu kodu doğrudan tekrar yazmak yerine `useDebounce` ve `useFetch` hook’larına böleceksin.

## Alternatif ve tuzak

Yalnızca hook birim testinin geçmesi UI’ın doğru bağlandığını kanıtlamaz. Kullanıcının input’u, liste ve boş sorgu birlikte sınanır.

## Sektörde ve sonra

Projede ayrı hook’ları tekrar kullanarak aynı davranışı Sinema’ya taşıyacaksın.
