import { createContext, useContext } from 'react'

const HealthContext = createContext(null)

export function useHealth() {
  const context = useContext(HealthContext)

  if (!context) {
    throw new Error('useHealth must be used inside HealthProvider')
  }

  return context
}

export default HealthContext