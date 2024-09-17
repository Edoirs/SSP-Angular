export interface EmployeeScheduleResInterface {
  businesses: BusinessesResInterface[]
  totalCount: number
}

export interface BusinessesResInterface {
  businessRin: string
  companyRin: string
  businessName: string
  businessAddress: string
  businessLga: string
  noOfEmployees: number
}

export interface EmployeeDetailResInterface {
  employeeRin: string
  fullName: string
  totalIncome: number
  non_TaxableIncome: number
  grossIncome: number
  status: string
}

export interface MarkEmployeeInterface {
  businessRin: string
  companyRin: string
  activeDet: 0 | 1
  employeeRin?: string
}

export interface EditEmployeeIncomeInterface {
  employeeRin: string
  businessRin: string
  companyRin: string
  basic?: number
  rent?: number
  transport?: number
  ltg?: number
  utility?: number
  meal?: number
  others?: number
  nhf?: number
  nhis?: number
  pension?: number
  lifeAssurance?: number
}

export interface AddEmployeeInterface {
  businessRin: string
  companyRin: string
  title: string
  firstname: string
  surname: string
  othername: string
  phonenumber: string
  email: string
  employeeRin: string
  jtbtin: string
  nin: string
  nationality: string
  homeaddress: string
  designation: string
  lgaCode: string
  zipCode: string
  basic: number
  rent: number
  transport: number
  otherIncome: number
  nhf: number
  nhis: number
  pension: number
  lifeAssurance: number
  ltg: number
  meal: number
  utility: number
  startMonth: string
}

export interface GetScheduleByDateInterface {
  businessRin: string
  companyRin: string
  year: number
  month: string
}

export interface DownloadEmployeePdfInterface {
  businessRin: string
  companyRin: string
  taxMonth: number
  taxYear: string
}