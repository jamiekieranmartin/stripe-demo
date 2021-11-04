import React, { useEffect, createContext } from 'react'
import { useToasts, } from '@geist-ui/react'
import { AlertCircle } from '@geist-ui/react-icons'
import { useRouter } from 'next/router'

export const ErrorContext = createContext<unknown>(undefined)

export const ErrorContextProvider = (props: any): JSX.Element => {
    const router = useRouter()
    const [, setToast] = useToasts()

    useEffect(() => {
        if (router.query.error) {
            setToast({
                text: <div className="flex gap-4 w-full justify-between items-center"><div><AlertCircle /></div><p className="break-normal">{router.query.error_description ?? 'Error'}</p></div>,
            })
        }
    }, [router.query])

    return <ErrorContext.Provider {...props} value={undefined} />
}
