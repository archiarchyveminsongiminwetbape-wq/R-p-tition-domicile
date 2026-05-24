export const AUTH0_CONFIG = {
  domain:      import.meta.env.VITE_AUTH0_DOMAIN,
  clientId:    import.meta.env.VITE_AUTH0_CLIENT_ID,
  audience:    import.meta.env.VITE_AUTH0_AUDIENCE,
  callbackUrl: import.meta.env.VITE_AUTH0_CALLBACK_URL,
  namespace:   import.meta.env.VITE_ROLE_NAMESPACE,
}

export const ROLE_CLAIM   = `${AUTH0_CONFIG.namespace}/role`
export const DB_CONNECTION = 'Username-Password-Authentication'
export const SIGNUP_URL    = `https://${AUTH0_CONFIG.domain}/dbconnections/signup`
export const MGMT_API_URL  = `https://${AUTH0_CONFIG.domain}/api/v2`
