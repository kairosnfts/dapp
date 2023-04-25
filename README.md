# Kairos Dapp Library

A library to interact with your [Kairos](https://kairos.art) collection. 

## Getting Started

```bash
yarn add kairosnfts/dapp
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

This would then wrap all components in the root of the project. Now, within a client-side component (one that has access to React context), you can use the Kairos context.

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

## Typescript Support

TBD
