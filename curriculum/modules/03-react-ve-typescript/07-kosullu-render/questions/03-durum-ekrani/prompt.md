Önceki modülün `RemoteData<T>` union’ını bu kez JSX’te kullan. Bu görevdeki dört durum: `{status:'idle'}`, `{status:'loading'}`, `{status:'error', message:string}`, `{status:'success', data:{id:number,title:string}[]}`. `RemoteView({ state })` idle → “Arama yap”, loading → “Yükleniyor”, error → `role="alert"` içinde mesaj, success → film başlıkları listesi; boş success → “Film bulunamadı” göstersin. Fetch yazma; durumlar props olarak geliyor.

**Örnek:** `{ status: "error", message: "Bağlantı yok" }` → alert içinde “Bağlantı yok”.
