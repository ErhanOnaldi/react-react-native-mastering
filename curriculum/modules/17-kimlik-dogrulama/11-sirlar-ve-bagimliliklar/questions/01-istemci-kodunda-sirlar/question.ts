import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'İstemci kodunda sır sınırı',
  difficulty: 'kolay',
  concepts: ['security.secrets'],
  question:
    'Vite ile geliştirilen bir SPA projesinde `.env` dosyasındaki `VITE_` önekli değişkenlerle ilgili doğru ifade hangisidir?',
  options: [
    {
      text: 'Build anında JavaScript dosyalarının içine düz metin olarak gömülür; uygulamayı tarayıcıda açan herkes bu değerleri görebilir.',
      correct: true,
      explanation:
        'Vite, `VITE_` önekli değişkenleri build sırasında koddaki `import.meta.env.*` yerlerine sabit değer olarak yazar. Bu yüzden veritabanı parolası veya özel API sırrı gibi gizli bilgiler asla `VITE_` değişkeni yapılmamalıdır.',
    },
    {
      text: 'Tarayıcıda şifrelenmiş olarak saklanır ve yalnızca backend ile paylaşılan bir anahtarla çözülür.',
      correct: false,
      explanation:
        'İstemci tarafında çalışan kodda gerçek bir sır saklanamaz. Tarayıcıya inen JavaScript herkese açıktır; şifreleme anahtarı da kodda olacağından güvenlik sağlamaz.',
    },
    {
      text: 'Yalnızca `vite dev` çalışırken görünür; `vite build` üretim paketinden bu değişkenleri otomatik olarak siler.',
      correct: false,
      explanation:
        'Tam tersine, `vite build` bu değişkenleri çözüp üretim bundle dosyalarının içine statik olarak yerleştirir.',
    },
  ],
})
