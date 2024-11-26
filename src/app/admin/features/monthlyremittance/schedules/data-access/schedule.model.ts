export interface SchedulesResInterface {
  businesses: ScheduleResInterface[]
  totalCount: number
}
export interface ScheduleDetailResInterface {
  records: ScheduleDetailResInterfaceItems[]
  totalRecords: number
}

export interface ScheduleResInterface {
  id: number
  assessementStatus: string
  businessName: string
  businessId: string
  businessRin: string
  companyRin: string
  companyId: string
  companyName: string
  dateForwarded: string
  employeeCount: number
  monthlyTax: number
  taxMonth: string
  taxYear: number
  totalIncome: number
}

export interface ScheduleDetailResInterfaceItems {
  employeeRin: string
  employeeName: string
  totalIncome: number
  grossIncome: number
  nonTaxableIncome: number
  cra: number
  taxFreePay: number
  chargableIncome: number
  monthlyTax: number
}

export interface SendRdmInterface {
  businessId: string
  companyId: string
  taxMonth: string
  taxYear: number
}
