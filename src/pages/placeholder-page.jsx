import { AppLayout } from '@/components/ui/app-layout'

export default function PlaceholderPage({ title,
  description,
 }) {
  return (
    <AppLayout>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </AppLayout>
  )
}
