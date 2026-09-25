---
title: Git ile güvenli çalışma
minutes: 8
---

# Git ile güvenli çalışma

:::pain[Problem]
Dün akşam her şey çalışıyordu. Bugün "küçük bir düzenleme" yaptın, şimdi hiçbir şey çalışmıyor. Neleri değiştirdiğini hatırlamıyorsun ve dünkü haline dönmenin yolu yok.
:::

Git, projenin **kayıt noktalarını** (commit) tutar. Her commit "şu an çalışan hali" demektir; istediğin an oraya dönebilir, iki nokta arasındaki farkı görebilirsin.

## Üç alan

```
Çalışma klasörü ──git add──▶ Hazırlık alanı (staging) ──git commit──▶ Geçmiş (repo)
```

```bash
git status                 # ne değişti, ne hazırlandı?
git diff                   # değişikliklerin satır satır farkı
git add projects/sinema    # bu klasördeki değişiklikleri hazırla
git commit -m "feat(sinema): başlığı env'den oku"
git log --oneline          # geçmiş
```

Bu repo zaten bir Git reposu. Her görevi bitirdiğinde küçük bir commit atmak iyi bir alışkanlık: bir şey bozulursa `git diff` son sağlam noktadan farkı gösterir, `git restore <dosya>` o dosyayı son commit'e geri alır.

## Dal (branch) ile çalışmak

Sektörde kimse doğrudan `main`'e yazmaz. Her iş kendi dalında yapılır:

```bash
git switch -c feat/film-arama   # yeni dal aç ve geç
# ... çalış, commit at ...
git switch main                 # ana dala dön
```

Takımda dal, bir **pull request (PR)** ile `main`'e birleştirilir: başka biri kodu inceler (code review), CI testleri çalıştırır, sonra birleştirilir.

## İyi commit

- **Küçük ve tek amaçlı**: "başlığı env'e taşı" ayrı, "buton rengini değiştir" ayrı commit.
- **Mesaj "ne ve neden"i anlatır**, "ne yaptım"ı değil: `güncelleme` ya da `düzeltmeler` hiçbir şey söylemez.

### Conventional Commits

Birçok takımın kullandığı ortak biçim:

```
<tür>(<kapsam>): <kısa açıklama>
```

| Tür | Ne zaman |
| --- | --- |
| `feat` | Yeni özellik |
| `fix` | Hata düzeltme |
| `refactor` | Davranışı değiştirmeden kodu iyileştirme |
| `test` | Test ekleme/düzeltme |
| `docs` | Dokümantasyon |
| `chore` | Bağımlılık, ayar gibi bakım işleri |
| `style` / `perf` / `build` / `ci` | Biçim, performans, build, CI |

Örnekler:

```
feat(sinema): film kartına puan rozeti ekle
fix(search): boş aramada istek atma
refactor(api): tmdb fetch kodunu tek fonksiyonda topla
feat(auth)!: oturum yapısını değiştir     ← "!" = kırıcı değişiklik
```

Bu disiplin sayesinde otomatik araçlar sürüm notlarını üretebilir ve `git log` okunur bir hikâyeye dönüşür.

:::mistake
`.env`, `node_modules/` ya da `dist/`'i commit'lemek. Hepsi `.gitignore`'da olmalı. Bir sırrı bir kez commit'lediysen, sonradan silmek yetmez: geçmişte durur. Tek güvenli çözüm anahtarı **iptal edip yenisini almak**tır.
:::

:::sector
Birçok şirkette commit mesajları otomatik kontrol edilir (commitlint) ve PR başlıkları da aynı biçimi izler. 8. modülde git hook'ları ile commit öncesi otomatik lint/format çalıştırmayı kuracağız.
:::
