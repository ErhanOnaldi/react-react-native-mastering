## Neden böyle?

Paylaşılan listeyi hemen değiştirmek için cache patch’i gerekir. Snapshot hata dönüşünde geri alınır; `onSettled` sunucuyu son doğru kaynak yapar. Testte 500, `response.ok` kontrolünü de ölçer. Eşzamanlı mutation’larda tek snapshot diğer işlemi ezebilir; gerçek uygulamada kapsamı ve sıra politikasını belirle.
