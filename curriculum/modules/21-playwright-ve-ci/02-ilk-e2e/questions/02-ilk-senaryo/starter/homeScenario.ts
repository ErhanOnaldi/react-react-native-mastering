import { expect, type Page } from '@playwright/test'

/**
 * Ana sayfa senaryosu: kullanıcı Sinema'yı açar ve trend filmleri görür.
 * Test altyapısı `page`'i hazırlar (baseURL = https://sinema.test); sen yalnız adımları yaz.
 */
export async function homeScenario(page: Page): Promise<void> {
  // 1. Ana sayfayı aç (baseURL sayesinde '/' yeterli)
  // 2. "Sinema" başlığını (h1) doğrula
  // 3. "Bu haftanın trend filmleri" başlığını doğrula
  // 4. Listede "Dövüş Kulübü" filminin göründüğünü doğrula
}
