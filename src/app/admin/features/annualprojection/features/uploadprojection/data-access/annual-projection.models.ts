export interface UploadProjectioResInterface {
  records: UploadProjectionInterface[]
  totalCount: number
}

export interface UploadProjectionInterface {
  businessID: string
  businessName: string
  businessRIN: string
  businessAddress: string
  companyRin: string
  companyName: string
  forwardedTO: string
  dueDate: string
  annualReturnStatus: string
  noOfEmployees: string
  dateForwarded: string
  taxYear: string
}
