Film detayında Özet ve Oyuncular sekmelerini `active`, `onChange` prop'larını elle taşıyarak bağlıyorsun. Önizlemede sekmelere tıkla: hangi panelin açık olduğu ile hangi sekmenin seçili göründüğü birbirinden habersiz.

## Görev
`Tabs.tsx` içindeki compound API'yi Context ile çalışır hale getir. Kullanım şekli değişmesin:

```tsx
<Tabs defaultValue="summary">
  <Tabs.List aria-label="Film bilgileri">
    <Tabs.Trigger value="summary">Özet</Tabs.Trigger>
    <Tabs.Trigger value="cast">Oyuncular</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Panel value="summary">…</Tabs.Panel>
  <Tabs.Panel value="cast">…</Tabs.Panel>
</Tabs>
```

## Gereksinimler
- Seçim state'i yalnızca kökte (`Tabs`) dursun; başlangıç değeri `defaultValue`.
- `Tabs.List` bir `tablist` olsun ve `aria-label`'ı taşısın.
- `Tabs.Trigger` gerçek bir `<button type="button">` + `role="tab"` olsun; tıklanınca seçilsin, `aria-selected` doğru değeri göstersin.
- `Tabs.Panel` seçiliyse `role="tabpanel"` ile görünsün; seçili değilse DOM'da olmasın.
- Parçalar `Tabs` dışında kullanılırsa sessizce boş çalışmasın; anlaşılır bir hata fırlatsın.

Yön tuşları ve panel–sekme id bağları bu adımda yok; sonraki soru onları ekleyecek.
