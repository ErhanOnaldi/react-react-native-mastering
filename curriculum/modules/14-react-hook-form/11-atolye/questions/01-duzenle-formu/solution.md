## Neden böyle?

`useForm`'un `defaultValues`'ı yalnızca ilk render'da uygulanır; `list` değiştiğinde formu yeni kayda göre kurmak gerekir. `key={list.id}` ile form bileşeni yeni kayıt için yeniden kurulur ve `isDirty` temiz başlar. Başarılı kayıttan sonra `reset(values)` çağırmak, aynı listede kalırken “kaydedilmemiş değişiklik” işaretini de sıfırlar.

Bu yaklaşım formun kendi local state'ini (ör. odaklanma) da sıfırlar; kaydı değiştirirken zaten yeni bir düzenleme bağlamına geçiyorsun. `isDirty` kontrolü olmadan her tıklamada `onSave` çağırmak, kullanıcı hiçbir şey değiştirmese bile gereksiz bir kayıt isteği üretir. Sonraki görevde bu formun sunucuya gönderim tarafını, hatadan sonra veri kaybetmeyecek şekilde ele alacaksın.
