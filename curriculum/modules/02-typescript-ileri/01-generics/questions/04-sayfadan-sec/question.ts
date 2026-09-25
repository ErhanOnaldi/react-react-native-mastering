import { defineQuestion } from '@rm/content/define'

export default defineQuestion({"type": "code", "title": "Sayfadan ID ile seç", "difficulty": "orta", "concepts": ["ts.generics", "ts.generic-constraints", "ts.api-types"], "files": ["task.ts"], "hints": ["Aramayı `page.results` içinde yap.", "Generic kısıt sayesinde her öğenin `id` alanı vardır.", "`find` bulunmayan ID için kendiliğinden `undefined` verir."]})
