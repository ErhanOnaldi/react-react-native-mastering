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
    'REQUIREMENTS.md’yi baştan sona oku ve her isim-fiil çiftini (“sorgu”, “sayfa”, “liste”, “puan”…) bir satır yap; sonra kategorisini sor.',
    'ADR yazmadan önce karar cümlesini tek satırda kur: “Okuma listesi … içinde tutulur ve … ile kalıcı hale getirilir.” Bağlam bu cümleyi neden kurduğunu, alternatifler neden başkasını kurmadığını anlatır.',
    'Bedelleri bulmak için kendine sor: “Bu karar hangi durumda yanlış olur?” (liste binlerce kayda çıkarsa, ikinci bir cihaz gerekirse, ekip büyürse…)',
  ],
})
