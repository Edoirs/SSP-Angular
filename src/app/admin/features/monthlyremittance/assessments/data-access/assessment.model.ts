export interface AssessmentResInterface {
  companyRin?: string
  companyName?: string
  businessRin: string
  businessId: string
  businessName: string
  dateGenerated: string
  taxMonth: string
  taxYear: number
  listofEmployees: number
  assessmentRefNo: string
  assessmentRefId: number
  totalMonthlyTax: number
  amountPaid: number
  balance: number
  paymentStatus?: string
}
