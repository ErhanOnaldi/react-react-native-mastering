## Neden böyle?

`useForm`'un `defaultValues`'ı yalnızca ilk render'da uygulanır; `list` değiştiğinde formu haberdar etmek gerekir. `list.id`'ye bağlı bir `useEffect` içinde `reset(...)` çağırmak, formu yeni kaydın değerlerine döndürür ve `isDirty`'yi de temizler. Başarılı kayıttan sonra `reset(values)` çağırmak, aynı listede kalırken "kaydedilmemiş değişiklik" işaretini de sıfırlar.

Alternatif olarak formu `key={list.id}` ile tamamen yeniden mount edebilirsin; bu da her liste için sıfırdan bir `useForm` örneği yaratır ve aynı sonucu verir, ama formun kendi local state'i (ör. odaklanma) sıfırlanır. `isDirty` kontrolü olmadan her tıklamada `onSave` çağırmak, kullanıcı hiçbir şey değiştirmese bile gereksiz bir kayıt isteği üretir. Sonraki görevde bu formun sunucuya gönderim tarafını, hatadan sonra veri kaybetmeyecek şekilde ele alacaksın.
