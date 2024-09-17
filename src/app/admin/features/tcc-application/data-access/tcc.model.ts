export interface BusinessResInterface {
  businesses: {
    businessRin: string
    businessName: string
    lgaName: string
    companyRin: string
  }[]
  totalCount: number
}

export interface TccAppDetailsInterface {
  employeeName: string
  employeeRin: string
  tccStatus: number
  tccRequest: string
}

export interface TccAppDetailsInterface {
  tccCount: number
  businessName: string
  businessRIN: string
  businessAddress: string
}