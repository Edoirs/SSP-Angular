import {HttpClient, HttpParams} from "@angular/common/http"
import {inject, Injectable} from "@angular/core"
import {environment} from "@environment/environment"
import {ServerResInterface} from "@shared/types/server-response.model"

@Injectable({providedIn: "any"})
export class SettingsService {
  private readonly http = inject(HttpClient)

  getUsers(pageNumber?: string, pageSize?: string, searchTerm?: string) {
    const params = new HttpParams({
      fromObject: {
        ...(pageNumber && {pageNumber}),
        ...(pageSize && {pageSize}),
        ...(searchTerm && {searchTerm}),
      },
    })

    return this.http.get<ServerResInterface<any>>(
      `${environment.AUTHAPIURL}PhaseIII/AllUsers`,
      {params}
    )
  }

  syncRules() {
    return this.http.get<ServerResInterface<any>>(
      `${environment.AUTHAPIURL}PhaseIII/SyncRule`
    )
  }

  syncCorporate() {
    return this.http.get<ServerResInterface<any>>(
      `${environment.AUTHAPIURL}PhaseIII/SyncCooperate`
    )
  }

  syncItems() {
    return this.http.get<ServerResInterface<any>>(
      `${environment.AUTHAPIURL}PhaseIII/SyncAssessmentItem`
    )
  }

  syncAssets() {
    return this.http.get<ServerResInterface<any>>(
      `${environment.AUTHAPIURL}PhaseIII/SyncAsset`
    )
  }
}
