import {HttpClient, HttpParams} from "@angular/common/http"
import {inject, Injectable} from "@angular/core"
import {environment} from "@environment/environment"
import {TokenService} from "@shared/services/token.service"
import {ServerResInterface} from "@shared/types/server-response.model"
import {AssessmentResInterface} from "../data-access/assessment.model"
import {DownloadEmployeePdfInterface} from "@admin-pages/monthlyremittance/employeeschedule/data-access/employee-schedule.model"

import axios from "axios"

@Injectable({providedIn: "root"})
export class AssessmentService {
  private readonly httpClient = inject(HttpClient)
  private readonly tokenService = inject(TokenService)

  getAssessments(
    pageNumber: number,
    pageSize: number,
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
        CompanyId: this.tokenService.getLoginResData.companyId,
      },
    })
    return this.httpClient.get<
      ServerResInterface<{result: AssessmentResInterface[]; totalCount: number}>
    >(`${environment.AUTHAPIURL}PhaseII/GetAllAssessments`, {params})
  }

  async downloadEmployeePdfMonthly(payload: DownloadEmployeePdfInterface) {
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
