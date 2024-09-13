import {Injectable} from "@angular/core"
import {LSAuthCredsInterface} from "../data-access/auth.models"

export const AuthUser = "AuthUser"

@Injectable({providedIn: "root"})
export class AuthUtilsService {
  saveAuthOtp(userType: string, otp: number) {
    localStorage.setItem(
      AuthUser,
      JSON.stringify({userType, otp: otp.toString()})
    )
  }

  getLSAuthUser(): LSAuthCredsInterface | null {
    const user = localStorage.getItem(AuthUser) as string
    return JSON.parse(user)
  }

  deleteAuthUser() {
    if (this.getLSAuthUser()?.otp) localStorage.removeItem(AuthUser)
    return
  }
}
