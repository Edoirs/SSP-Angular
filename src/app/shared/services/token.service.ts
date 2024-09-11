import {Injectable} from "@angular/core"


export interface LoginResInterface {
  token: string
  expiryAt: string
  phoneNumber?: string
  companyId: number
  comanyRin: string
  name: string
  email?: string
  taxpayerTypeId: number
  businessRins: {
    id: number
    name: string
    rin: string
  }[]
}

export const LSLoginProps = "lgprops"

@Injectable({providedIn: "root"})
export class TokenService {
  saveLoginResData(data: LoginResInterface) {
    return localStorage.setItem(LSLoginProps, JSON.stringify(data))
  }

  getLoginResData(): LoginResInterface {
    const userRes = localStorage.getItem(LSLoginProps) as string
    return JSON.parse(userRes)
  }

  getAccessToken(): string {
    return this.getLoginResData()?.token
  }

  removeLoginResData() {
    return localStorage.removeItem(LSLoginProps)
  }
}
