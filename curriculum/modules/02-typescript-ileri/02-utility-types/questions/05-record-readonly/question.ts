import { defineQuestion } from '@rm/content/define'

export default defineQuestion({"type": "code", "title": "Tür adlarını güvenli tut", "difficulty": "orta", "concepts": ["ts.record", "ts.readonly", "ts.keyof-typeof"], "files": ["task.ts"], "hints": ["Record her GenreId için bir değer ister.", "Readonly tabloyu sonradan yeniden atamaya kapatır.", "`GENRE_NAMES[id]` güvenli erişim sağlar."]})
