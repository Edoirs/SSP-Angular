import {HttpClient, HttpParams} from "@angular/common/http"
import {inject, Injectable} from "@angular/core"
import {environment} from "@environment/environment"
import {TokenService} from "@shared/services/token.service"
import {ServerResInterface} from "@shared/types/server-response.model"

@Injectable({providedIn: "root"})
export class AssessmentService {
  private readonly httpClient = inject(HttpClient)
  private readonly tokenService = inject(TokenService)

  getAssessments(pageNumber = 1, pageSize = 15) {
    const params = new HttpParams({
      fromObject: {
        pageNumber,
        pageSize,
        BusinessId: this.tokenService.getLoginResData.businessRins[0].id,
        CompanyID: this.tokenService.getLoginResData.companyId,
      },
    })
    return this.httpClient.get<ServerResInterface<any>>(
      `${environment.AUTHAPIURL}PhaseII/GetAllAssessments`,
      {params}
    )
  }
}
