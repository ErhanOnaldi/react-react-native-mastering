import { defineQuestion } from '@rm/content/define'

export default defineQuestion({"type": "code", "title": "Tipli alan seçici", "difficulty": "orta", "concepts": ["ts.keyof-typeof", "ts.indexed-access", "ts.generics"], "files": ["task.ts"], "hints": ["K, T’nin anahtarlarıyla sınırlanmalı.", "Dönüş tipinde indeksli erişim `T[K]` kullan.", "Gövde yalnız `value[key]` döndürür."]})
