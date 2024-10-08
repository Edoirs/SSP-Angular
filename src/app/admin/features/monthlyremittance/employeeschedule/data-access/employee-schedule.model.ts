export interface EmployeeScheduleResInterface {
  businesses: BusinessesResInterface[]
  totalCount: number
}

export interface BusinessesResInterface {
  businessId: number
  companyId: number
  businessRin: string
  companyRin: string
  companyName: string
  businessName: string
  businessAddress: string
  businessLga: string
  noOfEmployees: number
  taxOffice: string
}

export interface EmployeeDetailResInterface {
  employeeRin: string
  employeeId: string
  fullName: string
  totalIncome: number
  non_TaxableIncome: number
  grossIncome: number
  status: string
}

export interface MarkEmployeeInterface {
  source: "formh3" | "monthly"
  businessRin: string
  companyRin: string
  employeeRin?: string
  active: boolean
}

export interface MarkFormH3EmployeeInterface {
  businessRin: string
  companyRin: string
  employeeRin?: string
  active?: boolean
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
  bvn: string
  taxpayer_id: string
  tin: string
  email: string
  designation: string
  title: string
  first_name: string
  last_name: string
  other_name: string
  nationality: string
  gross_income: string
  nhis: number
  nhf: number
  pension: number
  basic: number
  transport: number
  rent: number
  zip_code: string
  other_income: number
  phone: string
  start_month: string
  corporate_id: number
  home_address: string
  life_assurance: number
  lga_code: number
  nin: string
  source: "monthly" | "formh3"
  asset_id: string
  business_id: number
}

export interface SingleEmployeeDetailResInterface {
  id: number
  employeeId: string
  businessId: string
  companyId: string
  basic: number
  rent: number
  transport: number
  ltg?: number
  utility?: number
  meal?: number
  others: number
  nhf: number
  nhis: number
  pension: number
  lifeAssurance: number
  status: boolean
  createdDate: string
  modifiedDate: string
  createdBy?: string
  modifiedBy?: string
}

export interface GetScheduleByDateInterface {
  businessId: string
  companyId: string
  year: number
  month: string
  comment?: string
}

export interface DownloadEmployeePdfInterface {
  businessRin: string
  companyRin: string
  taxMonth: number
  taxYear: string
}