import {Injectable} from "@angular/core"

export const AuthOtp = "AuthOtp"

@Injectable({providedIn: "root"})
export class AuthUtilsService {
  saveAuthOtp(otp: number) {
    localStorage.setItem(AuthOtp, otp.toString())
  }

  getAuthOtp(): number {
    const otp = localStorage.getItem(AuthOtp) as string
    return parseInt(otp)
  }

  deleteAuthOtp() {
    if (this.getAuthOtp()) localStorage.removeItem(AuthOtp)
    return
  }
}
