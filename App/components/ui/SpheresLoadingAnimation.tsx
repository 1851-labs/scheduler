import { useEffect } from 'react'

export default function SpheresLoadingAnimation() {
    useEffect(() => {
      async function getLoader() {
        const { quantum } = await import('ldrs')
        quantum.register()
      }
      getLoader()
    }, [])
    return (<l-quantum
        size="125"
        speed="1.75" 
        color="black" 
    ></l-quantum>)
  }
  