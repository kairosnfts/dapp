import Cookies from 'js-cookie'
import {
  KairosEnv,
  type DeferPromise,
  EmbeddedRequestKind,
  EmbeddedResponseKind,
  type OnBidErrorArgs,
  type OnBidSuccessArgs,
  type User,
} from './types'

const ROOT_URLS = {
  development: 'https://dev.kairos.art',
  staging: 'https://beta.kairos.art',
  production: 'https://kairos.art',
}

const KairosInternal = {
  currentUser: undefined as User | undefined,
  env: KairosEnv.development,
  kairosSessionCookieName: '__kairosSessionToken',
  kairosIframeName: '__kairosEmbed',
  kairosCookieDomain: '',
  slug: undefined,
  hasLogs: true,
  bidDefer: undefined as DeferPromise<OnBidSuccessArgs | OnBidErrorArgs>,
  integrityDefer: undefined as DeferPromise<boolean>,
  onLogIn: undefined as () => void,
  onLogOut: undefined as () => void,

  defer: <T>() => {
    const d = {}
    return Object.assign(
      new Promise((resolve, reject) => Object.assign(d, { resolve, reject })),
      d
    ) as DeferPromise<T>
  },

  postIframeMessage: (
    iframe: HTMLIFrameElement,
    kind: EmbeddedResponseKind | EmbeddedRequestKind,
    args: any = undefined
  ) => {
    iframe.contentWindow.postMessage(
      {
        isKairosEmbeddedEvent: true,
        kind,
        args,
      },
      '*'
    )
  },

  getOrCreateIframe: async () => {
    return await new Promise<HTMLIFrameElement>((resolve, reject) => {
      let iframe = document.getElementById(KairosInternal.kairosIframeName) as
        | HTMLIFrameElement
        | undefined
      if (!iframe) {
        iframe = document.createElement('iframe')
        iframe.id = KairosInternal.kairosIframeName
        iframe.style.zIndex = '999999'
        iframe.style.position = 'absolute'
        iframe.style.width = '100%'
        iframe.style.height = '100%'
        iframe.style.top = '0px'
        iframe.style.right = '0px'
        iframe.src = `${ROOT_URLS[KairosInternal.env]}/${
          KairosInternal.slug
        }/embed`
        iframe.style.border = 'none'
        iframe.style.padding = '0'
        iframe.style.display = 'none'
        iframe.setAttribute('frameborder', '0')
        iframe.setAttribute('allowtransparency', 'true')
        iframe.setAttribute('allow', 'payment *')
        iframe.setAttribute('role', 'presentation')

        document.body.appendChild(iframe)
        iframe.addEventListener('load', function () {
          resolve(iframe)
        })
      } else {
        resolve(iframe)
      }
    })
  },

  handleRequest: (event: {
    data: {
      args: any
      kind: string
      isKairosEmbeddedEvent: any
    }
  }) => {
    const iframe = document.getElementById(
      KairosInternal.kairosIframeName
    ) as HTMLIFrameElement
    if (!iframe) return
    if (!event.data) return
    if (!event.data.isKairosEmbeddedEvent) return

    const { args } = event.data
    if (event.data.kind === EmbeddedResponseKind.POP_UP_EXIT) {
      iframe.style.pointerEvents = 'none'
      iframe.style.display = 'none'
      KairosInternal.bidDefer = undefined
      document.body.removeAttribute('overflow')
    } else if (event.data.kind === EmbeddedResponseKind.PLACE_BID_START) {
      iframe.style.pointerEvents = 'unset'
      iframe.style.display = 'block'
      document.body.style.overflow = 'hidden'
    } else if (event.data.kind === EmbeddedResponseKind.PLACE_BID_SUCCESS) {
      KairosInternal.bidDefer?.resolve(args)
      KairosInternal.bidDefer = undefined
      KairosInternal.hasLogs &&
        console.log(
          `%cPlace bid success ${{ args }}`,
          'background: #13A35C; color: white'
        )
    } else if (event.data.kind === EmbeddedResponseKind.PLACE_BID_ERROR) {
      KairosInternal.bidDefer?.reject(args)
      KairosInternal.bidDefer = undefined
      KairosInternal.hasLogs &&
        console.log(
          `%cPlace bid error ${{ args }}`,
          'background: #ED5C40; color: white'
        )
    } else if (event.data.kind === EmbeddedResponseKind.UPDATE_SESSION) {
      Cookies.set(
        KairosInternal.kairosSessionCookieName,
        args.__kairosSessionToken,
        {
          domain: KairosInternal.kairosCookieDomain,
          secure: true,
          sameSite: 'lax',
          expires: 14, // days
        }
      )
      KairosInternal.onLogIn?.()
      KairosInternal.hasLogs &&
        console.log(
          '%cKairos session updated',
          'background: #6E45E3; color: white'
        )
    } else if (event.data.kind === EmbeddedResponseKind.COOKIE_INTEGRITY) {
      KairosInternal.hasLogs &&
        console.log(
          `%cKairos cookie integrity ${args.isValid ? 'valid' : 'invalid'}`,
          `background: ${args.isValid ? '#13A35C' : '#ED5C40'}; color: white`
        )
      if (!args.isValid) {
        Cookies.remove(KairosInternal.kairosSessionCookieName, {
          domain: KairosInternal.kairosCookieDomain,
        })
      }
      KairosInternal.integrityDefer?.resolve(args.isValid)
    }
  },

  checkSessionParams: () => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const __kairosSessionToken = urlParams.get(
      KairosInternal.kairosSessionCookieName
    )
    if (__kairosSessionToken) {
      KairosInternal.onLogIn?.()
      Cookies.set(
        KairosInternal.kairosSessionCookieName,
        __kairosSessionToken,
        {
          domain: KairosInternal.kairosCookieDomain, // TODO make this generic to any domain
          secure: KairosInternal.env === 'production',
          sameSite: 'lax',
          expires: 14, // days
        }
      )
      window.history.replaceState({}, '', window.location.pathname)
    }
  },

  /**
   * Creates the iframe and adds event listeners
   */
  init: async ({
    slug,
    hasLogs,
    env,
    onLogIn,
    onLogOut,
  }: {
    env: KairosEnv
    slug: string
    hasLogs: boolean
    onLogIn: () => void
    onLogOut: () => void
  }) => {
    KairosInternal.env = env || KairosEnv.development
    KairosInternal.hasLogs = hasLogs
    KairosInternal.slug = slug
    KairosInternal.onLogIn = onLogIn
    KairosInternal.onLogOut = onLogOut
    ;(KairosInternal.kairosCookieDomain =
      KairosInternal.env === 'production' ? 'kairos.art' : ''),
      window.addEventListener('message', KairosInternal.handleRequest)
    KairosInternal.checkSessionParams()
    await KairosInternal.getOrCreateIframe()

    KairosInternal.hasLogs &&
      console.log(
        `%cKairos dapp script loaded for ${KairosInternal.slug}`,
        'background: #6E45E3; color: white'
      )

    if (KairosInternal.getSessionCookie()) {
      await KairosInternal.checkCookieIntegrity()
    }
  },

  checkCookieIntegrity: async () => {
    const iframe = await KairosInternal.getOrCreateIframe()
    const sessionToken = KairosInternal.getSessionCookie()
    KairosInternal.integrityDefer = KairosInternal.defer()
    KairosInternal.postIframeMessage(
      iframe,
      EmbeddedRequestKind.CHECK_COOKIE_INTEGRITY,
      {
        sessionToken,
      }
    )
    KairosInternal.hasLogs &&
      console.log(
        '%cKairos checking cookie integrity',
        'background: #6E45E3; color: white'
      )
    return await KairosInternal.integrityDefer
  },

  /**
   * Closes the iframe
   */
  close: async () => {
    KairosInternal.hasLogs &&
      console.log(
        '%cKairos dapp iframe closed',
        'background: #6E45E3; color: white'
      )
    const iframe = await KairosInternal.getOrCreateIframe()
    iframe.style.pointerEvents = 'none'
    iframe.style.display = 'none'
    document.body.removeAttribute('overflow')
    KairosInternal.bidDefer = undefined
  },

  /**
   * Destroys the iframe end every listener
   */
  destroy: () => {
    KairosInternal.hasLogs &&
      console.log(
        '%cKairos dapp script destroyed',
        'background: #6E45E3; color: white'
      )
    window.removeEventListener('message', KairosInternal.handleRequest)
    const iframe = document.getElementById(
      KairosInternal.kairosIframeName
    ) as HTMLIFrameElement
    iframe.remove()
  },

  /**
   * Shows the bid pop up for the specified nftId
   * @param nftId
   */
  startBid: async (nftId: string) => {
    if (KairosInternal.bidDefer) throw new Error('startBid already started')
    const iframe = await KairosInternal.getOrCreateIframe()
    if (KairosInternal.getSessionCookie()) {
      await KairosInternal.checkCookieIntegrity()
    }
    const isLoginRequired = !KairosInternal.getSessionCookie()
    KairosInternal.postIframeMessage(iframe, EmbeddedRequestKind.PLACE_BID, {
      nftId,
      isLoginRequired,
    })
    KairosInternal.bidDefer = KairosInternal.defer()
    KairosInternal.hasLogs &&
      console.log(
        `%cKairos bid start %cnftId: ${nftId}`,
        'color: #6E45E3;',
        'color: white; background: #6E45E3;'
      )
    return await KairosInternal.bidDefer
  },

  destroySession: async () => {
    const sessionToken = KairosInternal.getSessionCookie()
    Cookies.remove(KairosInternal.kairosSessionCookieName, {
      domain: KairosInternal.kairosCookieDomain,
    })
    const iframe = await KairosInternal.getOrCreateIframe()
    KairosInternal.postIframeMessage(
      iframe,
      EmbeddedRequestKind.DESTROY_SESSION,
      { sessionToken }
    )
    KairosInternal.hasLogs &&
      console.log(
        '%cKairos session destroyed',
        'background: #6E45E3; color: white'
      )
    KairosInternal.onLogOut?.()
  },

  getSessionCookie: () => {
    return Cookies.get(KairosInternal.kairosSessionCookieName)
  },

  /**
   * Returns true if the user is logged in
   * @param checkSessionExpired If true, checks on kairos server for session expiration
   * @returns Promise<boolean>
   */
  isLoggedIn: async (checkSessionExpired?: boolean) => {
    const sessionToken = KairosInternal.getSessionCookie()
    if (!sessionToken) return false
    if (!checkSessionExpired && sessionToken) return true
    const headers: HeadersInit = new Headers()
    headers.set('Content-Type', 'application/json')
    const response = await fetch(
      `${ROOT_URLS[KairosInternal.env]}/public/graphql`,
      {
        headers,
        method: 'POST',
        body: JSON.stringify({
          query: `
        query GetSession($sessionToken: String!) {
          session(sessionToken: $sessionToken) {
            id
            userId
            wallet {
              id
              pubkey
              isCustody
            }
            user {
              email
            }
            __typename
          }
        }`,
          variables: {
            sessionToken,
          },
        }),
      }
    )
    const session = await response.json()
    if (session.data.session) {
      KairosInternal.currentUser = {
        id: session.data.session.userId,
        email: session.data.session.user?.email,
        wallet: {
          pubkey: session.data.session.wallet?.pubkey,
          isCustody: session.data.session.wallet?.isCustody,
          id: session.data.session.wallet?.id,
        },
      }
      return true
    }
    Cookies.remove(KairosInternal.kairosSessionCookieName, {
      domain: KairosInternal.kairosCookieDomain,
    })
    return false
  },

  logIn: () => {
    window.open(
      `${ROOT_URLS[KairosInternal.env]}/${
        KairosInternal.slug
      }/verify?hasSuccessRedirect=true`,
      '_self'
    )
  },

  getCurrentUser: () => {
    return KairosInternal.currentUser
  },
}

// ====== Exports ========
export const Kairos = {
  init: KairosInternal.init,
  destroy: KairosInternal.destroy,
  close: KairosInternal.close,
  startBid: KairosInternal.startBid,
  isLoggedIn: KairosInternal.isLoggedIn,
  getSessionCookie: KairosInternal.getSessionCookie,
  logIn: KairosInternal.logIn,
  logOut: KairosInternal.destroySession,
  getCurrentUser: KairosInternal.getCurrentUser,
}

export * from './types'
export * from './react'
