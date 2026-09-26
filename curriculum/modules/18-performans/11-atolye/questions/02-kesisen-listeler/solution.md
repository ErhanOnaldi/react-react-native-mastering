## Neden böyle?

İki tür arasında geçiş "aynı sorgunun farklı parametreyle çağrılması" değil, **iki ayrı sorgu**dir. `queryKey`'e `genreId`'yi eklemek (`['discover-movie', genreId]`) her türe kendi cache hücresini verir: bir türün yanıtı geç gelse bile, o an ekranda okunan sorgu zaten farklı bir `queryKey`'e bakıyor olduğu için yanlış veriyi asla göstermez. `queryKey`'i sabit bırakırsan (`['discover-movie']`) React Query bunu "aynı sorgu" sanır; ya hiç yeniden çekmez (eski veri ekranda kalır) ya da hangi cevabın hangi seçime ait olduğunu birbirine karıştırır.

İkinci kısım klasik invalidation: puanlama başarılı olunca `Puanladıklarım` sorgusu kendiliğinden güncellenmez, çünkü TanStack Query hangi sorgunun hangi mutasyondan etkilendiğini bilmez. `onSuccess`'te `invalidateQueries({ queryKey: ratedKey })` çağırmak, o sorgunun cache'ini "bayat" işaretler ve query yeniden çekilir.

**Alternatif yaklaşım:** `invalidateQueries` yerine `onSuccess`'te `queryClient.setQueryData(ratedKey, ...)` ile listeye elle ekleme yapabilirsin (iyimser/anlık güncelleme); bu daha hızlı görünür ama sunucunun kabul ettiği son hâli garanti etmez, bu yüzden ekstra bir `invalidateQueries` ile doğrulaman gerekir.

**Tuzaklar:** `queryKey`'e `genreId`'yi eklemeyi unutup yalnızca `enabled`'ı değiştirmek yeterli değildir; `enabled` sorgunun ÇALIŞIP ÇALIŞMAYACAĞINI belirler, hangi cache hücresini kullanacağını değil. Guest session sorgusu (`['guest-session']`) `staleTime: Infinity` almazsa gereksiz yere tekrar istenebilir; oturum kimliği bir kez alınıp tüm bileşen ömrü boyunca aynı kalmalı.

**Köprü:** Bir sonraki modülde (Kitaplık, modül 22) aynı "her seçim kendi cache hücresini alsın" fikrini arama + sayfa parametreleriyle, farklı bir servise karşı tekrar kuracaksın.
