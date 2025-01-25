import {UploadProjectioResInterface} from "@admin-pages/annualprojection/features/uploadprojection/data-access/annual-projection.models"
import {HttpClient, HttpParams} from "@angular/common/http"
import {inject, Injectable} from "@angular/core"
import {environment} from "@environment/environment"
import {TokenService} from "@shared/services/token.service"
import {ServerResInterface} from "@shared/types/server-response.model"

import axios from "axios"

@Injectable({providedIn: "root"})
export class FormHoneService {
  private readonly httpClient = inject(HttpClient)
  private readonly tokenService = inject(TokenService)

  private mockBusinesses?: UploadProjectioResInterface
  private mockSchedules?: UploadProjectioResInterface

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
      `${environment.AUTHAPIURL}SSP/FormH1/getallformh1bycompanyId/${companyId}`,
      {params}
    )
  }

  getBusinessesByBusinessId(
    companyId: string,
    businessId: string,
    pageNumber: string,
    pageSize: string
  ) {
    const params = new HttpParams({
      fromObject: {
        pageNumber,
        pageSize,
      },
    })
    return this.httpClient.get<ServerResInterface<UploadProjectioResInterface>>(
      `${environment.AUTHAPIURL}SSP/FormH1/getallformh1bycompanyId/${companyId}/bybusinessId/${businessId}`,
      {params}
    )
  }

  getAnnualScedules(
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
      `${environment.AUTHAPIURL}SSP/FormH1/newgetallformh1bycompanyId/${companyId}`,
      {params}
    )
  }

  bulkUploadFormH1(formData: FormData) {
    return this.httpClient.post<any>(
      `${environment.AUTHAPIURL}SSP/FormH1/UploadFormH1`,
      formData
    )
  }

  async downloadFormH3(companyId: string) {
    const response = await axios.get(
      `${environment.AUTHAPIURL}SSP/FormH3/getallformh3bycompanyIdExcel/${companyId}`,
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
      `${environment.AUTHAPIURL}SSP/FormH1/getalluplaodedformh1ExcelbycompanyId/${companyId}/bybusinessId/${businessId}`,
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
