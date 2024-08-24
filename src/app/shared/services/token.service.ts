import {Injectable} from "@angular/core"

@Injectable({providedIn: "root"})
export class TokenService {
  private readonly AccessToken = "access_token"

  saveAccessToken(access_token: string) {
    return localStorage.setItem(this.AccessToken, access_token)
  }

  getAccessToken(): string {
    const token = localStorage.getItem(this.AccessToken)

    return token as string
  }

  removeAccessToken() {
    return localStorage.removeItem(this.AccessToken)
  }
}
