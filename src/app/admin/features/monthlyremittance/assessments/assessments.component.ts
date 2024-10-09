import {Component, inject, OnDestroy, OnInit, signal} from "@angular/core"
import {HttpClient, HttpHeaders} from "@angular/common/http"
import {FormBuilder, FormArray, FormGroup, Validators} from "@angular/forms"
import {ActivatedRoute, Router} from "@angular/router"
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap"
import {SessionService} from "src/app/session.service"
import {environment} from "src/environments/environment"
import Swal from "sweetalert2"
import {DatePipe} from "@angular/common"
// import { DashboardComponent } from "src/app/paye/dashboard/dashboard.component";
import {Title} from "@angular/platform-browser"
import {NgxUiLoaderService} from "ngx-ui-loader"
import {TableImage} from "./utils/assessments.utils"
import {AssessmentService} from "./services/assessment.service"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {PageEvent} from "@angular/material/paginator"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"
import {TokenService} from "@shared/services/token.service"
import {AssessmentResInterface} from "./data-access/assessment.model"
import {MatDialog} from "@angular/material/dialog"
import {ViewAssesmentComponent} from "./ui/view-assessment/view-assessment.component"
import {MaterialDialogConfig} from "@shared/utils/material.utils"

@Component({
  selector: "app-assessments",
  templateUrl: "./assessments.component.html",
  styleUrls: ["./assessments.component.css"],
})
export class AssessmentsComponent implements OnInit, OnDestroy {
  private readonly assessmentService = inject(AssessmentService)
  public readonly tokenService = inject(TokenService)
  private readonly dialog = inject(MatDialog)
  apiUrl!: string
  assessmentsData: any = {}
  objectDisable!: boolean
  dtOptions: any = {}
  modalOptions!: NgbModalOptions
  closeResult!: string
  previewInvoice: boolean = false
  paymentUrl: boolean = false
  assessmentEmployeesData: any
  assessmentForm!: FormGroup
  totalGrossIncome: any
  totalMonthlyTaxDue: any
  submitted: boolean = false
  selectedAssessment: any
  corporateLogo: any
  assessmentYear!: string
  assessmentMonth: any
  showPrintInvoice: boolean = false
  assessmentID: any
  apiPayment: any
  apiInvoice: any
  processInvoiceBtn: boolean = true
  roleID: any
  managerRole: boolean = false
  date!: Date
  corporateID: any = localStorage.getItem("corporate_id")
  title = "PAYE - Assessments Report"
  selectedBusiness: any
  businessesData: any
  businessId: any
  navigationUrl: any
  taxAmountDueToPay: any
  invoiceDataNumber: any
  payItemsArray: any[] = []
  partPaymentItems: any = []
  paymentItemsForm!: FormGroup
  paymentItemIDsArray: any[] = []
  paymentItemsData: any
  assessmentPaymentItems: any[] = []
  invoiceNumber: any
  totaldueBalance: any
  validAmountAssessed: boolean = false
  companyId: any

  assementsData = signal<AssessmentResInterface[] | null>(null)
  pageSize = signal(15)
  totalLength = signal(500)
  pageIndex = signal(0)
  dataLoading = signal(false)
  dataMessage = signal("")

  subs = new SubscriptionHandler()

  constructor(
    private formBuilder: FormBuilder,
    private titleService: Title,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private datepipe: DatePipe,
    private sess: SessionService,
    // private component: DashboardComponent,
    private modalService: NgbModal,
    private ngxService: NgxUiLoaderService
  ) {}

  get paymentItemsFormGroup() {
    return (this.paymentItemsForm.get("paymentItems") as FormArray).controls
  }

  ngOnInit(): void {
    // this.sess.isCorporate();
    this.titleService.setTitle(this.title)
    // this.component.checkIfEditorExist();
    this.initialisePaymentItemsForm()
    this.initialiseForms()

    this.companyId = localStorage.getItem("companyId")
    //console.log("companyId: ", this.companyId)
    this.listenToRoute()

    this.roleID = localStorage.getItem("role_id")
    if (this.roleID === "5" || this.roleID === "6") {
      this.managerRole = true
    }
    this.intialiseTableProperties()
    //console.log("token: ", localStorage.getItem("access_token"))
  }

  ngOnDestroy(): void {
    this.subs.clear()
  }

  initialisePaymentItemsForm() {
    this.paymentItemsForm = this.formBuilder.group({
      paymentItems: this.formBuilder.array([]),
      totalAmountToPay: ["0"],
      totaldueBalance: ["0"],
    })
  }
  intialiseTableProperties() {
    this.modalOptions = {
      backdrop: true,
      centered: true,
      backdropClass: "customBackdrop",
      // size: 'lg'
      size: "xl",
    }

    this.dtOptions = {
      paging: true,
      // scrollX: true,
      search: false,
      pagingType: "full_numbers",
      responsive: true,
      pageLength: 10,
      lengthChange: true,
      processing: true,
      ordering: false,
      info: true,
      dom:
        "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-5'i><'col-sm-7'p>>",
      buttons: [
        {
          extend: "csv",
          className: "btn btn-outline-dark export-btn",
          text: '<i class="fas fa-file-csv"> CSV</i>',
          exportOptions: {columns: [1, 2, 3, 4, 5, 6, 7]},
        },
        // tslint:disable-next-line: max-line-length
        {
          extend: "excel",
          className: "btn btn-outline-dark export-btn",
          text: '<i class="fas fa-file-excel"> Excel</i>',
          exportOptions: {columns: [1, 2, 3, 4, 5, 6, 7]},
        },

        {
          extend: "pdfHtml5",
          className: "btn btn-outline-dark export-btn",
          text: '<i class="fas fa-file-pdf"> PDF</i>',
          orientation: "landscape",
          pageSize: "LEGAL",
          exportOptions: {
            columns: [1, 2, 3, 4, 5, 6, 7],
          },

          customize: function (doc: any) {
            doc.content.splice(1, 0, {
              margin: [0, 0, 0, 10],
              alignment: "left",
              image: TableImage,
            })
          },
        },
      ],
    }
  }

  initialiseForms() {
    this.assessmentForm = this.formBuilder.group({
      dateGenerated: [""],
      companyName: [""],
      taxPayerID: [""],
      phoneNumber: [""],
      balance: [""],
      address: [""],
      invoiceID: [""],
      // corporateId: [''],
    })
  }

  viewBusinessAssessments(modal: any, selectedBusiness: any) {
    this.showModal(modal)
    this.businessId = selectedBusiness.id
    this.getAssessments(this.businessId)
  }

  getSingleBusiness(businessId: any) {
    // this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "Business/GetbyId/" + businessId

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .get<any>(this.apiUrl, {headers: reqHeader})
      .subscribe((data) => {
        //console.log("singleBusinessData: ", data)

        this.selectedBusiness = data.response
        // this.ngxService.stop();
      })
  }

  listenToRoute() {
    this.subs.add = this.route.queryParams.subscribe((params) => {
      this.dataLoading.set(true)
      if (Object.keys(params)) {
        if (params["pageIndex"]) this.pageIndex.set(params["pageIndex"])
        if (params["pageSize"]) this.pageSize.set(params["pageSize"])
        this.subs.add = this.assessmentService
          .getAssessments(this.pageIndex(), this.pageSize())
          .subscribe({
            next: (res) => {
              this.dataLoading.set(false)
              if (res.status === true) {
                this.assementsData.set(res.data)
                this.totalLength.set(res?.data?.length || 0)
              } else {
                this.ngxService.stop()
                this.dataLoading.set(false)
                this.dataMessage.set(res?.message)
                Swal.fire(SweetAlertOptions(res?.message))
              }
            },
            error: (err) => {
              this.dataLoading.set(false)
              this.dataMessage.set(err?.message || err?.error?.message)
              Swal.fire(SweetAlertOptions(err?.message || err?.error?.message))
            },
          })
      }
    })
  }

  handlePageEvent(event: PageEvent) {
    this.router.navigate(["."], {
      relativeTo: this.route,
      queryParams: {
        pageSize: event.pageSize,
        pageIndex: event.pageIndex === 0 ? 1 : event.pageIndex,
      },
    })
  }

  getBusinesses() {
    const obj = {}
    this.ngxService.start()
    this.apiUrl = `${environment.AUTHAPIURL}Business/getallBussinessbycompanyId/${this.companyId}`

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .get<any>(this.apiUrl, {headers: reqHeader})
      .subscribe((data) => {
        //console.log("BusinessData: ", data)

        this.businessesData = data.data
        this.ngxService.stop()
      })
  }

  openDetailView(data: AssessmentResInterface) {
    this.dialog.open(ViewAssesmentComponent, MaterialDialogConfig({data}))
  }

  getAssessments(businessId: any) {
    // this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "assessments-list"

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    let corporateId = localStorage.getItem("corporate_id")

    const obj = {
      corporate_id: corporateId,
      business_id: businessId,
    }
    this.assessmentsData = ""
    this.httpClient
      .post<any>(this.apiUrl, obj, {headers: reqHeader})
      .subscribe((data) => {
        //console.log("assessmentsData: ", data)
        this.assessmentsData = data.data == null ? [] : data.data
        // this.ngxService.stop();
      })
  }

  viewAssessment(modal: any, selectedAssessment: any) {
    //console.log("selectedAssessment: ", selectedAssessment)
    this.assessmentYear = this.getTaxYear(selectedAssessment.due_date)
    this.assessmentMonth = this.getTaxMonth(selectedAssessment.due_date)
    this.totalMonthlyTaxDue = selectedAssessment.monthly_tax_due
    this.invoiceDataNumber = selectedAssessment.invoice_number
    this.invoiceNumber = selectedAssessment.invoice_number
    this.showModal(modal)
    this.getSingleAssessment(selectedAssessment.id)
    this.assessmentID = selectedAssessment.id
  }

  loadSelectedAssessmentData(selectedAssessment: any) {
    this.date = new Date(selectedAssessment.created_at)
    let latest_date = this.datepipe.transform(this.date, "yyyy-MM-dd")

    if (selectedAssessment.invoice == null) {
      this.assessmentForm = this.formBuilder.group({
        dateGenerated: [latest_date],
        dueDate: [selectedAssessment.due_date],
        totalMonthlyTax: [selectedAssessment.monthly_tax_due],
        assessmentStatus: ["No Invoice"],
        companyName: [selectedAssessment.corporate.company_name],
        cacNumber: [selectedAssessment.corporate.cac_number],
        taxPayerID: [selectedAssessment.corporate.taxpayer_id],
        phoneNumber: [selectedAssessment.corporate.phone],
        address: [selectedAssessment.corporate.contact_address],
        balance: [selectedAssessment.monthly_tax_due],
        amountPaid: [0],
        invoiceID: [selectedAssessment?.invoice?.invoice_number],
      })
    } else {
      let assessmentStatus =
        selectedAssessment.invoice.payment_status == 0 ? "Unsettled" : "Settled"
      this.assessmentForm = this.formBuilder.group({
        dateGenerated: [latest_date],
        dueDate: [selectedAssessment.due_date],
        totalMonthlyTax: [selectedAssessment.monthly_tax_due],
        assessmentStatus: [assessmentStatus],
        companyName: [selectedAssessment.corporate.company_name],
        cacNumber: [selectedAssessment.corporate.cac_number],
        taxPayerID: [selectedAssessment.corporate.taxpayer_id],
        address: [selectedAssessment.corporate.contact_address],
        phoneNumber: [selectedAssessment.corporate.phone],
        balance: [
          selectedAssessment.invoice.amount_due -
            selectedAssessment.invoice.amount_paid,
        ],
        amountPaid: [selectedAssessment.invoice.amount_paid],
        invoiceID: [selectedAssessment?.invoice?.invoice_number],
      })
    }

    this.corporateLogo = selectedAssessment.corporate.corporate_logo
  }

  payForAssessment(requestObj: any) {
    // this.ngxService.start();
    this.apiUrl = `${environment.AUTHAPIURL}payments`

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .post<any>(this.apiUrl, requestObj, {headers: reqHeader})
      .subscribe((data) => {
        //console.log("makePaymentForAssessment: ", data)
        if (data.status == true) {
          // this.ngxService.stop();
          Swal.fire({
            icon: "success",
            title: "Success",
            text: data.message,
            showConfirmButton: true,
            timer: 5000,
          })
          this.modalService.dismissAll()
          this.navigationUrl = data.response.redirection_url
          this.goToLink(this.navigationUrl)
        } else {
          // this.ngxService.stop();
          Swal.fire({
            icon: "error",
            title: "Oops..",
            text:
              data.response != null ? data.response[0].message : data.message,

            showConfirmButton: true,
            timer: 5000,
          })
        }
      })
  }
  getAssessmentPaymentItems() {
    // this.ngxService.start();
    this.paymentItemIDsArray = []
    ;(<FormArray>this.paymentItemsForm.get("paymentItems")).clear()
    this.apiUrl = `${environment.AUTHAPIURL}get_assessment/lists/for_payment`

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    let requestObj = {
      invoice_number: this.invoiceNumber,
    }

    this.httpClient
      .post<any>(this.apiUrl, requestObj, {headers: reqHeader})
      .subscribe((data) => {
        //console.log("paymentItemsData: ", data)
        this.paymentItemsData = data.response ? data.response : []
        this.assessmentPaymentItems = data.response?.items
        this.totaldueBalance =
          data?.response?.monthly_tax_due - data?.response?.amount_paid
        // add items to group form
        //console.log("paymentItemsData: ", this.assessmentPaymentItems)
        this.assessmentPaymentItems.forEach((paymentItem) => {
          this.paymentItemIDsArray.push(paymentItem.id)
          ;(<FormArray>this.paymentItemsForm.get("paymentItems")).push(
            this.addPaymentItemFormGroup(paymentItem)
          )
        })

        // this.ngxService.stop();
      })
  }

  addPaymentItemFormGroup(paymentItem: any): FormGroup {
    let paymentItemFormGroup = this.formBuilder.group({
      amountAssessed: [paymentItem.amount_due],
      amountToPay: [
        "",
        [
          Validators.required,
          Validators.pattern(/^(\d{1,19}|\d{0,19}\.\d{1,2})$/),
        ],
      ],
      assessmentItem: [paymentItem.item_name],
      paymentItemId: [paymentItem.id],
    })

    return paymentItemFormGroup
  }

  payAssessmentPaymentItems(modal: any) {
    this.getAssessmentPaymentItems()
    this.submitted = false
    this.paymentItemsForm.reset({
      totalAmountToPay: "",
    })
    this.showModal(modal)
  }

  sendDataToCBS(objArray: any) {
    this.submitted = true

    // this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "send_data_to_cbs"

    const requestObj = {
      invoice_number: this.invoiceNumber,
      assessment_items: objArray,
    }

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.payForAssessment(requestObj)
    // this.httpClient.post<any>(this.apiUrl, obj, { headers: reqHeader }).subscribe((data) => {
    //     //console.log("sendDataToCBS: ", data);
    //     if (data.status == true) {
    //       this.ngxService.stop();
    //       let requestId = data.response.request_id;

    //       const requestObj = {
    //         invoice_number: this.invoiceNumber,
    //         request_id: requestId,
    //       };

    //       this.payForAssessment(requestObj);
    //     }
    //     else {
    //       this.ngxService.stop();
    //       Swal.fire({
    //         icon: "error",
    //         title: "Oops..",
    //         text: data.message,
    //         showConfirmButton: true,
    //         timer: 5000,
    //       });
    //     }
    //   });
  }

  onSubmitPaymentItem(formAllData: any) {
    this.submitted = true

    if (this.paymentItemsForm.invalid) {
      return
    }
    if (this.validAmountAssessed) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter valid amount",
        showConfirmButton: true,
        timer: 5000,
      })
      return
    }
    let paymentItemsArray: any[] = []

    formAllData.paymentItems.forEach((obj: any) => {
      //console.log("item: ", obj)

      let testObj = {
        item_id: obj.paymentItemId,
        amount: Number(obj.amountToPay),
      }

      paymentItemsArray.push(testObj)
    })

    //
    this.sendDataToCBS(paymentItemsArray)
  }

  onclosePay() {
    this.submitted = false
  }
  calculateAmountAssessed(index: any) {
    let amountAssessed = 0
    this.paymentItemIDsArray.forEach((paymentItemId) => {
      let itemID = "amountToPay" + paymentItemId
      let itemVal = Number(
        (<HTMLInputElement>document.getElementById(itemID)).value
      )
      amountAssessed = amountAssessed + itemVal
    })

    amountAssessed = Math.round((amountAssessed + Number.EPSILON) * 100) / 100

    // set amount assessed
    this.setTotalAmountAssessed(amountAssessed)
  }

  setTotalAmountAssessed(amountAssessed: any) {
    this.paymentItemsForm.controls["totalAmountToPay"].setValue(amountAssessed)
  }
  goToLink(url: string) {
    window.open(url, "_blank")
  }
  processInvoice() {
    // this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "invoices"

    const obj = {
      assessment_id: this.assessmentID,
    }
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .post<any>(this.apiUrl, obj, {headers: reqHeader})
      .subscribe((data) => {
        //console.log("invoice: ", data)
        this.invoiceNumber = data.response?.invoice_number
        if (data.status == true) {
          // this.ngxService.stop();
          Swal.fire({
            icon: "success",
            title: "Success",
            text: data.message,
            showConfirmButton: true,
            timer: 5000,
            timerProgressBar: true,
          })
          this.processInvoiceBtn = false
          this.previewInvoice = true
          this.paymentUrl = true
          this.invoiceDataNumber = data.response.invoice_number
          this.apiInvoice = data.response.invoice_preview_url
          this.apiPayment = data.response.payment_url
          this.modalService.dismissAll()
          this.getBusinesses()
        } else {
          // this.ngxService.stop();
          Swal.fire({
            icon: "error",
            title: "Oops..",
            text: data.message,
            showConfirmButton: true,
            timer: 5000,
            timerProgressBar: true,
          })
        }
      })
  }

  getSingleAssessment(assessmentId: any) {
    // this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "assessments/" + assessmentId

    const obj = {
      corporate_id: localStorage.getItem("corporate_id"),
      business_id: this.businessId,
    }
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .post<any>(this.apiUrl, obj, {headers: reqHeader})
      .subscribe((data) => {
        //console.log("singleAssessmentData: ", data)
        this.selectedAssessment = data.response
        this.assessmentEmployeesData = data.response.schedule.schedule_records
        this.invoiceNumber = this.selectedAssessment?.invoice?.invoice_number
        this.loadSelectedAssessmentData(this.selectedAssessment)

        if (data.response.invoice == null) {
          this.processInvoiceBtn = true
          this.previewInvoice = false
          this.paymentUrl = false
          this.objectDisable = true
        } else if (data.response.invoice.payment_status === 0) {
          this.processInvoiceBtn = false
          this.previewInvoice = true
          this.paymentUrl = true
          this.objectDisable = true
          this.apiInvoice = data.response.invoice.invoice_preview_url
          this.apiPayment = data.response.invoice.payment_url
        } else if (data.response.invoice.payment_status === 2) {
          this.processInvoiceBtn = false
          this.previewInvoice = true
          this.paymentUrl = true
          this.objectDisable = false
          this.apiInvoice = data.response.invoice.invoice_preview_url
          this.apiPayment = data.response.invoice.payment_url
        } else if (data.response.invoice.payment_status === 1) {
          this.processInvoiceBtn = false
          this.previewInvoice = true
          this.paymentUrl = false
          this.objectDisable = false
          this.apiInvoice = data.response.invoice.invoice_preview_url
        }
        // this.ngxService.stop();
      })
  }

  getTaxYear(taxDueDate: string): string {
    var taxYear = taxDueDate.split("-", 3)[0]
    return taxYear
  }

  getTaxMonth(taxDueDate: string): string {
    var taxMonth = taxDueDate.split("-", 3)[1]
    this.sess.getAllMonths()
    var monthName = this.sess.getMonthName(taxMonth)
    return monthName
  }

  getEmployeesCount(employees: []): Number {
    if (employees == null || undefined) {
      return 0
    }

    var employeesCount = employees.length
    return employeesCount
  }

  reload() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false
    this.router.onSameUrlNavigation = "reload"
    this.router.navigate(["./"], {relativeTo: this.route})
  }

  showModal(modal: any) {
    this.modalService.open(modal, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
      }
    )
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC"
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop"
    } else {
      return `with: ${reason}`
    }
  }

  onChangeAmount(event: any, data: any) {
    this.payItemsArray = this.assessmentPaymentItems.filter(
      (i) => i.id === data
    )
    if (event > this.payItemsArray[0].amount_due) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Do not enter more than" + " " + this.payItemsArray[0].amount_due,
        showConfirmButton: true,
        timer: 5000,
      })
      this.validAmountAssessed = true
    } else {
      this.validAmountAssessed = false
    }
  }
}
