import {HttpClient} from "@angular/common/http"
import {inject, Injectable} from "@angular/core"
import {environment} from "@environment/environment"
import {ServerResInterface} from "@shared/types/server-response.model"

@Injectable({providedIn: "root"})
export class AuthService {
  private readonly httpClient = inject(HttpClient)

  adminSignUp(payload: any) {
    return this.httpClient.post<ServerResInterface<any>>(
      `${environment.AUTHAPIURL}PhaseII/AdminSignUp`,
      payload
    )
  }
}
