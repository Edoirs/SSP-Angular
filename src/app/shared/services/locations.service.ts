import {HttpClient} from "@angular/common/http"
import {inject, Injectable} from "@angular/core"
import {environment} from "@environment/environment.dev"
import {BehaviorSubject, switchMap, tap} from "rxjs"

@Injectable({providedIn: "root"})
export class LocationsService {
  private readonly httpClient = inject(HttpClient)

  private zipCodes = new BehaviorSubject<any>(null)
  private stateLocalGovts = new BehaviorSubject<any>(null)

  getZipcodes() {
    // check if zipcode exist in memory before fetching new zipcodes.
    return this.zipCodes.pipe(
      switchMap((data) => {
        if (data) return data
        return this.httpClient
          .get<any>(`${environment.AUTHAPIURL}LocalGovtPostalCode/getall`)
          .pipe(
            tap((data) => {
              this.zipCodes.next(data.data)
            })
          )
      })
    )
  }

  getStateLocalGovts() {
    // check if state lGA exist in memory before fetching new zipcodes.
    return this.stateLocalGovts.pipe(
      switchMap((data) => {
        if (data) return data
        return this.httpClient
          .get<any>(`${environment.AUTHAPIURL}LocalGovernmentArea/getall`)
          .pipe(
            tap((data) => {
              this.stateLocalGovts = data.data
            })
          )
      })
    )
  }
}
