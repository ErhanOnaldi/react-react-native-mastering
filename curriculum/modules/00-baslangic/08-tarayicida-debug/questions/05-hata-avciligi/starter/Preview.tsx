import { useState } from 'react'
import { calculateBookingTotal } from './ticketPricing'

export default function Preview() {
  const [ticketCount, setTicketCount] = useState<number>(2)
  const [discountPercent, setDiscountPercent] = useState<number>(20)
  const unitPrice = 100

  const total = calculateBookingTotal(ticketCount, unitPrice, discountPercent)
  const expectedCorrect = ticketCount > 0 ? (ticketCount * unitPrice) * (1 - discountPercent / 100) : 0

  return (
    <div className="p-6 max-w-md mx-auto bg-slate-900 text-slate-100 rounded-xl shadow-lg border border-slate-800 font-sans">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <h2 className="text-lg font-semibold text-amber-400">Sinema Bilet Kasası</h2>
        <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">Canlı Önizleme</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Birim Fiyat</label>
          <div className="text-xl font-mono font-medium">{unitPrice} ₺</div>
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-1">Bilet Sayısı</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTicketCount((c) => Math.max(0, c - 1))}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-lg font-bold"
            >
              -
            </button>
            <span className="font-mono text-lg w-8 text-center">{ticketCount}</span>
            <button
              type="button"
              onClick={() => setTicketCount((c) => c + 1)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-lg font-bold"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-1">İndirim Oranı</label>
          <div className="flex gap-2">
            {[0, 10, 20, 50].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => setDiscountPercent(rate)}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  discountPercent === rate
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                %{rate}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-400 text-sm">Hesaplanan Toplam:</span>
            <span className="text-2xl font-bold font-mono text-emerald-400">{total} ₺</span>
          </div>

          {total !== expectedCorrect && (
            <div className="mt-3 p-3 bg-rose-950/40 border border-rose-800/60 rounded text-xs text-rose-300 leading-relaxed">
              <strong>Hata Belirtisi:</strong> {ticketCount} bilet için beklenen tutar{' '}
              <span className="font-mono font-bold text-white">{expectedCorrect} ₺</span> iken kodunuz{' '}
              <span className="font-mono font-bold text-rose-400">{total} ₺</span> hesaplıyor!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
