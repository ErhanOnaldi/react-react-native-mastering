## Neden böyle?

Anlık geri bildirim kullanıcıyı bekletmez, ama geçici değişiklik sunucu hatasında geri alınmalıdır. Önceki listeyi saklamak geri dönüşü sağlar; işlem bitince ilişkili listeyi tazelemek başka ekrandaki eski sonucu giderir.

Alternatif olarak geçici puanı yalnız bekleyen işlem değişkenlerinden gösterebilir, hata halinde değişkeni kaldırıp son sunucu listesini yeniden alabilirsin. Hata sonrası yalnız butondaki rakamı düzeltip listeyi bırakmak iki ayrı doğru kaynak yaratır. Daha sonraki modüllerde form ve oturum durumları bu akışa katılacak.
