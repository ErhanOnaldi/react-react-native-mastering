import { defineQuestion } from '@rm/content/define'

export default defineQuestion({"type": "code", "title": "Dört istek durumunu modelle", "difficulty": "orta", "concepts": ["ts.discriminated-union", "ts.generics", "ts.narrowing"], "files": ["task.ts"], "hints": ["Her durum için ayrı nesne tipiyle union kur.", "isSuccess, status alanını karşılaştırır.", "message için switch ile dört dalı ele al."]})
