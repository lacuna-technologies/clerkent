import { useEffect, useRef } from 'preact/hooks'

const useFocusInput = () => {
  const inputReference = useRef(null)

  useEffect(() => {
    if (inputReference.current) {
      inputReference.current.focus()
    }
  }, [inputReference.current])

  return inputReference
}

export default useFocusInput