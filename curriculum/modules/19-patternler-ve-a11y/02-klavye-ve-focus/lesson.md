---
title: "Klavye ve focus döngüsü"
minutes: 15
kind: concept
---

# Klavye ve focus döngüsü

:::pain[Belirti]
Film ayrıntısında fragman penceresini açtın. Tab'a basınca focus pencerenin arkasındaki arama alanına kaçıyor; Escape hiçbir şey yapmıyor. Fareyle kapattığında da klavyede nerede kaldığını kaybediyorsun: odak sayfanın başına düşüyor.
:::

## Modalın klavye sözleşmesi

Modal dialog, sayfanın geri kalanıyla geçici olarak etkileşimi durdurur. Bu yüzden bir klavye kullanıcısına dört davranış vaat eder: açılınca focus içeri gider; dialog açıkken Tab sırası içeride kalır; Escape dialogu kapatır; kapanınca focus açan öğeye döner. Bunlar ayrı özellikler gibi görünse de kullanıcıya tek bir kesintisiz görev sunar.

![Açan öğeden modalın içine focus geçişini, dialog içinde Tab döngüsünü ve kapanışta iadesini gösteren diyagram](diagrams/focus-dongusu.svg "Açılış, trap ve focus iadesi")

Kurallar:

1. **Açılışta önceki focus'u sakla.** Dialog açılmadan hemen önce `document.activeElement` tetikleyicidir. Modalı açan kontrol DOM'da kalmayabilir; iade etmeden önce `isConnected` kontrolü yap.
2. **Focus'u anlamlı başlangıca taşı.** İlk buton uygunsa onu seç. Dialog uzun metinle başlıyorsa başlığı `tabIndex={-1}` verip focus başlangıcı yapabilirsin; bu, başlığı normal Tab sırasına eklemez.
3. **Sadece uçlarda Tab'ı yönet.** Son kontrolde Tab ileri giderse ilk kontrole, ilk kontrolde Shift+Tab geriye giderse sona sar. Aradaki doğal sıralamayı tarayıcıya bırak.
4. **Adayları güncel DOM'dan bul.** Modal içeriği değişebiliyorsa sabit bir NodeList eski kalır. `disabled` öğeler focus alamaz; görünmeyen veya `tabIndex=-1` öğeleri de aday dışı bırak.
5. **Kapanışta iki işi birlikte yap.** Dinleyiciyi kaldır ve önceki öğe hâlâ sayfadaysa focus'u ona ver. Modalı kapatırken kullanıcı klavye bağlamını kaybetmemeli.

Buradaki model, erişilebilirlik ağacının anlattığı isimden farklı bir soruyu çözer. Erişilebilir ad “bu kontrol nedir?” der; focus “klavyeden sıradaki etkileşim nerede?” sorusuna cevap verir. [a11y temelleri](../01-a11y-temelleri/lesson.md) içindeki rol–ad–durum düşüncesi hâlâ geçerlidir; şimdi ona zaman içindeki focus hareketi ekleniyor.

Focus trap, bütün Tab hareketini elle taklit etmek değildir. Dialogda ilk ve son focusable elemanı bulup sınırda müdahale etmek yeterlidir. Sıfır eleman varsa ilk/son indeksine erişmeye çalışma; başlığı başlangıç odağı yap veya dialogun etkileşim sözleşmesine göre uygun bir kontrol ekle. Yalnızca bir eleman varsa ileri ve geri sınırlar aynı öğeye döner.

## Sınırda dönen focus'u izleyelim

Dialog açılınca focus `Oynat` düğmesine gider. Son kontrol `Kapat`; arada bir `Altyazı dili` select'i bulunduğunu varsayalım:

| Tuş / olay | Önceki focus | Sonraki focus | Neden |
| --- | --- | --- | --- |
| Dialog açılır | Fragmanı aç | Oynat | Açılış odağı içeride olmalı |
| Tab | Oynat | Altyazı dili | Tarayıcının doğal sırası |
| Tab | Altyazı dili | Kapat | Tarayıcının doğal sırası |
| Tab | Kapat | Oynat | Son sınır aşılacağı için olay durdurulur |
| Shift+Tab | Oynat | Kapat | İlk sınırda ters yönde sarılır |
| Escape | Dialog içi öğe | Fragmanı aç | Kapanış iadesi |

Keydown handler'ı `event.key === 'Tab'` ve `event.shiftKey` değerlerine bakar. Son elemana gelip ileri gidişte `preventDefault()` çağrılır, sonra ilk elemana focus verilir. İlk elemana gelip geriye gidişte aynı işlem ters yönde yapılır. Diğer Tab tuşlarında `preventDefault()` çağırmamak önemlidir; gereksiz müdahale tarayıcının alışılmış focus sırasını bozabilir.

## Kırık döngü, doğru döngü

Yalnızca Escape listener'ı ekleyip açılışta focus vermek, focus trap değildir:

```tsx
useEffect(() => {
  if (!open) return
  firstControl.current?.focus()
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') onClose()
  })
}, [open, onClose])
```

Bu kodda Tab sınırları yönetilmiyor, listener cleanup'ı yok ve `onClose` her render'da değişirse effect yeniden kurulur. Eski callback'i kaldırmak da mümkün olmaz; listener'a kayıt anında isimsiz yeni fonksiyon verildi. Focus klavyeyle dialog dışına çıkabilir ve kapalı dialog Escape'e tepki vermeye devam eder. Doğru çözüm, effect süresince saklanan aynı callback'i cleanup'ta kaldırır, uçlardaki Tab davranışını ele alır ve önceki focus'u geri verir.

Sadece ilk elemana focus vermek focus trap değildir:

```tsx
useEffect(() => {
  if (open) firstButton.current?.focus()
}, [open])
```

Kullanıcı ilk Tab'dan sonra sayfanın geri kalanına geçer. Ayrıca kapanışta geri dönüş yoktur. Tam bir uygulama focus edilebilir öğeleri modal DOM'undan bulur, iki sınır tuşunda yönlendirir ve cleanup'ta açan öğeye döner. Aşağıdaki örnek yalnızca Escape dinleyicisinin yaşam döngüsünü gösterir:

```tsx check
import { useEffect, useEffectEvent } from 'react'

export function useEscape(open: boolean, onClose: () => void) {
  const closeFromKey = useEffectEvent(() => onClose())
  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closeFromKey()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])
}
```

İz sürme: `open` false iken handler kurulmaz. true olduğunda setup listener ekler. Kullanıcı Escape'e basınca listener güncel kapatma davranışını çağırır. State false olunca React cleanup'ı çalıştırıp aynı listener referansını kaldırır. Bileşen unmount olursa cleanup yine çalışır. `useEffectEvent` güncel callback'i okur ama effect'in her yeni callback referansında yeniden kurulmasını gerektirmez. Yine de `open`, effect'in gerçek girdisi olduğu için dependency olarak kalır.

Bu ayrım önemlidir: Effect tarayıcı listener'ı gibi dış sistemle senkronize olur; `onClose` ise klavye olayı geldiği anda yapılacak eylemdir. `onClose`'u doğrudan dependency listesine koyup ebeveynin her render'da yeni callback oluşturmasına izin verirsen effect cleanup focus'u erken iade edebilir, yeni setup focus'u tekrar içeri alabilir. Odak zıplaması, yalnızca “callback değişti” uyarısı değil, kullanıcının konumunun kaybolmasıdır.

## Belirti → neden → düzeltme

:::mistake[Belirti: Dialog kapanınca focus sayfanın başına düşüyor]
Belirti → Escape sonrası sonraki Tab beklenmeyen bir bağlantıya gidiyor.  
Neden → Açılıştaki `document.activeElement` saklanmamış ya da artık DOM'da olmayan öğeye dönülmüş.  
Düzeltme → Önceki öğeyi sakla; kapanışta `isConnected` ise focus ver.
:::

:::mistake[Belirti: Dialog kapanınca Escape hâlâ çalışıyor]
Belirti → Modal kapalıyken Escape'e basmak eski kapanış davranışını çağırıyor.  
Neden → Document listener cleanup'ta kaldırılmamış veya farklı callback referansı kaldırılmaya çalışılmış.  
Düzeltme → Setup ve cleanup'ta aynı fonksiyon değerini kullan.
:::

:::mistake[Belirti: Klavye odağı dialog açıkken zıplıyor]
Belirti → Kullanıcı Kapat düğmesinde beklerken focus açana ve sonra tekrar dialoga taşınıyor.  
Neden → Sık değişen callback effect'i yeniden kuruyor.  
Düzeltme → Effect'i açık/kapalı durumu gibi gerçek senkronizasyon girdisine bağla; olay callback'ini güncel okuyan API'yi kullan.
:::

:::mistake[Belirti: Shift+Tab arka sayfaya geçiyor]
Belirti → İlk kontrolden geriye gidince modal dışı bir bağlantı focus alıyor.  
Neden → Sadece ileri Tab sınırı ele alınmış.  
Düzeltme → `shiftKey` ile ters yönü ayrı ele alıp ilk kontrolden son kontrole sar.
:::

:::model[Render → commit → effect]
Render hangi kontrollerin DOM'da bulunacağını hesaplar. Focus ve `document` listener'ı tarayıcının dış durumudur; kontroller DOM'a commit edildikten sonra senkronize edilir. Bu bağlamda effect açılma durumuna göre listener kurar ve kapanışta temizler.
:::

:::sector
Üretimde Radix, React Aria ve Base UI gibi test edilmiş primitive'ler modal davranışının zor köşelerini kapsar: dinamik içerik, iç içe pencereler, iframe ve görünür focus. Ekiplerde kontrol yalnızca Escape'in çalışmasına indirgenmez; açılış, iki yönlü Tab sınırı, kapatma ve focus iadesi tek akış olarak sınanır. Ekran okuyucu anonsu ve klavyeyle gerçek kullanım da otomatik testlerin yanına eklenir.
:::

## Özet

- Modal açılışında focus içeri gider; kapanışta önceki öğeye döner.
- Tab ve Shift+Tab yalnızca dialog sınırlarında yönlendirilir.
- Dinamik içerik ve disabled kontroller yüzünden focus listesi güncel DOM'dan bulunur.
- Event listener setup ile eklenir ve cleanup'ta aynı callback ile kaldırılır.
- Focus, rol ve addan ayrı bir erişilebilirlik boyutudur; ikisi de doğru olmalı.

**Kendini yokla:** Dialogda iki focusable öğe varsa ileri Tab'da ne zaman müdahale edersin?  
*Cevap:* Son öğedeyken Tab'a basıldığında; aradaki geçişi tarayıcı yapar.

**Kendini yokla:** Cleanup'ta yalnızca listener'ı kaldırmak neden yetmez?  
*Cevap:* Kullanıcının focus'u dialog açan kontrole geri dönmez; klavye konumu kaybolabilir.
