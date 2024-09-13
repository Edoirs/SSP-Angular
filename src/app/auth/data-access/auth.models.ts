export interface LSAuthCredsInterface {
  userType: string
  otp: string
}

export interface AdminSignupInterface {
  userName: string
  phoneNumber: string
}

export interface AdminInitChangePasswordInterface {
  isAdmin: boolean
  companyRin: string
  phoneNumber: string
}

export interface AdminChangePasswordInterface {
  isAdmin: boolean
  newPassword: string
  companyRin_Phone: string
  otp: number
}

export interface TaxOfficeResInterface {
  taxOfficeId: number
  taxOfficeName: string
  zoneId: number
  zoneName: string
}
