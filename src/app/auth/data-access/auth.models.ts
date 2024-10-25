export interface LSAuthCredsInterface {
  userType: string
  otp: string
}

export interface AdminSignupInterface {
  userName: string
}

export interface AdminInitChangePasswordInterface {
  isAdmin: boolean
  companyRin: string
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

export interface UserRegisterStepOneInterface {
  companyName: string
  companyAddress: string
  phoneNumber: string
  companyRin: string
  screenDet: "LOGIN" | any
}

export interface RegisterStepOneResInterface {
  0: {
    taxPayerId: number
    taxPayerTypeId: number
    taxPayerTypeName: string
    taxPayerName: string
    taxPayerRin: string
    mobileNumber: string
    contactAddress: string
    emailAddress?: string
    tin?: string
    taxOffice: string
    companyListId: number
    dateCreated?: string
    apiId: number
  }
}

export interface AdminStepOneResInterface {
  screenDet: "LOGIN" | "OTP"
  phoneNumber?: string
}