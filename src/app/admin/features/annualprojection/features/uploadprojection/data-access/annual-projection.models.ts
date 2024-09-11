export interface UploadProjectioResInterface {
  records: UploadProjectionInterface[]
  totalCount: number
}

export interface UploadProjectionInterface {
  businessID: string
  businessName: string
  businessRIN: string
  companyRin: string
  forwardedTO: string
  dueDate: string
  annualReturnStatus: string
  noOfEmployees: string
  dateForwarded: string
  taxYear: string
}
