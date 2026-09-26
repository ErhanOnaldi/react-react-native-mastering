## Neden böyle?

Her sorgu için effect ayrı bir çalışma başlatır. Sonraki sorguya geçildiğinde önceki çalışmanın cleanup'ı onun cevabını ekrana yazmasını engeller. Böylece ağ cevaplarının sırası ile kullanıcının son tercihi karışmaz. İstek sayısı hâlâ iki olabilir; doğru sonuç yalnızca son sorgudan gelir.

Alternatif olarak her çalışma için `AbortController` kullanıp önceki isteği iptal edebilirsin; `AbortError` normal bir iptal olarak ele alınmalı. Yalnızca effect bağımlılığına sorguyu eklemek, eski cevabın geç gelmesini engellemez. Modül 6'da sorgu input yerine URL'den geldiğinde de aynı yarış yaşanabilir.
