// İçerik yazarken tip güvenliği ve otomatik tamamlama sağlayan kimlik fonksiyonları.
// Çalışma zamanında hiçbir şey yapmazlar; doğrulama yükleyicide (loader) Zod ile yapılır.
import type { ConceptRegistryInput, ModuleMetaInput, QuestionMetaInput } from './schema.ts'

export function defineModule(meta: ModuleMetaInput): ModuleMetaInput {
  return meta
}

export function defineQuestion<const T extends QuestionMetaInput>(meta: T): T {
  return meta
}

export function defineConcepts<const T extends ConceptRegistryInput>(concepts: T): T {
  return concepts
}
