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
    pageNumber: number,
    pageSize: number,
    busRin?: string,
    businessName?: string,
    companyRin?: string,
    companyName?: string,
    search?: string
  ) {
    const params = new HttpParams({
      fromObject: {
        companyId,
        pageNumber,
        pageSize,
        ...(busRin && {busRin}),
        ...(businessName && {businessName}),
        ...(companyRin && {companyRin}),
        ...(companyName && {companyName}),
        ...(search && {businessName: search}),
      },
    })
    return this.httpClient.get<
      ServerResInterface<ScheduleModel.SchedulesResInterface>
    >(`${environment.AUTHAPIURL}PhaseII/GetAllScheduleDetails`, {params})
  }

  getScheduleView(
    BusinessId: string,
    CompanyId: string,
    Month: string,
    TaxYear: string,
    PageNumber = 0,
    PageSize = 10
  ) {
    const params = new HttpParams({
      fromObject: {
        BusinessId,
        CompanyId,
        Month,
        TaxYear,
        PageNumber: PageNumber + 1,
        PageSize,
      },
    })
    return this.httpClient.get<
      ServerResInterface<ScheduleModel.ScheduleDetailResInterface>
    >(`${environment.AUTHAPIURL}PhaseII/GetAllSchedulesViewWithYear`, {params})
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
