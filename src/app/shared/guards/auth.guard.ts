import {inject} from "@angular/core"
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from "@angular/router"
import {TokenService} from "../services/token.service"

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return !inject(TokenService).getAccessToken
    ? inject(Router).navigate(["login"])
    : true
}
