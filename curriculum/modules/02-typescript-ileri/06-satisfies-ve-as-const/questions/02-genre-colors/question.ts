import { defineQuestion } from '@rm/content/define'

export default defineQuestion({"type": "code", "title": "Tür renkleri config’i", "difficulty": "orta", "concepts": ["ts.satisfies", "ts.as-const", "ts.record"], "files": ["task.ts"], "hints": ["GenreId için `(typeof GENRE_IDS)[number]` kullan.", "as const değerleri korur; satisfies eksik anahtarı yakalar.", "colorFor içinde tabloyu ID ile indeksle."]})
