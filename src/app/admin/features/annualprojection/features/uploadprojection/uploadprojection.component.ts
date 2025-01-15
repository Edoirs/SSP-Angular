import {Component, computed, inject, OnInit, signal} from "@angular/core"
import {HttpClient, HttpHeaders} from "@angular/common/http"
import {FormBuilder, FormGroup, Validators} from "@angular/forms"
import {ActivatedRoute, Router} from "@angular/router"
import {
  NgbModalOptions,
  ModalDismissReasons,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap"
// import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
// import { DashboardComponent } from "src/app/paye/dashboard/dashboard.component";
import {SessionService} from "src/app/session.service"
import {UtilityService} from "src/app/utility.service"
import {environment} from "src/environments/environment"
import Swal from "sweetalert2"
import {NgxUiLoaderService} from "ngx-ui-loader"
import {DtImage} from "./utils/upload-project.utils"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"
import {MarkFormH3EmployeeInterface} from "@admin-pages/monthlyremittance/employeeschedule/data-access/employee-schedule.model"
import {EmployeeScheduleService} from "@admin-pages/monthlyremittance/employeeschedule/services/employee-schedule.service"
import {TokenService} from "@shared/services/token.service"
import {AnnualProjectionService} from "@admin-pages/annualprojection/data-access/services/annual-projection.service"

@Component({
  selector: "app-uploadprojection",
  templateUrl: "./uploadprojection.component.html",
  styleUrls: ["./uploadprojection.component.css"],
})
export class UploadprojectionComponent implements OnInit {
  private readonly employeeScheduleService = inject(EmployeeScheduleService)
  private readonly annualProjectionService = inject(AnnualProjectionService)
  readonly tokenService = inject(TokenService)
  myForm!: FormGroup
  submitted: boolean = false
  files: any
  file: any
  apidata: any
  apiUrl!: string
  isResponse = 0
  isError = 0
  roleID: any
  corporateId = localStorage.getItem("corporate_id")
  filePath: any
  rows: string[] = []
  error: any
  errorRow!: string
  businessesData: any
  selectedBusiness: any
  dtOptions: any = {}
  modalOptions!: NgbModalOptions
  closeResult!: string
  businessId: any
  companyId: any
  companyID?: string
  fileFormH3Form!: FormGroup
  corporateForm!: FormGroup
  apidataEmpty: boolean = false
  companyName: any
  companyRIN: any
  editEmployeeModalRef: any
  selectedEmployeeId: any
  selectedScheduleRecordId: any
  RIN: any
  NIN: any
  JTBTIN: any
  homeAddress: any
  phoneNumber: any
  totalMonthsPaid: any
  CRA: any
  annualReturnForm!: FormGroup
  disableEmployeeControl: any = false
  taxpayerID: any
  assessmentYears: any[] = []

  annualReturnsData = signal<any[] | null>(null)

  anyEmployeeActive = computed(
    () =>
      !!this.annualReturnsData()?.find(
        (employee) => employee?.statusName?.toLowerCase() === "active"
      )
  )

  btnLoading = signal(false)

  subs = new SubscriptionHandler()

  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    // private component: DashboardComponent,
    private formBuilder: FormBuilder,
    private sess: SessionService,
    private utilityService: UtilityService,
    // private spinnerService: Ng4LoadingSpinnerService
    private ngxService: NgxUiLoaderService
  ) {}

  get f() {
    return this.myForm.controls
  }

  ngOnInit() {
    this.loadAssessmentYears()
    this.initialiseForms()
    this.companyId = localStorage.getItem("companyId")
    // console.log("companyId: ", this.companyId)
    // this.getBusinesses()
    this.listenToRoute()
    this.roleID = localStorage.getItem("role_id")

    this.companyName = localStorage.getItem("companyName")
    // console.log("companyName: ", this.companyName)

    this.companyRIN = localStorage.getItem("companyRIN")
    // console.log("companyRIN: ", this.companyRIN)

    this.modalOptions = {
      backdrop: true,
      centered: true,
      backdropClass: "customBackdrop",
      // size: 'lg'
      size: "xl",
    }

    this.dtOptions = {
      paging: false,
      scrollX: true,
      pagingType: "simple_numbers",
      responsive: true,
      pageLength: 100,
      lengthChange: true,
      processing: true,
      ordering: false,
      info: false,
      dom:
        "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-5'i><'col-sm-7'p>>",
      buttons: [
        {
          extend: "csv",
          className: "btn btn-outline-dark export-btn",
          text: '<i class="fas fa-file-csv"> CSV</i>',
          exportOptions: {columns: [0, 1, 2, 3, 4, 5]},
        },
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
              image: DtImage,
            })
          },
        },
      ],
    }
  }

  initialiseForms() {
    this.myForm = this.formBuilder.group({
      myfile: ["", Validators.required],
    })

    this.fileFormH3Form = this.formBuilder.group({
      scheduleYear: [
        "",
        [
          Validators.required,
          // Validators.pattern(/^[0-9\s]*$/),
          // Validators.minLength(4),
          // Validators.maxLength(4),
        ],
      ],
      // scheduleMonthId: ['', Validators.required],
    })

    this.corporateForm = this.formBuilder.group({
      companyName: [""],
      companyID: [""],
      businessName: [""],
      businessID: [""],
    })
  }

  listenToRoute() {
    this.subs.add = this.route.queryParams.subscribe((params) => {
      this.ngxService.start()
      if (Object.keys(params)) {
        this.subs.add = this.annualProjectionService
          .getBusinesses(
            this.companyId,
            "1",
            "100",
            params["busRin"] && params["busRin"],
            params["businessName"] && params["businessName"],
            params["companyRin"] && params["companyRin"],
            params["companyName"] && params["companyName"]
          )
          .subscribe({
            next: (res) => {
              this.ngxService.stop()

              if (res.status === true) {
                this.businessesData = res?.data?.result
              } else {
                Swal.fire(SweetAlertOptions(res?.message))
              }
            },
            error: (err) => {
              this.ngxService.stop()

              Swal.fire(SweetAlertOptions(err?.error?.message || err?.message))
            },
          })
      }
    })
  }

  getBusinesses() {
    this.ngxService.start()

    this.subs.add = this.annualProjectionService
      .getBusinesses(this.companyId, "1", "100")
      .subscribe((res) => {
        this.businessesData = res?.data?.result
        this.ngxService.stop()
      })
  }

  getSingleBusiness(businessId: any) {
    this.ngxService.start()
    this.apiUrl = environment.AUTHAPIURL + "Business/GetbyId/" + businessId

    const config = {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    }

    this.httpClient.get<any>(this.apiUrl, config).subscribe((data) => {
      // console.log("singleBusinessData: ", data)

      this.selectedBusiness = data.response
      this.ngxService.stop()
    })
  }

  viewBusinessProjection(modal: any, data: any) {
    this.businessId = data.businessID
    this.loadSelectedBusinessData(data)
    this.getAnnualReturns(this.businessId, this.companyId)
    this.showModal(modal)
  }

  submit() {
    this.submitted = true
    if (this.myForm.invalid) {
      return
    }
    // tslint:disable-next-line: max-line-length
    // In Angular 2+, it is very important to leave the Content-Type empty. If you set the 'Content-Type' to 'multipart/form-data' the upload will not work !

    const formData = new FormData()
    formData.append("File", this.myForm.get("myfile")?.value)
    // formData.append("year", this.myForm.get("year")?.value);
    formData.append("CompanyId", this.companyId)
    formData.append("BusinessId", this.businessId)

    this.ngxService.start()

    this.subs.add = this.annualProjectionService
      .bulkUploadAnnualProjection(formData)
      .subscribe((res) => {
        // console.log(res)
        // Clear form Value Without any Error
        this.myForm.reset()
        Object.keys(this.myForm.controls).forEach((key) => {
          this.myForm.get(key)?.setErrors(null)
        })

        if (res.status == true) {
          this.ngxService.stop()
          this.modalService.dismissAll()
          this.reload()
          this.isResponse = 1
          this.filePath = null

          Swal.fire({
            icon: "success",
            title: "Success",
            html: this.errorHandler(res.message),
            showConfirmButton: true,
            timer: 500000,
            timerProgressBar: true,
          })
        } else {
          this.file = null
          this.filePath = null

          this.myForm.get("myfile")?.setValue(null)
          this.myForm = this.formBuilder.group({
            myfile: ["", Validators.required],
          })
          this.ngxService.stop()
          this.reload()
          Swal.fire({
            icon: "error",
            title: "Validation not passed",
            // html: '<div class="text-left ml-3 ">' + this.columnError.join('<br />') + '</div>' ,
            html: this.errorHandler(res.message),
            showConfirmButton: true,
            timer: 25000,
            timerProgressBar: true,
          })
        }
      })
  }

  deleteBusiness(data: any) {
    this.businessId = data.businessID
    this.deleteEmployeesRecords()
    // this.showModal(modal);
  }

  deleteEmployeesRecords() {
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.apiUrl = `${environment.AUTHAPIURL}FormH3/delete-TaxpayerH3bybusinessId/${this.businessId}/bycompanyId/${this.companyId}`

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        this.httpClient
          .delete<any>(this.apiUrl, {headers: reqHeader})
          .subscribe((data) => {
            // console.log(data)
            if (data.status == true) {
              Swal.fire({
                icon: "success",
                title: "Success",
                text: "Employees Successfully Deleted",
                showConfirmButton: false,
                timer: 1500,
              })
              this.getBusinesses()
            } else {
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
    })
  }

  loadSelectedBusinessData(selectedBusiness: any) {
    // console.log("selectedProjection: ", selectedBusiness)
    this.corporateForm = this.formBuilder.group({
      companyName: [selectedBusiness?.companyName || ""],
      companyID: [selectedBusiness?.companyRIN || ""],
      businessName: [selectedBusiness?.businessName || ""],
      businessID: [selectedBusiness?.businessRIN || ""],
    })
  }

  getAnnualReturns(businessId: any, companyId: any) {
    this.ngxService.start()
    this.annualReturnsData.set(null)
    this.apiUrl = `${environment.AUTHAPIURL}FormH3/getalluplaodedformh3bycompanyId/${this.companyId}/bybusinessId/${businessId}`

    this.httpClient.get<any>(this.apiUrl).subscribe((data) => {
      // console.log("annualReturnsDataU: ", data)
      this.annualReturnsData.set(data)

      if (data?.length > 0) {
        this.apidataEmpty = true
      } else {
        this.apidataEmpty = false
      }

      this.ngxService.stop()
    })
  }

  createSchedule(modal: any, data: any) {
    this.businessId = data.businessID
    this.companyID = data.companyID
    this.loadSelectedBusinessData(data)
    this.getAnnualReturns(this.businessId, this.companyId)
    this.showModal(modal)
  }

  fileFormH3(modal: any) {
    // this.businessId = data.businessID;
    // this.loadSelectedBusinessData(data);
    // this.getAnnualReturns(this.businessId, this.companyId);
    this.showModal(modal)
  }

  onSubmitFileFormH3(formAllData: any) {
    this.submitted = true

    // stop the process here if form is invalid
    if (this.fileFormH3Form.invalid) {
      return
    }

    // let corporateId = localStorage.getItem("corporate_id");
    const obj = {
      taxYear: formAllData.scheduleYear,
      businessId: this.businessId,
      companyId: this.companyId,
    }

    // console.log("scheduleFormData: ", obj)
    // this.postForwardSchedule(obj);
    this.postFileFormH3(obj)
  }

  postFileFormH3(jsonData: any) {
    this.ngxService.start()
    this.apiUrl = `${environment.AUTHAPIURL}FormH3/FileFormH3`

    this.httpClient.post<any>(this.apiUrl, jsonData).subscribe((data) => {
      // console.log("scheduleApiResponseData: ", data)
      if (data.status === true) {
        // Rest form fithout errors
        this.fileFormH3Form.reset()
        Object.keys(this.fileFormH3Form.controls).forEach((key) => {
          this.fileFormH3Form.get(key)?.setErrors(null)
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

        this.ngxService.stop()
        this.modalService.dismissAll()
        this.router.navigate(["/admin", "pending-projection"])
        // this.getAnnualReturns(this.businessId, this.companyId);
      } else {
        this.ngxService.stop()
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

  editAnnualReturn(modal: any, selectedAnnualReturn: any) {
    // console.log("selectedAnnualReturn: ", selectedAnnualReturn)
    this.selectedEmployeeId = selectedAnnualReturn.employee_id
    this.selectedScheduleRecordId = selectedAnnualReturn.id

    this.RIN = selectedAnnualReturn.rin
    this.NIN = selectedAnnualReturn.nin
    this.JTBTIN = selectedAnnualReturn.jtbtin
    this.homeAddress = selectedAnnualReturn.homeaddress
    this.phoneNumber = selectedAnnualReturn.phonenumber
    this.totalMonthsPaid = selectedAnnualReturn.numberOfMonths
    this.CRA = selectedAnnualReturn.consolidatedreliefallowancecra
    this.taxpayerID = selectedAnnualReturn.taxPayerId

    let annualGross =
      selectedAnnualReturn.rent +
      selectedAnnualReturn.basic +
      selectedAnnualReturn.transport +
      selectedAnnualReturn.otherIncome

    this.annualReturnForm = this.formBuilder.group({
      taxPayerID: [selectedAnnualReturn.rin],

      basicIncome: [
        selectedAnnualReturn.basic,
        [
          Validators.required,
          Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,2})$/),
        ],
      ],
      pension: [
        selectedAnnualReturn.pension,
        [Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,2})$/)],
      ],
      NHF: [
        selectedAnnualReturn.nhf,
        [Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,2})$/)],
      ],
      NHIS: [
        selectedAnnualReturn.nhis,
        [Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,2})$/)],
      ],
      CRA: [
        selectedAnnualReturn.cra,
        [Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,3})$/)],
      ],
      rent: [
        selectedAnnualReturn.rent,
        [
          // Validators.required,
          Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,2})$/),
        ],
      ],
      transport: [
        selectedAnnualReturn.transport,
        [
          // Validators.required,
          Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,2})$/),
        ],
      ],
      otherIncome: [
        selectedAnnualReturn.otherIncome,
        [
          // Validators.required,
          Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,2})$/),
        ],
      ],
      lifeAssurance: [
        selectedAnnualReturn.lifeassurance,
        [Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,2})$/)],
      ],

      // monthlyIncome: [
      //   selectedAnnualReturn.totalmonthspaid,
      //   [Validators.required, Validators.pattern(/^[0-9\s]*$/)],
      // ],
      annualGrossIncome: [
        annualGross,
        [Validators.required, Validators.pattern(/^[0-9\s]*$/)],
      ],
      annualTaxPaid: [
        selectedAnnualReturn.annualtaxpaid,
        [Validators.required, Validators.pattern(/^[0-9\s]*$/)],
      ],
      months: [
        selectedAnnualReturn.totalmonthspaid,
        [
          Validators.required,
          Validators.pattern(/^[0-9\s]*$/),
          Validators.maxLength(2),
        ],
      ],
      firstName: [
        selectedAnnualReturn.firstname,
        [
          Validators.required,
          Validators.pattern("[a-zA-Z ]*"),
          Validators.maxLength(30),
        ],
      ],
      middleName: [
        selectedAnnualReturn.othername,
        [
          // Validators.required,
          Validators.pattern("[a-zA-Z ]*"),
          Validators.maxLength(30),
        ],
      ],
      surname: [
        selectedAnnualReturn.surname,
        [
          Validators.required,
          Validators.pattern("[a-zA-Z ]*"),
          Validators.maxLength(30),
        ],
      ],
      nationality: [selectedAnnualReturn.nationality, Validators.required],
      designation: [selectedAnnualReturn.designation, Validators.required],
    })

    this.editEmployeeModalRef = this.modalService.open(modal, this.modalOptions)
  }

  onSubmitAnnualReturn(formAllData: any) {
    this.submitted = true

    if (this.annualReturnForm.invalid) {
      return
    }

    const obj = {
      // taxPayerId: formAllData.taxPayerID,
      taxPayerId: this.taxpayerID,
      basic: formAllData.basicIncome.toString(),
      rent: formAllData.rent.toString(),
      transport: formAllData.transport.toString(),
      otherIncome: formAllData.otherIncome.toString(),
      companyId: this.companyId,
      businessId: this.businessId,
      pension: formAllData.pension.toString(),
      nhis: formAllData.NHIS.toString(),
      nhf: formAllData.NHF.toString(),
      lifeassurance: formAllData.lifeAssurance.toString(),
      // monthly_income: formAllData.monthlyIncome,
      annual_gross_income: formAllData.annualGrossIncome.toString(),
      // annual_tax_paid: formAllData.annualTaxPaid,
      months: formAllData.months,
      // schedule_record_id: this.selectedScheduleRecordId,

      firstname: formAllData.firstName,
      othername: formAllData.middleName,
      surname: formAllData.surname,
      nationality: formAllData.nationality,
      designation: formAllData.designation,

      annualtaxpaid: formAllData.annualTaxPaid.toString(),
      rin: this.RIN,
      jtbtin: this.JTBTIN,
      nin: this.NIN,
      homeaddress: this.homeAddress,
      totalmonthspaid: this.totalMonthsPaid.toString(),
      phonenumber: this.phoneNumber,
      consolidatedreliefallowancecra: "0",
      // consolidatedreliefallowancecra: this.CRA,
    }

    // console.log("annualReturnFormData: ", obj)
    this.postUpdateAnnualReturn(obj)
  }

  postUpdateAnnualReturn(jsonData: any) {
    this.ngxService.start()
    this.apiUrl = `${environment.AUTHAPIURL}FormH3/update-TaxpayerH3`

    this.httpClient.put<any>(this.apiUrl, jsonData).subscribe((data) => {
      // console.log("annualReturnResponseData: ", data)
      this.submitted = false

      if (data.status === true) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Annual Return has been updated successfully!",
          showConfirmButton: true,
          timer: 5000,
        })

        this.getAnnualReturns(this.businessId, this.companyId)
        this.editEmployeeModalRef.close()
        this.ngxService.stop()
      } else {
        this.ngxService.stop()

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.response != null ? data.response[0].message : data.message,
          showConfirmButton: true,
          timer: 5000,
        })
      }
    })
  }

  markAllEmployeeInActive(activate?: boolean) {
    this.btnLoading.set(true)
    const payload = {
      companyId: this.companyID?.toString(),
      businessId: this.businessId,
      active: activate || false,
    } as MarkFormH3EmployeeInterface
    const ask = window.confirm(
      "Are you sure you want to mark all employees inactive?"
    )
    if (ask) {
      this.subs.add = this.employeeScheduleService
        .markFormH3EmployeeInactive(payload)
        .subscribe({
          next: (res) => {
            this.btnLoading.set(false)
            if (res.status) {
              Swal.fire(SweetAlertOptions(res?.message, true))
              this.getAnnualReturns(this.businessId, this.companyId)
            } else {
              Swal.fire(SweetAlertOptions(res?.message))
            }
          },
          error: (err) => {
            this.btnLoading.set(false)
            Swal.fire(SweetAlertOptions(err?.error?.message || err?.message))
          },
        })
    }
    this.btnLoading.set(false)
  }

  switchStatus(event: any, data?: any) {
    const status = event.target.checked as boolean
    const payload = {
      companyId: data.companyId,
      businessId: data.businessId,
      employeeRin: data.rin,
      active: status,
    } as MarkFormH3EmployeeInterface
    const ask = window.confirm(
      "Are you sure you want to change this employee's status?"
    )
    if (ask) {
      this.subs.add = this.employeeScheduleService
        .markFormH3EmployeeInactive(payload)
        .subscribe({
          next: (res) => {
            if (res.status) Swal.fire(SweetAlertOptions(res?.message, true))
          },
          error: (err) => {
            Swal.fire(SweetAlertOptions(err?.error?.message || err?.message))
          },
        })
    }
  }

  deleteAnnualReturn(individualId: number) {
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.apiUrl = `${environment.AUTHAPIURL}FormH3/delete-TaxpayerH3bybusinessId/${this.businessId}/bycompanyId/${this.companyId}/byindividualId/${individualId}`

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        this.httpClient
          .delete<any>(this.apiUrl, {headers: reqHeader})
          .subscribe((data) => {
            // console.log(data)
            if (data.status == true) {
              Swal.fire({
                icon: "success",
                title: "Success",
                text: "Annual Return Successfully Deleted",
                showConfirmButton: false,
                timer: 1500,
              })
              this.getBusinesses()
              this.getAnnualReturns(this.businessId, this.companyId)
            } else {
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
    })
  }

  loadAssessmentYears() {
    let currentYear = new Date().getFullYear()
    this.assessmentYears = []

    for (var i = 2015; i <= currentYear; i++) {
      let assessmentYear = {id: i, year: i}
      this.assessmentYears.push(assessmentYear)
    }
  }

  calculateGrossIncome(event: any) {}

  calculateTotalIncome(event: any) {}

  calculateAnnualGross(event: any) {
    if (this.annualReturnForm.valid) {
      this.utilityService.calculateAnnualGross(this.annualReturnForm)
    }
    // else {
    //   this.utilityService.calculateTotalIncome(
    //     this.addEmployeeForm
    //   );
    // }
  }

  reload() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false
    this.router.onSameUrlNavigation = "reload"
    this.router.navigate(["./"], {relativeTo: this.route})
  }

  onFileChange(event: any) {
    if (
      !this.utilityService.validFileExtension(event.target.files, [
        "xls",
        "xlsx",
      ])
    ) {
      Swal.fire({
        icon: "error",
        title: "Invalid file(s) extension",
        text: "Selected file(s) not supported.",
        showConfirmButton: true,
        timer: 25000,
      })
      return false
    }
    if (event.target.files.length > 0) {
      const file = event.target.files[0]
      this.file = event.target.files[0]
      this.filePath = event.target.files[0].name
      this.myForm.get("myfile")?.setValue(file)
    }
    return true
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

  private errorHandler(error: any) {
    typeof error
    let message = ""
    if (typeof error == "string") {
      return error
    }
    error.forEach((err: {data: string | {message: string}; id: number}) => {
      message += ((err?.data as any)?.message || err.data) + "<br /> "
    })
    return message
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
