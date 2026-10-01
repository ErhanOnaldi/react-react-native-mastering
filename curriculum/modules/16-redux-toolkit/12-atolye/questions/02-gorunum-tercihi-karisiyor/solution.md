## Neden böyle?

Bu örnekte görünüm ve favoriler tek ekrana ait. Redux kurulumu eklemek paylaşım ihtiyacı olmadığı halde yeni bir state sahibi yaratır; yerel state yeterlidir.

İki hata da aynı kökten geliyor: birbirine ait olmayan state'ler tek bir nesnede yaşıyordu. Görünüm tercihi saf bir **client state**'tir ve sunucu verisiyle hiçbir ilişkisi yoktur; aynı state güncellemesinin parçası olunca görünüm değişimi yanlışlıkla listeyi de sıfırlıyordu. Favoriler de client state'tir ama filmin **kimliğine** bağlıdır; diziye konuma göre (`index`) yazılınca yeni bir tür geldiğinde aynı konumdaki farklı film o eski işareti "miras alıyor", ya da dizi yeniden oluşturulunca işaret tamamen kayboluyordu.

Favoriler başka ekranlarda da kullanılmaya başlarsa ortak store gerekebilir. Sonraki görevde bu kez URL ile cache'in aynı ekranda birbirini nasıl tamamladığını kuracaksın.
