## Neden böyle?
Açıkça başlattığın state güncellemesini transition'a almak, acil kullanıcı etkileşimlerine öncelik verir. `isPending` durumunu erişilebilir `role="status"` içinde göstermek belirsiz beklemeyi azaltır. Çok küçük sekmelerde fark ölçülmez; gerçek büyük listede Profiler ile bak.
