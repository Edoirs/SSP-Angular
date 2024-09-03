import {HttpClient, HttpParams} from "@angular/common/http"
import {inject, Injectable} from "@angular/core"
import {environment} from "@environment/environment"
import {ServerResInterface} from "@shared/types/server-response.model"
import * as EmployeeModel from "../data-access/employee-schedule.model"

@Injectable({providedIn: "any"})
export class EmployeeScheduleService {
  private readonly httpClient = inject(HttpClient)

  getEmployees(pageNumber = 1, pageSize = 15) {
    const params = new HttpParams({fromObject: {pageNumber, pageSize}})
    return this.httpClient.get<
      ServerResInterface<EmployeeModel.EmployeeScheduleResInterface>
    >(`${environment.AUTHAPIURL}PhaseII/GetallBusinessEmployees`, {params})
  }

  getEmployeeDetails(
    businessRin: string,
    companyRin: string,
    pageNumber = 1,
    pageSize = 15
  ) {
    const params = new HttpParams({
      fromObject: {businessRin, companyRin, pageNumber, pageSize},
    })
    return this.httpClient.get<
      ServerResInterface<EmployeeModel.EmployeeDetailResInterface[]>
    >(`${environment.AUTHAPIURL}PhaseII/GetBussinessEmployeesByRin`, {params})
  }

  bulkEmployeeUpload(formData: FormData) {
    const config = {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    }
    return this.httpClient.post<any>(
      `${environment.AUTHAPIURL}employees/import`,
      formData,
      config
    )
  }

  getStateLocalGovts() {
    return this.httpClient.get<any>(
      `${environment.AUTHAPIURL}LocalGovernmentArea/getall`
    )
  }

  getZipcodes() {
    return this.httpClient.get<any>(
      `${environment.AUTHAPIURL}LocalGovtPostalCode/getall`
    )
  }

  markEmployeeInactive(payload: EmployeeModel.MarkEmployeeInterface) {
    return this.httpClient.put<ServerResInterface<any>>(
      `${environment.AUTHAPIURL}PhaseII/Mark-Employee-Inactive`,
      payload
    )
  }

  markAllEmployeeInactive(payload: EmployeeModel.MarkEmployeeInterface) {
    return this.httpClient.put<ServerResInterface<any>>(
      `${environment.AUTHAPIURL}PhaseII/Mark-All-Employee-Inactive`,
      payload
    )
  }
}