import { Download, Upload } from 'lucide-react'
import { Button } from '../../ui/Button.tsx'
import { CategoryManager } from './CategoryManager.tsx'

export function SettingsPage() {
  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-headline-sm lg:text-headline">Settings</h1>

      <CategoryManager />

      <section className="rounded-card border border-border bg-surface p-4 shadow-card">
        <h2 className="text-title">Data</h2>
        <p className="mt-1 text-body-sm text-muted">Import from your Google Sheet or export everything as CSV. Coming in Phase 3.</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button variant="secondary" disabled>
            <Upload size={16} aria-hidden /> Import CSV
          </Button>
          <Button variant="secondary" disabled>
            <Download size={16} aria-hidden /> Export CSV
          </Button>
        </div>
      </section>

      <p className="text-center font-mono text-mono-label text-muted">Shompod v{__APP_VERSION__}</p>
    </div>
  )
}
