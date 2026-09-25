## Neden böyle?
Tek akışta etkileşim, asenkron ekran ve MSW birleşir. Başarı handler’ındaki kısa gecikme loading durumunu gözlenebilir kılar; aksi halde hızlı yanıt test assertion’ından önce bitebilir. İstek günlüğü query parametresini doğrular; DOM assertion’ları kullanıcının gördüğünü korur. Mutantlar boş ve hata durumunu ayrı ayrı bozar.
