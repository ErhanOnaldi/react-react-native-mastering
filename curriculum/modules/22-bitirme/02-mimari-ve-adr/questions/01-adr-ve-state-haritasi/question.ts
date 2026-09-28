import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'State haritası ve ilk ADR’ler',
  difficulty: 'orta',
  concepts: [
    'capstone.state-map',
    'arch.adr',
    'arch.state-categories',
    'redux.server-vs-client',
    'arch.feature-folders',
    'react.derived-state',
  ],
  project: 'kitaplik',
  focusFiles: ['REQUIREMENTS.md', 'docs/state-map.md'],
  reviewFiles: ['docs/state-map.md', 'docs/adr/*.md', 'REQUIREMENTS.md'],
  rubric: [
    'State haritası gereksinimlerdeki tüm bilgileri kapsıyor mu (q, page, status filtresi, eser id’si, arama sonuçları, eser, yazar, okuma listesi, form alanları, liste sayısı, yükleniyor/hata)?',
    'Her bilginin kategorisi (sunucu / istemci / URL / form / türetilmiş) doğru ve tek bir sahibi var mı? Aynı bilgi iki yerde tutulmuyor mu?',
    'Türetilmiş değerler (liste sayısı, toplam sayfa, yükleniyor/hata, kapak adresi) saklanmıyor, hesaplanıyor olarak işaretlenmiş mi?',
    'En az iki ADR var mı: sunucu verisinin yönetimi ve okuma listesinin nerede/nasıl saklanacağı? Numaralı dosya adları (0001-…) kullanılmış mı?',
    'Her ADR’de Durum, Bağlam, Karar, Değerlendirilen alternatifler ve Sonuçlar bölümleri var mı? Bağlam gereksinimlere (K-n) ve somut ölçeğe dayanıyor mu?',
    'Her ADR en az iki gerçek alternatifi neden seçmediğini anlatıyor mu? Sonuçlar bölümünde bedeller (⚠️) ve “ne olursa yeniden düşünürüz” koşulu dürüstçe yazılmış mı?',
    'Okuma listesi ADR’si localStorage’dan okunan verinin doğrulanmasını (bozuk kayıt, eski biçim) ele alıyor mu?',
    'Klasör yapısı kararı (ADR ya da state haritasında kısa bir bölüm) feature bazlı ayrımı ve gerekçesini anlatıyor mu?',
  ],
  hints: [
    'REQUIREMENTS.md belgesini tara; arayüzde görünen veya saklanan her bilgi parçasını listele ve “Bunun tek sahibi kim?” sorusunu sor.',
    'Bilgileri 5 kategoriye ayır: Sunucu (API önbelleği), URL (arama/sayfa parametreleri), İstemci (yerel kalıcı liste), Form (gönderilene dek geçici taslak) ve Türetilmiş (hesaplanan değerler).',
    'ADR şablonu: Durum → Bağlam (K-n referansı) → Karar (tek net cümle) → Değerlendirilen alternatifler (en az 2) → Sonuçlar (artılar ve bedeller).',
    'Türetilmiş değerleri (örneğin listedeki eleman sayısını) ayrı bir state olarak saklama; tek sahibinden hesapla. ADR’de yalnızca artıları değil, kararın getirdiği teknik bedelleri (⚠️) de açıkça belirt.',
  ],
})
