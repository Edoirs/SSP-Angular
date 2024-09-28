import {HttpClient, HttpParams} from "@angular/common/http"
import {inject, Injectable} from "@angular/core"
import {environment} from "@environment/environment"
import {ServerResInterface} from "@shared/types/server-response.model"
import * as ScheduleModel from "../data-access/schedule.model"

@Injectable({providedIn: "root"})
export class ScheduleService {
  private readonly httpClient = inject(HttpClient)

  getSchedules(
    companyId: string,
    pageNumber = 1,
    pageSize = 15,
    search?: string
  ) {
    const params = new HttpParams({
      fromObject: {
        companyId,
        pageNumber,
        pageSize,
        ...(search && {businessName: search}),
      },
    })
    return this.httpClient.get<
      ServerResInterface<ScheduleModel.SchedulesResInterface>
    >(`${environment.AUTHAPIURL}PhaseII/GetAllScheduleDetails`, {params})
  }

  getScheduleView(BusinessRin: string, CompanyRin: string) {
    const params = new HttpParams({fromObject: {BusinessRin, CompanyRin}})
    return this.httpClient.get<
      ServerResInterface<ScheduleModel.ScheduleDetailResInterface[]>
    >(`${environment.AUTHAPIURL}PhaseII/GetAllSchedulesView`, {params})
  }

  sendToRdm(payload: ScheduleModel.SendRdmInterface) {
    return this.httpClient.post<ServerResInterface<any>>(
      `${environment.AUTHAPIURL}PhaseII/SendToRDM`,
      payload
    )
  }

  resendToRdm(payload: ScheduleModel.SendRdmInterface) {
    return this.httpClient.post<ServerResInterface<any>>(
      `${environment.AUTHAPIURL}PhaseII/Re-SendToRDM`,
      payload
    )
  }

  reviseSubmission(payload: ScheduleModel.SendRdmInterface) {
    return this.httpClient.post<ServerResInterface<any>>(
      `${environment.AUTHAPIURL}PhaseII/Revise-Submission`,
      payload
    )
  }

  reAssess(payload: ScheduleModel.SendRdmInterface) {
    return this.httpClient.post<ServerResInterface<any>>(
      `${environment.AUTHAPIURL}PhaseII/Re-Assess`,
      payload
    )
  }

  downloadPdf(payload: ScheduleModel.SendRdmInterface) {
    return this.httpClient.post<ServerResInterface<any>>(
      `${environment.AUTHAPIURL}PhaseII/DownloadPDF`,
      payload
    )
  }
}
