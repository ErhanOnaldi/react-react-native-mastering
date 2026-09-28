import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Görünüm seçici etiketi',
  difficulty: 'kolay',
  concepts: ['ts.literal', 'ts.union'],
  files: ['viewLabel.ts'],
  hints: [
    'Görünüm modunu genel bir `string` yerine iki sabit seçenekle sınırlamayı düşün.',
    '`"grid" | "list"` literal union tipini oluşturup koşullu ifade ile ilgili etiketi döndür.',
    'İskelet: `export type ViewMode = "grid" | "list"; export function viewLabel(mode: ViewMode): string { return mode === "grid" ? "Kartlar" : "Liste"; }`',
    '`ViewMode` tipini genel `string` olarak bırakırsan testlerdeki tip kısıtı kontrolünden geçemezsin.',
  ],
})
