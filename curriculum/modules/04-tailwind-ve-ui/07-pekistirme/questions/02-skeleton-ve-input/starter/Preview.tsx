import { Input, Skeleton } from './LoadingFields'
export default function Preview() {
  return (
    <div className="space-y-3 p-4">
      <Input aria-label="Film ara" placeholder="Film adı" />
      <Skeleton className="h-24 w-48" />
    </div>
  )
}
