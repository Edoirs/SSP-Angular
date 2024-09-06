import {HttpClient, HttpParams} from "@angular/common/http"
import {inject, Injectable} from "@angular/core"
import {environment} from "@environment/environment"
import {ServerResInterface} from "@shared/types/server-response.model"

@Injectable({providedIn: "root"})
export class AnnualProjectionService {
  private readonly httpClient = inject(HttpClient)

  getUploads(pageNumber = 1, pageSize = 15) {
    const params = new HttpParams({fromObject: {pageNumber, pageSize}})
    return this.httpClient.get<ServerResInterface<any>>(
      `${environment.AUTHAPIURL}PhaseII/GetFileFormH3`,
      {params}
    )
  }
}
