import {Injectable} from "@angular/core"
import {Subject} from "rxjs"

@Injectable({providedIn: "root"})
export class EmployeeStateService {
  readonly generalState = new Subject()

  reloadParent() {
    return this.generalState.next(null)
  }
}
