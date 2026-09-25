---
title: Platformu tanı
minutes: 6
---

# Platformu tanı

Bu platformda React'i **sektörde kullanıldığı gibi** öğreneceksin: gerçek araçlarla, gerçek testlerle ve modül modül büyüyen gerçek bir uygulamayla (**Sinema**).

## Nasıl öğreneceğiz?

Her yeni araç bir **ihtiyaçtan** doğduğu anda gelecek. Sıra hep aynı:

1. Bildiğin yöntemle çözersin.
2. Yöntemin nerede zorlandığını **kendi gözünle** görürsün (test mesajı, istek sayacı, yavaşlayan bir ekran…).
3. O sorunu çözen aracı öğrenirsin.
4. Aracı farklı bağlamlarda tekrar tekrar kullanıp alışkanlığa çevirirsin — her tekrarda küçük bir yenilikle.

:::pain[Örnek]
İleride filmleri `useEffect` ile çekeceksin. Sayfalar arasında gidip geldikçe aynı isteğin tekrar tekrar atıldığını, her sayfada aynı "yükleniyor/hata" kodunu yazdığını fark edeceksin. İşte o an **TanStack Query** sahneye çıkacak.
:::

## Üç soru tipi

| Tip | Nerede | Ne yaparsın |
| --- | --- | --- |
| **Quiz** | Platformda | Seçeneği işaretlersin; her şıkkın neden doğru/yanlış olduğu açıklanır. |
| **Kod** | Platformdaki editör | Kodu yazarsın, **Çalıştır**'a basarsın; arka planda gerçek Vitest testleri ve TypeScript kontrolü çalışır. |
| **Proje** | VS Code | `projects/sinema` içinde çalışırsın; testleri platformdan ya da terminalden çalıştırırsın. |

Kod görevlerinde yazdıkların otomatik kaydedilir (`workspace/` klasörüne). Aynı dosyayı VS Code'da açıp düzenlersen platformdaki editör de güncellenir.

## Testler = gereksinim listesi

Editörün üstünde, mor ikonlu bir **test dosyası** sekmesi göreceksin. Görevin tam olarak ne istediğini en kesin o dosya anlatır. Test adları Türkçe ve açıklayıcıdır:

```ts title="formatVote.test.ts"
it('0 oyda "Henüz oy yok" döner', () => {
  expect(formatVote(0)).toBe('Henüz oy yok')
})
```

Bir test kaldığında sonuç panelinde **beklenen** ve **gelen** değeri görürsün. Bu mesajları okumayı alışkanlık edin — sektörde en çok yapacağın şeylerden biri budur.

:::info[Tip kontrolü de testin parçası]
Testler geçse bile kodunda bir **TypeScript hatası** varsa görev tamamlanmış sayılmaz. Sektörde de tip hatası olan kod birleştirilmez (merge edilmez).
:::

## İpucu, çözüm ve dürüstlük

- **İpuçları** kademelidir: istedikçe bir sonrakini açarsın.
- **Çözüm** sekmesi, görevi geçtiğinde "neden böyle?" notlarıyla birlikte açılır. Daha önce bakmak istersen bakabilirsin, ama ilerlemende işaretlenir — kendine karşı dürüst istatistik.
- Bazı görevlerde **AI review prompt'unu kopyala** butonu var. Görev metnini, değerlendirme kriterlerini ve kodunu hazır bir prompt'a dönüştürür; Claude, ChatGPT gibi istediğin bir araca yapıştırıp kıdemli bir geliştiriciden geri bildirim alır gibi kullanırsın.

## Kısayollar ve terminal

- **⌘ + Enter** (Windows'ta **Ctrl + Enter**): testleri çalıştır.
- VS Code'da çalışırken aynı testleri terminalden çalıştırabilirsin:

```bash
pnpm check 0.1.2          # tek sefer
pnpm check 0.1.2 --watch  # dosya değiştikçe otomatik
```

:::sector
"Önce testi oku, sonra kodu yaz" alışkanlığı sektörde **TDD** (Test-Driven Development) adını alır. Burada testler hazır geliyor; ileride (10. modülden itibaren) testleri de sen yazacaksın.
:::
