import {HttpClient, HttpParams} from "@angular/common/http"
import {inject, Injectable} from "@angular/core"
import {environment} from "@environment/environment"
import {ServerResInterface} from "@shared/types/server-response.model"
import {
  ChangeUserActivityInterface,
  ChangeUserRoleInterface,
} from "../system-settings.model"

@Injectable({providedIn: "root"})
export class SettingsService {
  private readonly http = inject(HttpClient)

  getUsers(
    pageNumber?: number,
    pageSize?: number,
    searchTerm?: string,
    username?: string
  ) {
    const params = new HttpParams({
      fromObject: {
        ...(pageNumber && {pageNumber}),
        ...(pageSize && {pageSize}),
        ...(searchTerm && {searchTerm}),
        ...(username && {username}),
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

  changeUserActivity(payload: ChangeUserActivityInterface) {
    return this.http.put<ServerResInterface<any>>(
      `${environment.AUTHAPIURL}PhaseIII/ChangeUserActivity`,
      payload
    )
  }

  changeAdminRole(payload: ChangeUserRoleInterface) {
    return this.http.put<ServerResInterface<any>>(
      `${environment.AUTHAPIURL}PhaseIII/ChangeAdminRole`,
      payload
    )
  }
}
