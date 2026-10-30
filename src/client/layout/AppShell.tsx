import { Outlet } from 'react-router'
import { Sidebar } from './Sidebar.tsx'
import { TabBar } from './TabBar.tsx'

export function AppShell() {
  return (
    <div className="min-h-dvh lg:flex">
      <Sidebar />
      {/* bottom padding keeps content clear of the mobile tab bar */}
      <main className="px-gutter mx-auto w-full max-w-5xl pt-6 pb-28 lg:pb-10">
        <Outlet />
      </main>
      <TabBar />
    </div>
  )
}
