---
title: "State sınırı ve birleşik akış"
minutes: 9
kind: practice
---

# State sınırı ve birleşik akış

:::pain[Problem]
Tür değiştirince favori işaretleri kayboluyor; görünüm değiştirince film listesi sıfırlanıyor. Arama ekranında ise geri tuşuna basınca URL bir şey söylüyor, cache başka bir şey gösteriyor. Her ekranda "bu bilginin sahibi kim?" sorusunu yeniden sormak gerekiyor.
:::

Bu atölyede state'i nereye koyacağını, hangi aracı kullanacağını sen seçersin; testler yalnızca bileşenin dışarıdan görünen davranışına bakar. İpuçlarına yalnızca takıldığında bak. Mimari görevlerde `projects/atolye` içinde çalış ve bitince görev sayfasındaki **"AI review prompt'unu kopyala"** düğmesiyle kontrol ettir.

Görevler: filtre ve favorileri doğru sınırda tut; karışan görünüm/tür state'ini ayır; URL ile cache'i birleştir; kişisel koleksiyon; kullanıcının akışı.
