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
