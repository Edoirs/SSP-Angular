import {HttpClient} from "@angular/common/http"
import {inject, Injectable} from "@angular/core"
import {environment} from "@environment/environment"
import {ServerResInterface} from "@shared/types/server-response.model"
import * as AuthModels from "../data-access/auth.models"
import {Observable, of, switchMap, tap} from "rxjs"

import {AdminStepOneResInterface} from "../data-access/auth.models"

@Injectable({providedIn: "root"})
export class AuthService {
  taxOffices?: AuthModels.TaxOfficeResInterface[]
  private readonly httpClient = inject(HttpClient)

  adminSignUp(
    payload: AuthModels.AdminSignupInterface
  ): Observable<ServerResInterface<AdminStepOneResInterface>> {
    return this.httpClient.post<ServerResInterface<AdminStepOneResInterface>>(
      `${environment.AUTHAPIURL}PhaseII/AdminSignUp`,
      payload
    )
  }

  adminInitChangePassword(
    payload: AuthModels.AdminInitChangePasswordInterface
  ) {
    return this.httpClient.post<ServerResInterface<number>>(
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

  signUpUserStepOne(payload: {companyRin: string}) {
    return this.httpClient.post<
      ServerResInterface<AuthModels.UserRegisterStepOneInterface>
    >(`${environment.AUTHAPIURL}Login/CreateAccountStepOne`, payload)
  }

  createAccountStepTwo(payload: any) {
    return this.httpClient.post(
      `${environment.AUTHAPIURL}Login/CreateAccountStepTwo`,
      payload
    )
  }

  createAccountStepThree(payload: any) {
    return this.httpClient.post(
      `${environment.AUTHAPIURL}Login/CreateAccountStepThree`,
      payload
    )
  }
}
