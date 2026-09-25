import { defineQuestion } from '@rm/content/define'

export default defineQuestion({"type": "quiz", "title": "Promise içindeki tip", "difficulty": "kolay", "concepts": ["ts.async-types", "ts.return-parameters"], "question": "`async function load(): Promise<Movie[]>` için `Awaited<ReturnType<typeof load>>` nedir?", "options": [{"text": "`Movie[]`", "correct": true, "explanation": "Awaited Promise içindeki değeri çıkarır."}, {"text": "`Promise<Movie[]>`", "explanation": "Bu ReturnType sonucudur; Awaited bir katmanı açar."}, {"text": "`Movie`", "explanation": "Promise açılır, dizi açılmaz."}]})
