import { useEffect } from 'react'

interface LoadingSpinnerProps {
  color?: string;
}

export default function SpinnerLoadingAnimation({ color }: LoadingSpinnerProps) {
  useEffect(() => {
    async function getLoader() {
      const { ring2 } = await import('ldrs')
      ring2.register()
    }
    getLoader()
  }, [])

  return (
    <l-ring-2
      size="25"
      stroke="4"
      stroke-length="0.25"
      bg-opacity="0.1"
      speed="0.8" 
      color={color || "white"} 
    ></l-ring-2>
  )
}