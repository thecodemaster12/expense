import { Outlet } from 'react-router'
import { TopBar } from './TopBar.tsx'
import { Sidebar } from './Sidebar.tsx'
import { TabBar } from './TabBar.tsx'

export function AppShell() {
  return (
    <div className="min-h-dvh lg:pl-60">
      <Sidebar />
      <TopBar />
      {/* bottom padding keeps content clear of the mobile tab bar */}
      <main className="px-gutter mx-auto w-full max-w-5xl pt-5 pb-28 lg:pb-10">
        <Outlet />
      </main>
      <TabBar />
    </div>
  )
}
