---
title: "Kullanıcı etkileşimi"
minutes: 7
kind: concept
---

# Kullanıcı etkileşimi

:::pain[Problem]
Favori butonunun onClick prop’unu doğrudan çağıran test geçiyor. Gerçek buton disabled olduğu için kullanıcı hiçbir şey yapamıyor.
:::

## İhtiyaç ve çözüm

`userEvent.setup()` bir etkileşim oturumu açar. `await user.click(button)` ve `await user.type(input, "Matrix")` gerçek kullanıcıya yakın olay dizisi gönderir. Promise döndüklerinden `await` gerekir.

Controlled input’ta yazılan değer state’e yansır; değişen ekranı sınayacağız. `fireEvent` daha düşük düzey özel durumlar içindir. Fake timer ile birlikte `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })` kullanılır.

## Handler yerine ekranı çalıştır

Arama kutusunda `onChange('Matrix')` fonksiyonunu elle çağırmak input’un yazılabilir olduğunu kanıtlamaz. Kullanıcı gibi yazarsan `input`, `change` ve React state güncellemesi aynı akışta işler.

```tsx title="SearchBox.test.tsx"
const user = userEvent.setup()
render(<SearchBox value="" onChange={onChange} onSubmit={onSubmit} />)
await user.type(screen.getByRole('searchbox', { name: 'Film ara' }), 'Matrix')
expect(onChange).toHaveBeenCalled()
```

Kontrollü input testinde ebeveynin state’i de güncellemesi gerekir; sabit `value=""` ile yalnız callback’in çağrısını ölçersin, input ekrandaki yazıyı koruyamaz. Bu yüzden kod görevindeki `Harness` `useState` kullanır. `await user.click(...)` ile form butonuna basarsın; formun `preventDefault` yapması sayfanın yenilenmesini önler.

Bir önceki derste role ve name ile **hangi** kontrolü bulduğunu belirledin. Şimdi o kontrol üzerinde **hangi eylemi** yaptığını ekliyorsun. Bir sonraki derste eylemin API yanıtı beklemesini öğreneceksin.

:::mistake
`user.type` ve `user.click` Promise döndürür. `await` unutulursa assertion olaylar tamamlanmadan çalışabilir. Fake timer’lı testte `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })` gerekir.
:::

:::sector[Sektörde]
Form ve navigasyon testlerinde tek bir userEvent oturumunu kullanmak, bir kullanıcının art arda yaptığı eylemleri okunur kılar.
:::
