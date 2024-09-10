import {HttpEvent, HttpHandlerFn, HttpRequest} from "@angular/common/http"
import {inject} from "@angular/core"
import {TokenService} from "@shared/services/token.service"
import {Observable} from "rxjs"

export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const token = inject(TokenService).getAccessToken()
  if (token) {
    const newReq = req.clone({
      headers: req.headers.set("Authorization", `Bearer ${token}`),
    })
    return next(newReq)
  }
  return next(req)
}
