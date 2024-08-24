import {HttpClient, HttpParams} from "@angular/common/http"
import {inject, Injectable} from "@angular/core"
import {environment} from "@environment/environment"
import {ServerResInterface} from "@shared/types/server-response.model"
import {EmployeeScheduleResInterface} from "../data-access/employee-schedule.model"

@Injectable({providedIn: "any"})
export class EmployeeScheduleService {
  private readonly httpClient = inject(HttpClient)

  getEmployees(pageNumber = 1, pageSize = 15) {
    const params = new HttpParams({fromObject: {pageNumber, pageSize}})
    return this.httpClient.get<
      ServerResInterface<EmployeeScheduleResInterface[]>
    >(`${environment.AUTHAPIURL}PhaseII/GetallBusinessEmployees`, {params})
  }
}
