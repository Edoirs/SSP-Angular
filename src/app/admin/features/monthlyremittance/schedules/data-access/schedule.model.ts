export interface SchedulesResInterface {
  businesses: ScheduleResInterface[]
  totalCount: number
}

export interface ScheduleResInterface {
  assessementStatus: string
  businessName: string
  businessRin: string
  companyRin: string
  companyName: string
  dateForwarded: string
  employeeCount: number
  monthlyTax: number
  taxMonth: string
  taxYear: number
  totalIncome: number
}

export interface ScheduleDetailResInterface {
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
  businessRin: string
  companyRin: string
  taxMonth: string
  taxYear: number
}
