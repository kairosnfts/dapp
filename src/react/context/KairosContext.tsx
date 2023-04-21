
import React, { createContext, useEffect, useState } from 'react'
import { Kairos, User } from '../../index'

export type KairosContextType = {
  isKairosScriptLoaded: boolean
  isLoggedIn: boolean | undefined
  isLoginLoading: boolean
  currentUser: User | undefined
  refetchLogin: () => void
  setIsLoaded: (loaded: boolean) => void
}

export const KairosContext = createContext<KairosContextType>({
  isKairosScriptLoaded: false,
  isLoggedIn: undefined,
  isLoginLoading: true,
  currentUser: undefined,
  refetchLogin: () => {},
  setIsLoaded: (loaded) => {},
})

export const KairosProvider = ({ children }: { children: any }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(true)
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined)

  const refetchLogin = async () => {
    setIsLoginLoading(true)
    const loginStatus = await Kairos.isLoggedIn(true)
    setIsLoggedIn(loginStatus)
    setIsLoginLoading(false)
    if (loginStatus) {
      setCurrentUser(Kairos.getCurrentUser())
    }
  }

  useEffect(() => {
    if (isLoaded) refetchLogin()
  }, [isLoaded])

  const value = {
    isKairosScriptLoaded: isLoaded,
    isLoggedIn,
    isLoginLoading,
    currentUser,
    refetchLogin,
    setIsLoaded,
  }

  return (
    <KairosContext.Provider value={value}>{children}</KairosContext.Provider>
  )
}

export default KairosProvider
