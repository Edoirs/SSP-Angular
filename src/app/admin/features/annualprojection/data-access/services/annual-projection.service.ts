import {HttpClient, HttpParams} from "@angular/common/http"
import {inject, Injectable} from "@angular/core"
import {environment} from "@environment/environment"
import {ServerResInterface} from "@shared/types/server-response.model"
import {UploadProjectioResInterface} from "../../features/uploadprojection/data-access/annual-projection.models"

import axios from "axios"
import {TokenService} from "@shared/services/token.service"
import {MarkEmployeeInterface} from "@admin-pages/monthlyremittance/employeeschedule/data-access/employee-schedule.model"

@Injectable({providedIn: "root"})
export class AnnualProjectionService {
  private readonly httpClient = inject(HttpClient)
  private readonly tokenService = inject(TokenService)

  getUploads(
    companyId: string,
    pageNumber: string,
    pageSize: string,
    busRin?: string,
    businessName?: string,
    companyRin?: string,
    companyName?: string
  ) {
    const params = new HttpParams({
      fromObject: {
        pageNumber,
        pageSize,
        ...(busRin && {busRin}),
        ...(businessName && {businessName}),
        ...(companyRin && {companyRin}),
        ...(companyName && {companyName}),
      },
    })
    return this.httpClient.get<ServerResInterface<UploadProjectioResInterface>>(
      `${environment.AUTHAPIURL}FormH3/newgetallformh3bycompanyId/${companyId}`,
      {params}
    )
  }

  getBusinesses(
    companyId: string,
    pageNumber: string,
    pageSize: string,
    busRin?: string,
    businessName?: string,
    companyRin?: string,
    companyName?: string
  ) {
    const params = new HttpParams({
      fromObject: {
        pageNumber,
        pageSize,
        ...(busRin && {busRin}),
        ...(businessName && {businessName}),
        ...(companyRin && {companyRin}),
        ...(companyName && {companyName}),
      },
    })
    return this.httpClient.get<ServerResInterface<UploadProjectioResInterface>>(
      `${environment.AUTHAPIURL}FormH3/getallformh3bycompanyId/${companyId}`,
      {params}
    )
  }

  markAllEmployeeInactive(payload: MarkEmployeeInterface) {
    return this.httpClient.put<ServerResInterface<any>>(
      `${environment.AUTHAPIURL}PhaseII/Mark-FileFormH3-Inactive`,
      payload
    )
  }

  forwardProjection(payload: any) {
    return this.httpClient.post<ServerResInterface<any>>(
      `${environment.AUTHAPIURL}PhaseII/Mark-FileFormH3-Inactive`,
      payload
    )
  }

  async downloadFormH3(companyId: string) {
    const response = await axios.get(
      `${environment.AUTHAPIURL}FormH3/getallformh3bycompanyIdExcel/${companyId}`,
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

  async downloadFormH3View(companyId: string, businessId: string) {
    const response = await axios.get(
      `${environment.AUTHAPIURL}FormH3/getalluplaodedformh3bycompanyIdExcel/${companyId}/bybusinessId/${businessId}`,
      {
        headers: {
          Authorization: `Bearer ${this.tokenService.getAccessToken}`,
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
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

  bulkUploadAnnualProjection(formData: FormData) {
    return this.httpClient.post<any>(
      `${environment.AUTHAPIURL}FormH3/UploadFormH3`,
      formData
    )
  }
}
