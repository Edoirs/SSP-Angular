import {HttpClient, HttpParams} from "@angular/common/http"
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

  getEmployees(
    pageNumber: number,
    pageSize: number,
    busRin?: string,
    businessName?: string,
    companyRin?: string,
    companyName?: string,
    searchTerm?: string
  ) {
    const params = new HttpParams({
      fromObject: {
        pageNumber,
        pageSize,
        ...(busRin && {busRin}),
        ...(businessName && {businessName}),
        ...(companyRin && {companyRin}),
        ...(companyName && {companyName}),
        ...(searchTerm && {searchTerm}),
      },
    })
    return this.httpClient.get<
      ServerResInterface<EmployeeModel.EmployeeScheduleResInterface>
    >(`${environment.AUTHAPIURL}PhaseII/GetallBusinessEmployees`, {params})
  }

  getEmployeeDetails(
    businessId: string,
    companyId: string,
    pageNumber: number,
    pageSize: number
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
      ServerResInterface<{lgaName: string; lgaid: string}[]>
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

  markFormH3EmployeeInactive(
    payload: EmployeeModel.MarkFormH3EmployeeInterface
  ) {
    return this.httpClient.put<ServerResInterface<any>>(
      `${environment.AUTHAPIURL}PhaseII/Mark-FileFormH3-Inactive`,
      payload
    )
  }

  getScheduleByDate(payload: EmployeeModel.GetScheduleByDateInterface) {
    return this.httpClient.post<ServerResInterface<any>>(
      `${environment.AUTHAPIURL}PhaseII/GetScheduleByDate`,
      payload
    )
  }

  getSingleEmployeeDetail(
    BusinessId: string,
    CompanyId: string,
    EmployeeId: string
  ) {
    const params = new HttpParams({
      fromObject: {BusinessId, CompanyId, EmployeeId},
    })
    return this.httpClient.get<
      ServerResInterface<EmployeeModel.SingleEmployeeDetailResInterface>
    >(`${environment.AUTHAPIURL}PhaseII/GetEmployeeMonthlyIncomeDetail`, {
      params,
    })
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
    // Extract the filename from the Content-Disposition header
    const contentDisposition = response.headers["content-disposition"]
    let filename = "default_filename.pdf" // Fallback filename

    if (contentDisposition && contentDisposition.includes("filename=")) {
      // Extract the filename from the header
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      const matches = filenameRegex.exec(contentDisposition)
      if (matches) {
        filename = matches[1].replace(/['"]/g, "") // Remove quotes
      }
    }

    // Create a URL for the downloaded file
    const fileURL = URL.createObjectURL(response.data)

    return {fileURL, filename}
  }

  async downloadEmployeeExcelMonthly(
    payload: EmployeeModel.DownloadEmployeePdfInterface
  ) {
    const response = await axios.post(
      `${environment.AUTHAPIURL}PhaseII/DownLoadExcelMonthly`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${this.tokenService.getAccessToken}`,
        },
        responseType: "blob",
      }
    )
    // Extract the filename from the Content-Disposition header
    const contentDisposition = response.headers["content-disposition"]
    let filename = "default_filename.xlsx" // Fallback filename

    if (contentDisposition && contentDisposition.includes("filename=")) {
      // Extract the filename from the header
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      const matches = filenameRegex.exec(contentDisposition)
      if (matches) {
        filename = matches[1].replace(/['"]/g, "") // Remove quotes
      }
    }

    // Create a URL for the downloaded file
    const fileURL = URL.createObjectURL(response.data)

    return {fileURL, filename}
  }
}
