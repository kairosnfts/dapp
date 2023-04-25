# Kairos Dapp Library

A Javascript library to interact with your [Kairos](https://kairos.art) collection on the client. It works by creating an iframe, which acts as a middleman between the client and Kairos. 

The iframe can:

- Open modals to facilitate NFT purchases
- Direct users to Kairos verification pages
- Provide authentication by checking if the user holds an NFT of a collection
- Provide authenticated user information
- Log users out

> **NOTE:** This library does *not* create or update NFTs. For that, you must use the [Kairos API](https://api.kairos.art/), which should only be used server-side.

<img width="800" alt="Screenshot 2023-04-25 at 4 11 04 PM" src="https://user-images.githubusercontent.com/6920066/234405082-1a484cf6-8a2a-4355-88e0-9fb3bee11583.png">


## Getting Started

```bash
yarn add kairosnfts/dapp
```

On initialization, the iframe will automatically be created, and include event listeners that get passed along to the parent `window`. If you're using React, use the React helpers to initialize the library with the `KairosProvider`. If you're using another framework, or plain Javascript, you can initialize this way:

```js
<script src="https://kairos.art/assets/dapp.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', async () => {
    await window.Kairos.init({
      env: 'staging',
      slug: 'YOUR_KAIROS_COLLECTION_SLUG',
      hasLogs: true,
    })
  })
</script>
```

## Usage

After initialization, you will have the following properties and methods available on the `window.Kairos` object:

```
{
  init: ({ slug, hasLogs, env, onLogIn, onLogOut, }: {
    env: KairosEnv
    slug: string
    hasLogs: boolean
    onLogIn: () => void
    onLogOut: () => void
  }) => Promise<void>
  destroy: () => void
  close: () => Promise<void>
  startBid: (nftId: string) => Promise<OnBidSuccessArgs | OnBidErrorArgs>
  isLoggedIn: (checkSessionExpired?: boolean) => Promise<boolean>
  getSessionCookie: () => any
  logIn: () => void
  logOut: () => Promise<void>
  getCurrentUser: () => User
}
```

## React Helpers

There is `KairosContext` available to your React application, as long as you wrap the components that need access to Kairos functionality with the `KairosProvider`. It's common to add third-party providers to the root of your application, but feel free to only wrap the necessary components in your application.

The following Next.js example shows a component that wraps it's children props with the `KairosProvider`. 

```js
import { KairosEnv, KairosProvider } from '@kairosnfts/dapp'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <KairosProvider
      env={KairosEnv.staging} // Required: 'development', 'staging', or 'production'
      slug={process.env.YOUR_KAIROS_COLLECTION_SLUG} // Required: Storefront slug from the Kairos dashboard
      hasLogs={true} // Optional verbose logging on the client-side
      onLogIn={() => {
        // Optional callback when user logs in
      }}
      onLogOut={() => {
        // Optional callback when user logs out
      }}
    >
      {children}
    </KairosProvider>
  )
}
```

This would then wrap all components in the root of the project. In the case of Next.js, it could look like this in the root `layout.tsx`:

```js
import Providers from './Providers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

Now, within a client-side component (one that has access to React context), you can use the Kairos context.

```js
import { useContext } from 'react'
import { Kairos, KairosContext } from '@kairosnfts/dapp'

export default function ChildComponent() {
  const { currentUser } = useContext(KairosContext)

  const handleLogin = async () => {
    await Kairos.logIn()
  }

  const handleLogOut = async () => {
    await Kairos.logOut()
  }

  return (
    <div>
      {currentUser ?
        <button onClick={handleLogOut}>Log Out</button>
        : <button onClick={handleLogin}>Log In</button>
      }

      {currentUser && `Logged in as ${currentUser.email}`}
    </div>
  )
}
```

### Available Properties

| Property | Type | Default | Notes |
| -------- | ---- | ------- | ----- |
| `isKairosScriptLoaded` | `Boolean` | `false` | The Kairos script will attempt to automatically connect when the `KairosProvider` mounts. |
| `isLoggedIn` | `Boolean` | `false` | The most recent status of the user state. |
| `isLoginLoading` | `Boolean` | `true` | Since the script automatically connects, it's loading by default. |
| `currentUser` | `{ id: String, email: String, wallet: String }` | `undefined` | The logged-in user properties available to client applications. |

### Available Methods

| Method | Arguments | Notes |
| ------ | --------- | ----- |
| `refetchLogin` | None | Manually refresh the login status from Kairos, which will trigger changes to `isLoginLoading` and `isLoggedIn` |

## Types

TBD

## Support

If you have any questions, or need help while implementing the library within your own project, please don't hesitate to reach out to us at Kairos. We're here to help make your NFT integration as smooth as possible.

### Relevant Links

- [Kairos API documentation](https://api.kairos.art/)
- [Example dapp using dynamic NFTs](https://github.com/kairosnfts/sample-dynamic-nfts)
