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

Add this library to your dependencies: 

```bash
yarn add kairosnfts/dapp
```

Or if you're not using modules, you can link directly to a minified script:

```html
<script src="https://kairos.art/assets/dapp.js"></script>
```

### Initialization

If you're using React, you can use the React helpers to initialize the library with the `KairosProvider`. It's common to add third-party providers to the root of your application, but feel free to only wrap the necessary components in your application.

```js
import { KairosEnv, KairosProvider } from '@kairosnfts/dapp'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
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
      </body>
    </html>
  )
}
```

If you're using another framework, or plain Javascript, you can initialize this way:

```html
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

After initialization, the iframe will automatically be created, and will include event listeners that get passed along to the parent `window`. You will have the following properties and methods available on the `window.Kairos` object:

### Methods in `window.Kairos`

<table>
<tr>
<th>Method</th>
<th>Arguments</th>
<th>Notes</th>
</tr>
<tr>
<td>

`init`

</td>
<td>

```js
{
  env: KairosEnv
  slug: string
  hasLogs: boolean
  onLogIn: () => void
  onLogOut: () => void
}
```

</td>
<td>Initialize the iframe and add event listeners.</td>
</tr>
<tr>
<td>

`destroy`

</td>
<td>
None
</td>
<td>
Destroys the iframe end every listener.
</td>
</tr>
<tr>
<td>

`close`

</td>
<td>
None
</td>
<td>
Closes the purchase modal (if open).
</td>
</tr>
<tr>
<td>

`startBid`

</td>
<td>

`nftId: string`

</td>
<td>

Shows the bid modal for the specified `nftId`.

</td>
</tr>
<tr>
<td>

`logIn`

</td>
<td>
None
</td>
<td>
Redirects the user to the verification page for the collection.
</td>
</tr>
<tr>
<td>

`logOut`

</td>
<td>
None
</td>
<td>
Logs the user out.
</td>
</tr>
<tr>
<td>

`getSessionCookie`

</td>
<td>
None
</td>
<td>
Returns the value of the current session cookie.
</td>
</tr>
<tr>
<td>

`getCurrentUser`

</td>
<td>
None
</td>
<td>

Returns client-safe user details for the current user.

```js
{
  id: String
  email: String
  wallet: String
}
```

</td>
</tr>
</table>


### Methods in `KairosContext`

| Method | Arguments | Notes |
| ------ | --------- | ----- |
| `refetchLogin` | None | Manually refresh the login status from Kairos, which will trigger changes to `isLoginLoading` and `isLoggedIn` |

### Properties in `window.Kairos`

| Property | Type | Default | Notes |
| -------- | ---- | ------- | ----- |
| `isLoggedIn` | `Boolean` | `false` | The most recent status of the user state. |

### Properties in `KairosContext`

| Property | Type | Default | Notes |
| -------- | ---- | ------- | ----- |
| `isKairosScriptLoaded` | `Boolean` | `false` | The Kairos script will attempt to automatically connect when the `KairosProvider` mounts. |
| `isLoggedIn` | `Boolean` | `false` | The most recent status of the user state. |
| `isLoginLoading` | `Boolean` | `true` | Since the script automatically connects, it's loading by default. |
| `currentUser` | `{ id: String, email: String, wallet: String }` | `undefined` | The logged-in user properties available to client applications. |

## Implementation

Now, within a client-side component (one that has access to React context), you can use the Kairos context in addition to the Kairos object. 

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

If you want to initiate a purchase modal, you could do so after you've created an NFT and received the `nftId` by:

```js
await Kairos.startBid(nftId)
Kairos.close() // Close the Kairos modal or it will stay open
```

Remember, that in order to get an `nftId`, you need to use the [Kairos API](https://api.kairos.art/) on the server and pass it to the client to initiate the `startBid()` method.

## Types

TBD

## Support

If you have any questions, or need help while implementing the library within your own project, please don't hesitate to reach out to us at Kairos. We're here to help make your NFT integration as smooth as possible.

### Relevant Links

- [Kairos API documentation](https://api.kairos.art/)
- [Example dapp using dynamic NFTs](https://github.com/kairosnfts/sample-dynamic-nfts)
