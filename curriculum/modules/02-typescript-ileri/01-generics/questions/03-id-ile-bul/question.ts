import { defineQuestion } from '@rm/content/define'

export default defineQuestion({"type": "code", "title": "ID kısıtlı arama", "difficulty": "orta", "concepts": ["ts.generics", "ts.generic-constraints", "js.array-methods"], "files": ["task.ts"], "hints": ["Her `T` için `id` olduğunu `extends` ile belirt.", "`find` callback’inde `item.id === id` karşılaştır.", "Dönüş `T | undefined` olmalı; nesneyi yeniden kurma."]})
