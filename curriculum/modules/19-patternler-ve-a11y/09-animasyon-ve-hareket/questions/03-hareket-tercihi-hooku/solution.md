## Neden böyle?

`matchMedia` hem ilk tercihi hem de sonraki değişimleri verir. İlk değer state initializer'ında okunur; `change` dinleyicisi ayar sonradan değişirse yeni değeri yazar. Effect cleanup'ı bileşen kaldırılınca aynı callback'i kaldırır.

CSS'teki `motion-reduce:` çoğu görünüm tercihi için daha basittir. Hook, davranış veya React ağacının tercihe göre değişmesi gerektiğinde kullanışlıdır. Sunucu render'ı olan bir uygulamada `window` erişimi için ayrı bir istemci sınırı gerekir; bu egzersiz tarayıcıda çalışan hook'u ele alır.
