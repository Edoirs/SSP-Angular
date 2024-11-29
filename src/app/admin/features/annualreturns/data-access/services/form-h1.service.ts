import {UploadProjectioResInterface} from "@admin-pages/annualprojection/features/uploadprojection/data-access/annual-projection.models"
import {HttpClient, HttpParams} from "@angular/common/http"
import {inject, Injectable} from "@angular/core"
import {environment} from "@environment/environment"
import {ServerResInterface} from "@shared/types/server-response.model"

@Injectable({providedIn: "root"})
export class FormHoneService {
  private readonly httpClient = inject(HttpClient)

  getBusinesses(companyId: string, pageNumber = 0, pageSize = 10) {
    const params = new HttpParams({
      fromObject: {
        pageNumber: pageNumber + 1,
        pageSize,
      },
    })
    return this.httpClient.get<ServerResInterface<UploadProjectioResInterface>>(
      `${environment.AUTHAPIURL}SSP/FormH1/getallformh1bycompanyId/${companyId}`,
      {params}
    )
  }
}
