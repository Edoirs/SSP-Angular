import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http"
import {inject, Injectable} from "@angular/core"
import {environment} from "@environment/environment"
import {ServerResInterface} from "@shared/types/server-response.model"
import * as EmployeeModel from "../data-access/employee-schedule.model"
import {TokenService} from "@shared/services/token.service"

import axios from "axios"

@Injectable({providedIn: "any"})
export class EmployeeScheduleService {
  private readonly httpClient = inject(HttpClient)
  private readonly tokenService = inject(TokenService)

  getEmployees(pageNumber = 1, pageSize = 15) {
    const params = new HttpParams({fromObject: {pageNumber, pageSize}})
    return this.httpClient.get<
      ServerResInterface<EmployeeModel.EmployeeScheduleResInterface>
    >(`${environment.AUTHAPIURL}PhaseII/GetallBusinessEmployees`, {params})
  }

  getEmployeeDetails(
    businessId: string,
    companyId: string,
    pageNumber = 1,
    pageSize = 15
  ) {
    const params = new HttpParams({
      fromObject: {businessId, companyId, pageNumber, pageSize},
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
      `${environment.AUTHAPIURL}FormH3/UploadMonthly`,
      formData,
      config
    )
  }

  getStateLocalGovts() {
    return this.httpClient.get<
      ServerResInterface<{lganame: string; lgaid: string}[]>
    >(`${environment.AUTHAPIURL}Utility/get-lga`)
  }

  getZipcodes() {
    return this.httpClient.get<any>(
      `${environment.AUTHAPIURL}LocalGovtPostalCode/getall`
    )
  }

  addEmployee(payload: EmployeeModel.AddEmployeeInterface) {
    return this.httpClient.post<ServerResInterface<any>>(
      `${environment.AUTHAPIURL}Employee/AddEmployee`,
      payload
    )
  }

  editEmployee(payload: EmployeeModel.EditEmployeeIncomeInterface) {
    return this.httpClient.put<ServerResInterface<any>>(
      `${environment.AUTHAPIURL}PhaseII/UpdateEmployeeIncome`,
      payload
    )
  }

  markEmployeeInactive(payload: EmployeeModel.MarkEmployeeInterface) {
    return this.httpClient.put<ServerResInterface<any>>(
      `${environment.AUTHAPIURL}PhaseII/Mark-Employee-Inactive`,
      payload
    )
  }

  getScheduleByDate(payload: EmployeeModel.GetScheduleByDateInterface) {
    return this.httpClient.post<ServerResInterface<any>>(
      `${environment.AUTHAPIURL}PhaseII/GetScheduleByDate`,
      payload
    )
  }

  async downloadEmployeePdfMonthly(
    payload: EmployeeModel.DownloadEmployeePdfInterface
  ) {
    const response = await axios.post(
      `${environment.AUTHAPIURL}PhaseII/DownLoadPDFMonthly`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${this.tokenService.getAccessToken}`,
        },
        responseType: "blob",
      }
    )
    let fileURL = URL.createObjectURL(response?.data)
    return fileURL
  }
}
