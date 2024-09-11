import {HttpClient, HttpParams} from "@angular/common/http"
import {inject, Injectable} from "@angular/core"
import {environment} from "@environment/environment"
import {ServerResInterface} from "@shared/types/server-response.model"
import {MarkEmployeeInterface} from "../../monthlyremittance/employeeschedule/data-access/employee-schedule.model"
import {UploadProjectioResInterface} from "../features/uploadprojection/data-access/annual-projection.models"

@Injectable({providedIn: "root"})
export class AnnualProjectionService {
  private readonly httpClient = inject(HttpClient)

  getUploads(CompanyID: string, pageNumber = 1, pageSize = 15) {
    const params = new HttpParams({
      fromObject: {CompanyID, pageNumber, pageSize},
    })
    return this.httpClient.get<ServerResInterface<UploadProjectioResInterface>>(
      `${environment.AUTHAPIURL}FormH3/newgetallformh3bycompanyId/${CompanyID}`,
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
}
