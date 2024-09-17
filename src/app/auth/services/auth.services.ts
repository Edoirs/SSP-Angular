import {HttpClient} from "@angular/common/http"
import {inject, Injectable} from "@angular/core"
import {environment} from "@environment/environment"
import {ServerResInterface} from "@shared/types/server-response.model"
import * as AuthModels from "../data-access/auth.models"
import {Observable, of, switchMap, tap} from "rxjs"
import {data} from "jquery"

@Injectable({providedIn: "root"})
export class AuthService {
  taxOffices?: AuthModels.TaxOfficeResInterface[]
  private readonly httpClient = inject(HttpClient)

  adminSignUp(payload: AuthModels.AdminSignupInterface) {
    return this.httpClient
      .post<ServerResInterface<any>>(
        `${environment.AUTHAPIURL}PhaseII/AdminSignUp`,
        payload
      )
      .pipe(
        switchMap((res) => {
          const user = {
            isAdmin: true,
            companyRin: payload.userName,
            phoneNumber: payload.phoneNumber,
          } as AuthModels.AdminInitChangePasswordInterface

          if (res.status) return this.adminInitChangePassword(user)
          return of(res)
        })
      )
  }

  adminInitChangePassword(
    payload: AuthModels.AdminInitChangePasswordInterface
  ) {
    return this.httpClient.post<ServerResInterface<any>>(
      `${environment.AUTHAPIURL}PhaseII/InitiateChangePassword`,
      payload
    )
  }

  adminChangePassword(payload: AuthModels.AdminChangePasswordInterface) {
    return this.httpClient.put<ServerResInterface<any>>(
      `${environment.AUTHAPIURL}PhaseII/ChangePassword`,
      payload
    )
  }

  getTaxOffices() {
    const response: ServerResInterface<AuthModels.TaxOfficeResInterface[]> = {
      id: 0,
      data: [],
      status: true,
      message: "Data fetched",
    }
    if (this.taxOffices?.length)
      return of<ServerResInterface<AuthModels.TaxOfficeResInterface[]>>({
        ...response,
        data: this.taxOffices as AuthModels.TaxOfficeResInterface[],
      })
    return this.httpClient
      .get<ServerResInterface<AuthModels.TaxOfficeResInterface[]>>(
        `${environment.AUTHAPIURL}Utility/get-tax-office`
      )
      .pipe(
        tap((res) => {
          if (res.status === true) this.taxOffices = res.data
        })
      )
  }
}
