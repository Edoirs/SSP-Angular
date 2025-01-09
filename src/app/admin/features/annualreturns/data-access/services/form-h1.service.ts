import {UploadProjectioResInterface} from "@admin-pages/annualprojection/features/uploadprojection/data-access/annual-projection.models"
import {HttpClient, HttpParams} from "@angular/common/http"
import {inject, Injectable} from "@angular/core"
import {environment} from "@environment/environment"
import {ServerResInterface} from "@shared/types/server-response.model"

@Injectable({providedIn: "root"})
export class FormHoneService {
  private readonly httpClient = inject(HttpClient)

  private mockBusinesses?: UploadProjectioResInterface
  private mockSchedules?: UploadProjectioResInterface

  getBusinesses(companyId: string, pageNumber: string, pageSize: string) {
    const params = new HttpParams({
      fromObject: {
        pageNumber,
        pageSize,
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

  getAnnualScedules(companyId: string, pageNumber: string, pageSize: string) {
    const params = new HttpParams({
      fromObject: {
        pageNumber,
        pageSize,
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
}
