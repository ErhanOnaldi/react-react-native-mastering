---
title: Sinema UI kit’ini kur
minutes: 9
kind: project
---

# Sinema UI kit’ini kur

:::pain[Problem]
Platform örnekleri çalışıyor ama Sinema MovieCard'ı hâlâ kopyalanmış düğme class'larını taşıyor. Arama ve favori akışını bozmadan ortak parçaları gerçek projeye geçirmek gerekiyor.
:::

## İki adım

Önce `src/lib/cn.ts`, `src/components/ui/` ve `src/index.css` içinde ortak kit'i kur. Sonra MovieCard'ı bu parçalarla düzenle. `Button` primary/secondary/ghost ve sm/md/lg kombinasyonlarını önizlemede yan yana gör; `Input` aramada, `Badge` puanda, `Card` çerçevede kullanılır. `Skeleton` için şimdilik örnek yükleme görünümü yeterli; gerçek yükleme state'i sonraki modülde.

## Bitiş kontrolü

MovieCard'ın favori düğmesi hâlâ tıklanmalı, erişilebilir adı ve basılı durumu anlaşılmalı. Arama filtresi ve favori state'i App'te kalmalı. Bir sonraki modülde veri çekmeye geçerken bu UI kit aynı kalabilir.

