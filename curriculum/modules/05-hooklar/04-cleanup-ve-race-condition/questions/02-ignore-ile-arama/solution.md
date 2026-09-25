Cleanup önceki sorgunun yazma hakkını kaldırır. İsteği iptal etmese bile yanlış ekranı engeller. Yeni bir dış sistem parametresi geldiğinde eski senkronizasyon bitmiş sayılır. Sonraki görevde ağ isteğinin kendisini de iptal edeceksin.

## Alternatif ve tuzak

Sadece `[query]` yazmak önceki Promise’i iptal etmez. Bayrak her effect çalışmasının closure’ında ayrı olmalı.

## Sektörde ve sonra

Bir sonraki görev ağ işini de `AbortController` ile iptal eder.
