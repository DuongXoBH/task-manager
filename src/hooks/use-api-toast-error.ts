import { useEffect } from 'react'
import { toast } from 'react-toastify'

export const useApiToastError = (isError: boolean, message: string) => {
  useEffect(() => {
    if (isError) {
      toast.error(message)
    }
  }, [isError])
}
