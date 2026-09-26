export default function App() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold">Atölye</h1>
      <p className="mt-4 text-lg">
        Burası bağımsız pratik alanın. Her mimari görev için kendi dosyalarını{' '}
        <code>src/&lt;gorev-slug&gt;/</code> klasöründe oluştur.
      </p>
      <p className="mt-4">
        Çalışmanı görmek için görev bileşenini buraya import edip render et veya
        uygulamana bir route ekle. Dosya sınırlarını ve yaklaşımı sen seç.
      </p>
    </main>
  )
}
