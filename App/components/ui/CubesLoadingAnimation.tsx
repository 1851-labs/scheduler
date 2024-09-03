import { useEffect } from 'react'

export default function CubesLoadingAnimation() {
    useEffect(() => {
      async function getLoader() {
        const { bouncy } = await import('ldrs')
        bouncy.register()
      }
      getLoader()
    }, [])
    return (<l-bouncy
        size="125"
        speed="1.75" 
        color="black" 
    ></l-bouncy>)
  }
  