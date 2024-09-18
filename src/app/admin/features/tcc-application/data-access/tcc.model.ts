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

export interface PendingTccResInterface {
  employeeId: string
  employeeRIN: string
  employeeName: string
  tccStatus: string
}

export interface ProcessTccInterface {
  employeeIds: number[]
  busId: string
}

export interface TccAppDetailsInterface {
  tccCount: number
  businessName: string
  businessRIN: string
  businessAddress: string
}