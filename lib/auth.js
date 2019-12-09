export function checkRouteAuth(authConfig, routeName, permissionKey = 'read', personaPermissions = []) {
  let routeAuthConfig = authConfig.routes.find(route => route.name === routeName)
  if(!routeAuthConfig) {
    routeAuthConfig = authConfig.default
  }
  let routePermissions = routeAuthConfig[permissionKey]
  console.log('match permissions', routePermissions, personaPermissions)
  let intersection = personaPermissions.filter(p => routePermissions.includes(p))
  return intersection.length > 0
}
