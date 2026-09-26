## Neden böyle?

İki ekranın onay penceresi aynı davranışı istiyor: Escape ile kapanma, kapanınca odağın açan düğmeye dönmesi, arka planı karartma. Bunu iki kere elle yazmak er ya da geç birbirinden sapar — tam da silme ekranında olduğu gibi, biri düzgün yazılmış, öteki acele hazırlanmış bir `<div>` kalmış. Ortak davranışı tek bir `ConfirmDialog` bileşenine çıkarıp her ekranın yalnızca başlık, açıklama ve onay callback'ini vermesi, davranışın iki yerde de birebir aynı kalmasını garanti eder.

Radix'in `Dialog` bileşenini seçmenin sebebi: Escape dinleyicisini ve odak tuzağını (focus trap) kendisi yönetir; kapanışta hangi elemente odağın döneceğini de `onCloseAutoFocus` ile sen belirleyebilirsin. Silme ekranında birden çok `Sil` düğmesi olduğundan "hangisi açtıysa ona dön" bilgisini bir `ref`'te tutup `restoreFocusRef` olarak paylaşılan bileşene veriyoruz — kendi `useEffect` ile `keydown` dinleyip aynısını elle kurabilirdin de, Radix'in hazır olay kancasını kullanmak daha az kod.

**Alternatif:** Radix yerine kendi `useConfirmDialog` hook'unu yazıp (açık/kapalı state, `keydown` dinleyicisi, `useRef` ile önceki odağı saklama) iki ekranın da onu çağırmasını sağlayabilirsin. Davranış testleri aynı şekilde geçer; tercih ettiğin araç değil, paylaşılan tek bir yer olması önemli.

**Tuzaklar:**
- `Dialog.Close` yerine kendi "Vazgeç" düğmenle `onOpenChange(false)` çağırmayı unutursan pencere kapanmaz.
- `Dialog.Content`'i `Dialog.Portal` içine koymazsan bazı z-index/overlay senaryolarında sorun çıkar; test bunu yakalamaz ama gerçek arayüzde fark edilir.
- Onay bileşenini her ekranda ayrı `open` state'iyle çağırman gerekir; state'i bileşenin içine gizlersen iki ekran birbirinin penceresini tetikleyebilir.

Bir sonraki adım: 21. modülde bu Esc/focus davranışını gerçek bir tarayıcıda Playwright ile de sınayacaksın — orada portal, gerçek DOM'da render olduğu için ekstra bir ayar gerekmez.
