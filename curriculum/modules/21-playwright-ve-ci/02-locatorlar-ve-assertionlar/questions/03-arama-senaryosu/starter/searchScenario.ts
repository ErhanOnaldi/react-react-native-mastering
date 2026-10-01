import type { Page } from '@playwright/test'

/**
 * Arama senaryosu: kullanıcı önce “matrix” arar, sonra fikrini değiştirip “başlangıç” arar.
 * Sabit bekleme (waitForTimeout) kullanma; beklemeyi web-first assertion’lara bırak.
 */
export async function searchScenario(page: Page): Promise<void> {}
