export interface AdminSignupInterface {
  userName: string
  phoneNumber: string
}

export interface AdminChangePasswordInterface {
  isAdmin: boolean
  newPassword: string
  companyRin_Phone: string
  otp: number
}
