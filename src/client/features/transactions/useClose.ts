import { useLocation, useNavigate } from 'react-router'

/** Back to the previous screen; opened directly (no history in this app) → Transactions/home instead of leaving the site. */
export function useClose(fallback = '/') {
  const navigate = useNavigate()
  const location = useLocation()
  return () => (location.key === 'default' ? navigate(fallback) : navigate(-1))
}
