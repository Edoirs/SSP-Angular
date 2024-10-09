import {HttpClient, HttpParams} from "@angular/common/http"
import {inject, Injectable} from "@angular/core"
import {environment} from "@environment/environment"
import {TokenService} from "@shared/services/token.service"
import {ServerResInterface} from "@shared/types/server-response.model"
import {AssessmentResInterface} from "../data-access/assessment.model"

@Injectable({providedIn: "root"})
export class AssessmentService {
  private readonly httpClient = inject(HttpClient)
  private readonly tokenService = inject(TokenService)

  getAssessments(pageNumber: number, pageSize = 15) {
    const params = new HttpParams({
      fromObject: {
        pageNumber: pageNumber + 1,
        pageSize,
        CompanyID: this.tokenService.getLoginResData.companyId,
      },
    })
    return this.httpClient.get<ServerResInterface<AssessmentResInterface[]>>(
      `${environment.AUTHAPIURL}PhaseII/GetAllAssessments`,
      {params}
    )
  }
}
