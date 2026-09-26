---
title: "Bağlama göre navigasyon"
minutes: 8
kind: concept
---

# Bağlama göre navigasyon

:::pain[Problem]
Detay ekranındaki "Kapat" düğmesi hep `/` adresine gidiyor. Kullanıcı aramadan geldiyse arama sonucunu kaybediyor. Menüdeki "Ana sayfa" da `/movie/550` üzerinde yanlışlıkla aktif görünüyor.
:::

## Bağlantı ile komutun farkı

Gezinme bazen kullanıcının seçtiği bir bağlantıdır, bazen başarılı bir işlemin sonucudur. Önceden bilinen hedefe giden UI için `Link` uygun semantiktir: kullanıcı adresi görebilir, kopyalayabilir veya yeni sekmede açabilir. İşlem bittikten sonra kodun yön değiştirmesi gerekiyorsa `useNavigate` devreye girer.

Rota ve parametrelerle adresleri kurdun; şimdi o adreslere nasıl gidileceğini seçiyorsun. Sinema'da menü bağlantısı ve form sonrası yönlendirme aynı görünse de kullanıcı beklentisi farklıdır. Bu ayrım erişilebilirlik ve tarayıcı davranışını da etkiler.

## Eylem ile bağlantıyı ayır

Gidilecek adres belli ve kullanıcı bunu bağlantı olarak görecekse `Link` kullan. Bir işlem tamamlandıktan sonra yön değiştireceksen `useNavigate()` çağır. `navigate(-1)` geçmişteki önceki kayda döner; doğrudan açılan detay sayfasında önceki kayıt olmayabileceğinden güvenli bir dönüş adresi de düşün.

```tsx title="src/components/MovieActions.tsx"
import { Link, NavLink, useNavigate } from 'react-router'

export function MovieActions() {
  const navigate = useNavigate()
  return <><NavLink to="/" end>Ana sayfa</NavLink><Link to="/search">Ara</Link><button onClick={() => navigate(-1)}>Aramaya dön</button></>
}
```

Alt rotada `to=".."` **route hiyerarşisine göre** üst rotaya gider: kök layout altındaki `movie/:id` sayfasından `/` adresine. `to="/search"` ise her zaman kökten başlar. Bunu bilinçli seç. Doğrudan açılan detayda `navigate(-1)` için önceki uygulama sayfası olmayabilir; o durumda güvenli bir `/search` bağlantısı sun. `NavLink` aktifliği CSS veya `aria-current="page"` üzerinden gösterilebilir; aktif durumu kendisi hesaplar.

:::mistake[Sık hata]
Tıklanabilir her şeyi buton yapıp `navigate` çağırma. Adresi belli gezinme için `Link` klavye, yeni sekme ve bağlantıyı kopyalama davranışını doğal olarak sağlar.
:::

:::sector
Uygulama içi navigasyonda `Link`, işlem sonucunda koşullu yönlendirmede `useNavigate` kod niyetini okunur kılar.
:::
