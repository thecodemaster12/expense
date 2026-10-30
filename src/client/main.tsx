import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import './index.css'
import { AccountsPage } from './features/accounts/AccountsPage.tsx'
import { DashboardPage } from './features/dashboard/DashboardPage.tsx'
import { SettingsPage } from './features/settings/SettingsPage.tsx'
import { AddPage } from './features/transactions/AddPage.tsx'
import { TransactionsPage } from './features/transactions/TransactionsPage.tsx'
import { AppShell } from './layout/AppShell.tsx'
import { ToastProvider } from './ui/ToastProvider.tsx'

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/transactions', element: <TransactionsPage /> },
      { path: '/accounts', element: <AccountsPage /> },
      { path: '/settings', element: <SettingsPage /> },
      { path: '/add', element: <AddPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

// No polling: free-tier limits (docs/architecture.md). Data refreshes after our own writes.
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, staleTime: 60_000 } },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </QueryClientProvider>
  </StrictMode>,
)
