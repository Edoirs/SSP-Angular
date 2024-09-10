import {Injectable} from "@angular/core"

@Injectable({providedIn: "root"})
export class UserStateService {
  getUser = () => ({
    companyName: localStorage.getItem("companyName"),
    companyRin: localStorage.getItem("companyRin"),
    companyId: localStorage.getItem("companyId"),
    email: localStorage.getItem("email"),
    phone: localStorage.getItem("phone"),
  })
}
