# Atölye

Bu proje bağımsız mimari görevlerini denemen için. Her görevde çözümün dosya sınırlarını ve yaklaşımını sen belirlersin.

İlk kurulum için repo kökünde `pnpm setup:projects atolye` ve `pnpm install` çalıştır. Ardından `cd projects/atolye && pnpm dev` ile uygulamayı aç. Dev sunucusu 5175 portunu kullanır.

Her görev için `src/<task-slug>/` altında ayrı bir klasör oluştur. Örneğin görev klasörü `01-urun-listesi` ise dosyaların `src/01-urun-listesi/` altında yaşar. Sonucu görmek için görev bileşenini `src/App.tsx` içinde bağla veya router'a bir sayfa ekle.

Mimari görevlerde otomatik test yok. Görev sayfasındaki **“AI review prompt'unu kopyala”** düğmesiyle kendi dosyalarını ve değerlendirme ölçütlerini içeren istemi al; kodunu bu ölçütlerle gözden geçir.
