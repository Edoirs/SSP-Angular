import {Component, inject, OnInit, signal} from "@angular/core"
import {HttpClient, HttpHeaders} from "@angular/common/http"
import {FormBuilder, FormGroup, Validators} from "@angular/forms"
import {Router} from "@angular/router"
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap"
import {SessionService} from "src/app/session.service"
import {environment} from "src/environments/environment"
import Swal from "sweetalert2"
// import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import {DatePipe} from "@angular/common"
// import { DashboardComponent } from "src/app/paye/dashboard/dashboard.component";
import {Title} from "@angular/platform-browser"
import {NgxUiLoaderService} from "ngx-ui-loader"
import {TokenService} from "@shared/services/token.service"
import {MatDialog} from "@angular/material/dialog"
import {ViewFormH1EmployeeComponent} from "./ui/view-employee/view-employee.component"
import {MaterialDialogConfig} from "@shared/utils/material.utils"
import {FormDtH1Image} from "./utils/annual-return.utils"

@Component({
  selector: "app-annualreturnassessments",
  templateUrl: "./annualreturnassessments.component.html",
  styleUrls: ["./annualreturnassessments.component.css"],
})
export class AnnualreturnassessmentsComponent implements OnInit {
  public readonly tokenService = inject(TokenService)
  private readonly dialog = inject(MatDialog)

  apiUrl!: string
  assessmentsData: any
  assessmentEmployeesData: any
  reassessmentAppealsData: any
  myForm!: FormGroup
  assessmentForm!: FormGroup
  reassessmentForm!: FormGroup
  appealForm!: FormGroup

  totalGrossIncome: any
  totalMonthlyTaxDue: any
  objectDisable!: boolean
  submitted: boolean = false
  selectedAssessment: any
  assessmentId: any
  months: {monthId: string; monthName: string}[] = []
  date!: Date
  title = "PAYE - Annual Return Report"
  businessesData: any
  selectedBusiness: any
  dtOptions: any = {}
  modalOptions!: NgbModalOptions
  closeResult!: string
  businessId: any
  companyId: any = 1
  files: any
  filePath: string[] = []

  comingSoon = signal(true)

  constructor(
    private formBuilder: FormBuilder,
    private titleService: Title,
    // private spinnerService: Ng4LoadingSpinnerService,
    private httpClient: HttpClient,
    private router: Router,
    private datepipe: DatePipe,
    // private component: DashboardComponent,
    private sess: SessionService,
    private modalService: NgbModal,
    private ngxService: NgxUiLoaderService
  ) {}

  get f() {
    return this.appealForm.controls
  }

  ngOnInit(): void {
    this.titleService.setTitle(this.title)

    // this.companyId = localStorage.getItem("companyId")

    // this.getBusinesses()

    // this.initialiseForms()

    this.modalOptions = {
      backdrop: true,
      centered: true,
      backdropClass: "customBackdrop",
      // size: 'lg'
      size: "xl",
    }

    this.dtOptions = {
      paging: true,
      scrollX: true,
      pagingType: "full_numbers",
      responsive: true,
      pageLength: 10,
      lengthChange: true,
      processing: true,
      ordering: false,
      info: true,
      //   columnDefs: [
      //     {
      //         //targets: [ 10 ],
      //         visible: false,
      //         searchable: false
      //     }
      // ],
      dom:
        "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-5'i><'col-sm-7'p>>",
      buttons: [
        // { extend: 'copy',  className: 'btn btn-outline-dark', text: '<i class="far fa-copy"> Copy</i>' },
        // tslint:disable-next-line: max-line-length
        {
          extend: "csv",
          className: "btn btn-outline-dark export-btn",
          text: '<i class="fas fa-file-csv"> CSV</i>',
          exportOptions: {columns: [0, 1, 2, 3, 4, 5]},
        },
        // tslint:disable-next-line: max-line-length
        {
          extend: "excel",
          className: "btn btn-outline-dark export-btn",
          text: '<i class="fas fa-file-excel"> Excel</i>',
          exportOptions: {columns: [0, 1, 2, 3, 4, 5]},
        },

        {
          extend: "pdfHtml5",
          className: "btn btn-outline-dark export-btn",
          text: '<i class="fas fa-file-pdf"> PDF</i>',
          orientation: "portrait",
          pageSize: "LEGAL",
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5],
          },

          customize: function (doc: any) {
            doc.content.splice(1, 0, {
              margin: [0, 0, 0, 10],
              alignment: "left",
              image: FormDtH1Image,
            })
          },
        },
      ],
    }
  }

  initialiseForms() {
    this.assessmentForm = this.formBuilder.group({
      dateGenerated: [""],
      dueDate: [""],
      annualReturnID: [""],
      assessmentStatus: [""],
      approvalStatus: [""],
      businessName: [""],
      businessRIN: [""],
      annualTaxDue: [""],
    })

    this.reassessmentForm = this.formBuilder.group({
      paymentStatus: [""],
      dateGenerated: [""],
    })

    this.appealForm = this.formBuilder.group({
      message: ["", [Validators.required]],
      messageTitle: ["", [Validators.required]],
      invoiceNumber: [""],
      date: [""],
      myfile: ["", Validators.required],
    })
  }

  getAllMonths() {
    this.months = [
      {monthId: "01", monthName: "January"},
      {monthId: "02", monthName: "February"},
      {monthId: "03", monthName: "March"},
      {monthId: "04", monthName: "April"},
      {monthId: "05", monthName: "May"},
      {monthId: "06", monthName: "June"},
      {monthId: "07", monthName: "July"},
      {monthId: "08", monthName: "August"},
      {monthId: "09", monthName: "September"},
      {monthId: "10", monthName: "October"},
      {monthId: "11", monthName: "November"},
      {monthId: "12", monthName: "December"},
    ]
  }

  getMonthName(monthId: string): string {
    var monthName = this.months.filter((m) => m.monthId == monthId)[0].monthName
    return monthName
  }

  getAssessments() {
    this.ngxService.start()
    this.apiUrl = `${environment.AUTHAPIURL}FormH/get-FiledH1bybusinessId/${this.businessId}/bycompanyId/${this.companyId}`

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .get<any>(this.apiUrl, {headers: reqHeader})
      .subscribe((data: any) => {
        // console.log("assessmentsData: ", data)
        this.assessmentsData = data == null ? [] : data
        this.ngxService.stop()
      })
  }

  viewAssessment(modal: any, selectedAssessment: any) {
    // console.log("selectedAssessment: ", selectedAssessment)
    this.assessmentId = selectedAssessment.id
    this.showModal(modal)
    this.getSingleAssessment(selectedAssessment.id)
  }

  loadSelectedAssessmentData(selectedAssessment: any) {
    let assessmentStatus =
      selectedAssessment.status == 0 ? "In Active" : "Active"
    let approvalStatus =
      selectedAssessment.revenue_board_approval_status == 0
        ? "In Progress"
        : "Approved"

    this.date = new Date(selectedAssessment.created_at)
    let latest_date = this.datepipe.transform(this.date, "yyyy-MM-dd")

    this.assessmentForm = this.formBuilder.group({
      dateGenerated: [latest_date],
      dueDate: [selectedAssessment.due_date],
      annualReturnID: [selectedAssessment.annual_return_id],
      assessmentStatus: [assessmentStatus],
      approvalStatus: [approvalStatus],
      businessName: [selectedAssessment.corporate_id],
      businessRIN: [selectedAssessment.corporate_id],
      annualTaxDue: [selectedAssessment.annual_tax_due],
    })

    this.assessmentEmployeesData = selectedAssessment.annualReturnRecords
  }

  getSingleAssessment(assessmentId: any) {
    this.ngxService.start()
    // this.apiUrl = environment.AUTHAPIURL + "annual-return-assessments/" + assessmentId;
    this.apiUrl = `${environment.AUTHAPIURL}FormH/get-FiledH1byId/${assessmentId}`

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .get<any>(this.apiUrl, {headers: reqHeader})
      .subscribe((data: any) => {
        // console.log("singleAssessmentData: ", data)
        this.selectedAssessment = data.response
        this.loadSelectedAssessmentData(this.selectedAssessment)
        this.ngxService.stop()
      })
  }

  generateReassessment(modal: any) {
    this.showModal(modal)
  }

  onSubmitReassessment(formAllData: any) {
    this.submitted = true

    // stop the process here if form is invalid
    if (this.reassessmentForm.invalid) {
      return
    }

    let corporateId = localStorage.getItem("corporate_id")

    const obj = {
      comment: formAllData.comment,
      annual_return_assessment_id: this.assessmentId,
      corporate_id: corporateId,
      business_id: this.businessId,
      approved: true,
    }

    // console.log("reassessmentFormData: ", obj)
    this.postGenerateReassessment(obj)
  }

  postGenerateReassessment(jsonData: any) {
    // this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "reassessments"

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .post<any>(this.apiUrl, jsonData, {headers: reqHeader})
      .subscribe((data) => {
        // console.log("reassessmentApiResponseData: ", data)

        if (data.status === true) {
          // Rest form fithout errors
          this.reassessmentForm.reset()
          Object.keys(this.reassessmentForm.controls).forEach((key) => {
            this.reassessmentForm.get(key)?.setErrors(null)
          })

          Swal.fire({
            icon: "success",
            title: "Success",
            text:
              data.response != null && data.response[0] != undefined
                ? data.response[0].message
                : data.message,
            showConfirmButton: true,
            timer: 5000,
            timerProgressBar: true,
          })

          this.getAssessments()
          // this.ngxService.stop();
          this.modalService.dismissAll()
        } else {
          // this.ngxService.stop();

          Swal.fire({
            icon: "error",
            title: "Oops...",
            text:
              data.response != null && data.response[0] != undefined
                ? data.response[0].message
                : data.message,
            showConfirmButton: true,
            timer: 5000,
            timerProgressBar: true,
          })
        }
      })
  }

  getBusinesses() {
    const obj = {}
    this.ngxService.start()
    this.apiUrl = `${environment.AUTHAPIURL}SSP/FormH1/getallformh1bycompanyId/${this.companyId}`

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .get<any>(this.apiUrl, {headers: reqHeader})
      .subscribe((data) => {
        // console.log("BusinessData: ", data)

        this.businessesData = data.data
        this.ngxService.stop()
      })
  }

  getSingleBusiness(businessId: any) {
    this.ngxService.start()
    this.apiUrl = environment.AUTHAPIURL + "Business/GetbyId/" + businessId

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .get<any>(this.apiUrl, {headers: reqHeader})
      .subscribe((data) => {
        // console.log("singleBusinessData: ", data)
        this.selectedBusiness = data.response
        this.ngxService.stop()
      })
  }

  openViewEmployee(data: any) {
    this.dialog.open(ViewFormH1EmployeeComponent, MaterialDialogConfig(data))
  }

  viewBusinessAnnualReturn(modal: any, data: any) {
    this.businessId = data.business_id
    this.getAssessments()
    this.showModal(modal)
  }

  generateAppeal(modal: any) {
    this.showModal(modal)
  }

  onSubmitAppeal(formAllData: any) {
    this.submitted = true

    // stop the process here if form is invalid
    if (this.appealForm.invalid) {
      return
    }

    // let corporateId = localStorage.getItem('admin_corporate_id');
    this.apiUrl = environment.AUTHAPIURL + "file/uploadMultiple"

    const formData = new FormData()
    for (var i = 0; i < this.files.length; i++) {
      formData.append("file[]", this.files[i].file)
    }

    const config = {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    }

    // this.ngxService.start();

    this.httpClient
      .post<any>(this.apiUrl, formData, config)
      .subscribe((data) => {
        // console.log(data)
        if (data.status === true) {
          Object.keys(this.appealForm.controls).forEach((key) => {
            this.appealForm.get(key)?.setErrors(null)
          })

          this.files = []
          this.filePath = []

          const obj = {
            message: formAllData.message,
            message_title: formAllData.messageTitle,
            // reassessment_id: this.reassessmentId,
            // corporate_id: this.corporateId,
            business_id: this.businessId,
            comment: formAllData.message,
            // submitted: true,
            file_url: data.response.url,
          }

          // console.log("appealFormFormData: ", obj)
          this.postGenerateAppeal(obj)
        } else {
          // this.ngxService.stop();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.message,
            showConfirmButton: true,
            timer: 5000,
          })
        }
      })
  }

  postGenerateAppeal(jsonData: any) {
    // this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "reassessment-appeals"

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .post<any>(this.apiUrl, jsonData, {headers: reqHeader})
      .subscribe((data) => {
        // console.log("appealApiResponseData: ", data)

        if (data.status === true) {
          // Rest form fithout errors
          this.appealForm.reset()
          Object.keys(this.appealForm.controls).forEach((key) => {
            this.appealForm.get(key)?.setErrors(null)
          })

          Swal.fire({
            icon: "success",
            title: "Success",
            text:
              data.response != null && data.response[0] != undefined
                ? data.response[0].message
                : data.message,
            showConfirmButton: true,
            timer: 5000,
          })

          // this.getReassessments(this.businessId);
          // this.ngxService.stop();
          this.modalService.dismissAll()
        } else {
          // this.ngxService.stop();

          Swal.fire({
            icon: "error",
            title: "Oops...",
            text:
              data.response != null && data.response[0] != undefined
                ? data.response[0].message
                : data.message,
            showConfirmButton: true,
            timer: 5000,
          })
        }
      })
  }

  onFileChange(event: any) {
    // if (event.target.files.length > 0) {
    //   const file = event.target.files[0];
    //   this.file = event.target.files[0];
    //   this.appealForm.get("myfile").setValue(file);
    // }
    for (var i = 0; i < event.target.files.length; i++) {
      this.filePath.push(event.target.files[i].name)

      const fileObj = {
        filename: event.target.files[i].name,
        file: event.target.files[i],
      }
      this.files.push(fileObj)
    }
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
}
