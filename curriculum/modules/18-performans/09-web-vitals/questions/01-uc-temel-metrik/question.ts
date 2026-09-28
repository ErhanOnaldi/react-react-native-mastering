import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Üç temel metrik ve eşikleri',
  difficulty: 'kolay',
  concepts: ['perf.web-vitals'],
  question: `Core Web Vitals, kullanıcı deneyimini yükleme hızı, etkileşim tepkisi ve görsel kararlılık olmak üzere üç temel boyutta ölçer.

Aşağıdaki metrik-eşik eşleştirmelerinden hangisi Google standartlarına göre **"iyi" (good)** kabul edilen sınırları ve ölçülen kullanıcı deneyimini **eksiksiz ve doğru** ifade eder?`,
  mode: 'single',
  options: [
    {
      text: 'LCP ≤ 2,5 sn (en büyük içeriğin boyanması), INP ≤ 200 ms (etkileşimden sonraki kareye kadar geçen süre), CLS ≤ 0,1 (beklenmeyen yerleşim kayması puanı)',
      correct: true,
      explanation:
        'Doğru. Web Vitals standartlarında LCP için 2,5 saniye ve altı, INP için 200 milisaniye ve altı, CLS için ise 0,1 ve altı "iyi" kullanıcı deneyimi barajıdır.',
    },
    {
      text: 'LCP ≤ 1,0 sn (ilk baytın ulaşma süresi), INP ≤ 50 ms (JavaScript indirme süresi), CLS ≤ 0,5 (kayan piksel sayısı)',
      correct: false,
      explanation:
        "Yanlış. İlk baytın ulaşması TTFB (Time to First Byte) metriğidir; LCP ise en büyük içerik öğesinin boyanma anıdır ve eşiği 2,5 saniyedir. CLS bir piksel sayısı değil, görünür alan oranlarına dayalı birimsiz bir kayma puanıdır ve eşiği 0,1'dir.",
    },
    {
      text: 'FID ≤ 100 ms (ilk tıklama gecikmesi), FCP ≤ 1,8 sn (ilk boyama), TBT ≤ 300 ms (toplam bloklanma süresi)',
      correct: false,
      explanation:
        "Yanlış. FID (First Input Delay) Mart 2024 itibarıyla Core Web Vitals kapsamından çıkarılmış ve yerini sayfa ömründeki tüm etkileşimleri kapsayan INP'ye (Interaction to Next Paint) bırakmıştır. FCP ve TBT ise Core Web Vitals üçlüsünün parçası değil, teşhis amaçlı yardımcı metriklerdir.",
    },
    {
      text: 'LCP ≤ 4,0 sn (sayfanın tamamen yüklenmesi), INP ≤ 500 ms (ağ bekleme süresi), CLS ≤ 0,25 (kayan bileşen adedi)',
      correct: false,
      explanation:
        'Yanlış. 4,0 saniye LCP için "geliştirilmeli" ile "kötü" arasındaki sınırdır; iyi eşiği 2,5 saniyedir. INP ağ beklemesini değil, ana iş parçacığı (main thread) gecikmesi ve boyama süresini ölçer ve iyi eşiği 200 ms\'dir.',
    },
  ],
  explanation: `Core Web Vitals üçlüsü kullanıcının hissettiği üç farklı aşamayı hedefler:
1. **LCP (Largest Contentful Paint)**: Sayfa yüklenirken ana içeriğin (büyük başlık veya hero görseli) ekrana gelme süresidir (hedef: ≤ 2,5 sn).
2. **INP (Interaction to Next Paint)**: Kullanıcı sayfadaki bir düğmeye bastığında, yazdığında veya tıkladığında tarayıcının sonraki kareyi boyamasına kadar geçen etkileşim gecikmesidir (hedef: ≤ 200 ms).
3. **CLS (Cumulative Layout Shift)**: Sayfa yüklenirken veya kullanılırken öğelerin beklenmedik biçimde yer değiştirip kullanıcıyı yanıltma derecesidir (hedef: ≤ 0,1).`,
})
