import {HttpClient, HttpParams} from "@angular/common/http"
import {inject, Injectable} from "@angular/core"
import {environment} from "@environment/environment"
import {ServerResInterface} from "@shared/types/server-response.model"
import {BusinessResInterface} from "../data-access/business.model"
import {TokenService} from "@shared/services/token.service"

import axios from "axios"

@Injectable({providedIn: "any"})
export class BusinessService {
  private readonly httpClient = inject(HttpClient)
  private readonly tokenService = inject(TokenService)

  getBusinesses(pageNumber = 1, pageSize = 15, search?: string) {
    const params = new HttpParams({
      fromObject: {
        pageNumber,
        pageSize,
        ...(search && {businessName: search}),
      },
    })
    return this.httpClient.get<ServerResInterface<BusinessResInterface>>(
      `${environment.AUTHAPIURL}PhaseII/GetallBusinesses`,
      {params}
    )
  }

  async downloadBusinessExcel() {
    const response = await axios.get(
      `${environment.AUTHAPIURL}PhaseII/GetallBusinessesExcel`,
      {
        headers: {
          Authorization: `Bearer ${this.tokenService.getAccessToken}`,
        },
        responseType: "blob",
      }
    )
    let fileURL = URL.createObjectURL(response?.data)
    return fileURL
  }
}
