import { defineQuestion } from '@rm/content/define'

export default defineQuestion({"type": "code", "title": "Yeni durum unutulmasın", "difficulty": "orta", "concepts": ["ts.exhaustive-check", "ts.discriminated-union", "ts.narrowing"], "files": ["task.ts"], "hints": ["status üzerinden switch aç.", "Başarı dalında show(state.data) çağır.", "default içinde `const exhaustive: never = state` kullan."]})
