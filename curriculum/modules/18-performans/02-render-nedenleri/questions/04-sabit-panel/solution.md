## Neden böyle?
`SearchShell` içindeki state değiştiğinde parent yeniden çalışır. `ResultsPanel` aynı `onRender` prop'unu aldığı için `memo` bu alt bileşenin tekrar çalışmasını atlar. Gerçek film sonuçları arama sorgusuna bağlıysa onları bu sabit panel gibi memo ile kilitleme; yeni sorgu için yenilenmeleri gerekir.
