import { useRef, type MouseEvent } from 'react'

/**
 * Press-and-hold (touch or mouse) or right-click calls `onLongPress`.
 * `wasLongPress()` tells the following click to do nothing.
 */
export function useLongPress(onLongPress: () => void, ms = 500) {
  const timer = useRef<number | undefined>(undefined)
  const fired = useRef(false)
  const cancel = () => clearTimeout(timer.current)
  const fire = () => {
    fired.current = true
    onLongPress()
  }

  return {
    handlers: {
      onPointerDown: () => {
        fired.current = false
        timer.current = window.setTimeout(fire, ms)
      },
      onPointerUp: cancel,
      onPointerLeave: cancel,
      onPointerCancel: cancel, // finger started scrolling
      onContextMenu: (e: MouseEvent) => {
        e.preventDefault()
        cancel()
        if (!fired.current) fire() // Android fires contextmenu on long-press too
      },
    },
    wasLongPress: () => {
      const was = fired.current
      fired.current = false
      return was
    },
  }
}
