import { expect, type Page } from '@playwright/test'

/**
 * Arama senaryosu: kullanıcı önce “matrix” arar, sonra fikrini değiştirip “başlangıç” arar.
 * Sabit bekleme (waitForTimeout) kullanma; beklemeyi web-first assertion’lara bırak.
 */
export async function searchScenario(page: Page): Promise<void> {
  // 1. /search sayfasını aç
  // 2. "Film ara" kutusuna "matrix" yaz → 2 sonuç
  // 3. Kutuya "başlangıç" yaz → URL, sonuç, sonuç sayısı, yükleniyor yazısı
}
