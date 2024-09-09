import {HttpClient, HttpParams} from "@angular/common/http"
import {inject, Injectable} from "@angular/core"
import {environment} from "@environment/environment"
import {ServerResInterface} from "@shared/types/server-response.model"
import {BusinessResInterface} from "../data-access/business.model"

@Injectable({providedIn: "any"})
export class BusinessService {
  private readonly httpClient = inject(HttpClient)

  getBusinesses(pageNumber = 1, pageSize = 15, search?: string) {
    console.log({search: search?.toString()})
    const params = new HttpParams({
      fromObject: {
        pageNumber,
        pageSize,
        ...(search && {businessName: search.toString()}),
      },
    })
    return this.httpClient.get<ServerResInterface<BusinessResInterface>>(
      `${environment.AUTHAPIURL}PhaseII/GetallBusinesses`,
      {params}
    )
  }
}
