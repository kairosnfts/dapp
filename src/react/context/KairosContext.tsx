'use client'

import React, { createContext, useEffect, useState } from 'react'
import { Kairos } from '../../index'
import { type KairosEnv, type User } from '../../types'

export interface KairosContextType {
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

export const KairosProvider = ({
  children,
  env,
  hasLogs,
  slug,
  onLogIn,
  onLogOut,
}: {
  children: any
  slug: string
  env: KairosEnv
  hasLogs?: boolean
  onLogIn?: () => void
  onLogOut?: () => void
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(true)
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined)

  const refetchLogin = async () => {
    if (!isLoaded) return

    setIsLoginLoading(true)
    const loginStatus = await Kairos.isLoggedIn(true)
    setIsLoggedIn(loginStatus)
    setIsLoginLoading(false)
    if (loginStatus) {
      setCurrentUser(Kairos.getCurrentUser())
    }
  }

  const loadKairos = async () => {
    await Kairos.init({
      env,
      hasLogs,
      slug,
      onLogIn: () => {
        refetchLogin()
        onLogIn?.()
      },
      onLogOut: () => {
        setIsLoggedIn(false)
        setCurrentUser(undefined)
        onLogOut?.()
      },
    })

    setIsLoaded(true)
  }

  useEffect(() => {
    loadKairos()
  }, [])

  // useEffect(() => {
  //   if (isLoaded) refetchLogin()
  // }, [isLoaded])

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
