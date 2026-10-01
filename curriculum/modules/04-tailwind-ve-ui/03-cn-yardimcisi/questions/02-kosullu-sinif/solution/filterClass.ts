import clsx from 'clsx'
export function filterClass(active: boolean, compact: boolean): string {
  return clsx(
    'rounded-lg',
    active ? 'bg-sky-700 text-white' : 'bg-slate-100 text-slate-900',
    compact ? 'px-2 py-1' : 'px-4 py-2',
  )
}
