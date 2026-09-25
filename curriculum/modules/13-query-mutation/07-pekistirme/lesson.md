---
title: "Puanı sil, bütün akışı ölç"
minutes: 7
kind: practice
---

# Puanı sil, bütün akışı ölç

:::pain[Problem]
8,5 puanı sildin. Buton “Silindi” dedi, ama Puanladıklarım listesinde Dövüş Kulübü kaldı. Yazma işleminin türü değişti; cache tutarlılığı sorunu aynı kaldı.
:::

## Hatırla ve genişlet

Bu kez `DELETE /movie/550/rating?guest_session_id=...` kullan. Guest session ve Bearer başlığı yine zorunlu. Başarılı silmede rating listesini invalidation ile yenile. Aynı anda başka bir film puanlanırken onu yanlışlıkla listeden çıkarmamaya dikkat et.

İkinci görevde query, mutation ve test düşüncesini birleştir: iki farklı guest session listesini cache’e koy, birinde DELETE başarılı olunca yalnız o oturumun listesini stale yap. Başarısız DELETE’te eski puanı koru. İlk görevde `requests()` ile gerçekten DELETE atıldığını, ikinci görevde doğru key’in invalidation aldığını izle.

:::sector
Bir özelliğin “ekle” ve “sil” yolları aynı cache ailesini etkiliyorsa key’leri bir arada tanımlamak kod incelemesini kolaylaştırır. Bir sonraki modülde form gönderimini de mutation ile bağlayacaksın.
:::
