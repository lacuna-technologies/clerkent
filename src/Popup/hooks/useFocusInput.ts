import { useEffect, useRef } from 'react'

const useFocusInput = () => {
  const inputReference = useRef(null)

  useEffect(() => {
    if (inputReference.current) {
      inputReference.current.focus()
    }
  }, [])

  return inputReference
}

export default useFocusInput