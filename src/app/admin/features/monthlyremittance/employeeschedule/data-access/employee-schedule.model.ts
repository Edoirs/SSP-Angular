export interface EmployeeScheduleResInterface {
  businesses: {
    businessRin: string
    companyRin: string
    businessName: string
    businessAddress: string
    businessLga: string
    noOfEmployees: number
  }[]
  totalCount: number
}

export interface EmployeeDetailResInterface {
  employeeRin: string
  fullName: string
  totalIncome: number
  non_TaxableIncome: number
  grossIncome: number
  status: string
}
