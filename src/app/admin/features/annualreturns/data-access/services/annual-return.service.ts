import {UploadProjectioResInterface} from "@admin-pages/annualprojection/features/uploadprojection/data-access/annual-projection.models"
import {HttpClient, HttpParams} from "@angular/common/http"
import {inject, Injectable} from "@angular/core"
import {environment} from "@environment/environment"
import {ServerResInterface} from "@shared/types/server-response.model"

@Injectable({providedIn: "root"})
export class AnnualAssesmentService {
  private readonly httpClient = inject(HttpClient)

  getBusinesses(companyId: string, pageNumber = 0, pageSize = 10) {
    const params = new HttpParams({
      fromObject: {
        pageNumber: pageNumber + 1,
        pageSize,
      },
    })
    return this.httpClient.get<ServerResInterface<any>>(
      `${environment.AUTHAPIURL}SSP/FormH1/getallformh1bycompanyId/${companyId}`,
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
