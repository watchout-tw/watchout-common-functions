import authConfig from '~/config/auth'

export default function({ route, store, error }) { // https://nuxtjs.org/api/context
  console.info('[auth] middleware activated')
  let routeName = route.name
  let routeAuthConfig = authConfig.routes.find(route => route.name === routeName)
  if(!routeAuthConfig) {
    routeAuthConfig = authConfig.default
  }
  let routePermissions = routeAuthConfig.read
  let persona = store.state.fsAuth.activePersona
  let personaPermissions = persona && persona.permissions ? persona.permissions : []
  console.log('[auth] match permissions', routePermissions, personaPermissions)
  let intersection = personaPermissions.filter(p => routePermissions.includes(p))
  if(intersection.length > 0) {
    console.info('[auth] page access granted')
  } else {
    console.info('[auth] page access denied')
    error({ statusCode: 404 })
  }
}
