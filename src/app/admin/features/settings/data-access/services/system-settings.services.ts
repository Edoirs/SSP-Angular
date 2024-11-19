import {HttpClient, HttpParams} from "@angular/common/http"
import {inject, Injectable} from "@angular/core"
import {environment} from "@environment/environment"

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

    return this.http.get(`${environment.AUTHAPIURL}PhaseIII/AllUsers`, {params})
  }

  syncRules() {
    return this.http.get(`${environment.AUTHAPIURL}PhaseIII/SyncRules`)
  }

  syncCorporate() {
    return this.http.get(`${environment.AUTHAPIURL}PhaseIII/SyncCooperate`)
  }

  syncItems() {
    return this.http.get(`${environment.AUTHAPIURL}PhaseIII/SyncItems`)
  }

  syncAssets() {
    return this.http.get(`${environment.AUTHAPIURL}PhaseIII/SyncAssessmentItem`)
  }
}
