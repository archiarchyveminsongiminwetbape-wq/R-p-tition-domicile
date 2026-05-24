import React            from 'react'
import ReactDOM         from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import App              from './App'
import './index.css'
import { AUTH0_CONFIG } from './auth/config'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain={AUTH0_CONFIG.domain}
        clientId={AUTH0_CONFIG.clientId}
        authorizationParams={{
          redirect_uri: AUTH0_CONFIG.callbackUrl,
          audience:     AUTH0_CONFIG.audience,
          scope:        'openid profile email update:current_user_metadata',
        }}
        cacheLocation="localstorage"
        useRefreshTokens={true}
      >
        <App />
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
)
