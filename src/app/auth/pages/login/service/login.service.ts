import {HttpClient} from "@angular/common/http"
import {inject, Injectable} from "@angular/core"
import {environment} from "@environment/environment"

@Injectable({providedIn: "any"})
export class LoginService {
  private readonly http = inject(HttpClient)

  validateOTPAccount(data: any) {
    return this.http.post(
      `${environment.AUTHAPIURL}Login/ValidateOTPAccount`,
      data
    )
  }

  resendOTPAccount(data: any) {
    return this.http.post(
      `${environment.AUTHAPIURL}Login/ResendOTPAccount`,
      data
    )
  }

  sendOtp(data: any) {
    return this.http.post(`${environment.AUTHAPIURL}auth/send-otp`, data)
  }

  signIn(data: any) {
    return this.http.post(`${environment.AUTHAPIURL}Login/SignIn`, data)
  }
}
