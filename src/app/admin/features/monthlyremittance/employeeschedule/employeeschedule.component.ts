import {NgxUiLoaderService} from "ngx-ui-loader"
import {Component, inject, OnDestroy, OnInit, signal} from "@angular/core"
import {HttpClient, HttpHeaders} from "@angular/common/http"
import {FormBuilder, FormGroup, Validators} from "@angular/forms"
import {Title} from "@angular/platform-browser"
import {ActivatedRoute, Router} from "@angular/router"
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap"
// import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
// import { DashboardComponent } from "src/app/paye/dashboard/dashboard.component";
import {SessionService} from "src/app/session.service"
import {UtilityService} from "src/app/utility.service"
import {environment} from "src/environments/environment"
import Swal from "sweetalert2"
import {EmployeeTableImage} from "./utils/employeeschedule.utils"
import {MatDialog} from "@angular/material/dialog"
import {CreateScheduleComponent} from "./ui/create-schedule/create-schedule.component"
import {SubscriptionHandler} from "src/app/shared/utils/subscription-handler.utils"
import {EmployeeScheduleService} from "./services/employee-schedule.service"
import {EmployeeScheduleResInterface} from "./data-access/employee-schedule.model"
import {PageEvent} from "@angular/material/paginator"
import {MonthlyRemittanceEmployeesComponent} from "./ui/monthly-remittance-employees/monthly-remittance-employees.component"

@Component({
  selector: "app-employeeschedule",
  templateUrl: "./employeeschedule.component.html",
  styleUrl: "./employeeschedule.component.css",
})
export class EmployeescheduleComponent implements OnInit, OnDestroy {
  private readonly employeeScheduleService = inject(EmployeeScheduleService)
  private readonly dialog = inject(MatDialog)
  editEmployeeForm!: FormGroup
  addEmployeeForm!: FormGroup
  submitted: boolean = false
  apiUrl!: string
  employeesData: any
  showAddNewEmployee: boolean = false
  modalOptions!: NgbModalOptions
  closeResult!: string
  dtOptions: any = {}
  showListOfEmployees: boolean = true
  corporateName!: string
  selectedEmployee: any
  forwardScheduleForm!: FormGroup
  showCreateSchedule: boolean = false
  showEditEmployee: boolean = false
  showDeleteEmployee: boolean = false
  showSaveEmployee: boolean = false
  apidataEmpty: boolean = false
  title = "PAYE - Employees Report"
  zipCodes: any
  userRole: any
  disableEmployeeControl: any
  grossIncomeIncorrect!: boolean
  stateLocalGovts: any
  validateCacTin!: boolean
  yearIncorrect!: boolean
  isScheduleYearValid!: boolean
  uploadForm!: FormGroup
  files: any
  file: any
  isResponse = 0
  isError = 0
  isMessage = ""
  roleID: any
  sample_file: any
  filePath: any
  columnError: string[] = []
  error: any
  alert: any
  selectedBusiness: any
  editorRole!: boolean
  businessesData: any
  businessId: any

  isEdit: boolean = false
  isDisabled: boolean = false
  updateId: any
  companyId: any

  pageSize = signal(15)
  totalLength = signal(500)
  pageIndex = signal(1)

  employeesList = signal<EmployeeScheduleResInterface | null>(null)

  validatorRegex = /^(\d{1,17}|\d{0,17}\.\d{1,2})$/
  cardIdRegex = /^[0-9\s]*$/
  textOnlyRegex = "[a-zA-Z ]*"

  subs = new SubscriptionHandler()

  constructor(
    private formBuilder: FormBuilder,
    private titleService: Title,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    // private component: DashboardComponent,
    private sess: SessionService,
    private utilityService: UtilityService,
    private modalService: NgbModal,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    // this.sess.isCorporate();
    this.titleService.setTitle(this.title)
    // this.component.checkIfEditorExist();
    this.initialiseEditForms()
    // this.getEmployees();
    this.getZipcodes()
    this.getStateLocalGovts()
    this.userRole = localStorage.getItem("role_id")
    console.log("userRole: ", this.userRole)

    this.companyId = localStorage.getItem("companyId")
    console.log("companyId: ", this.companyId)
    this.getBusinesses()

    if (this.userRole == 6) {
      this.editorRole = true
      // this.showCreateSchedule = true;
      this.showEditEmployee = true
      this.showDeleteEmployee = true
      this.showSaveEmployee = true
      this.disableEmployeeControl = null
    } else {
      this.disableEmployeeControl = true
    }

    console.log("showEditEmployee: ", this.showEditEmployee)
    console.log("showEditEmployee: ", this.showEditEmployee)
    console.log("token: ", localStorage.getItem("access_token"))
    // this.ngxService.stop();

    this.modalOptions = {
      backdrop: true,
      centered: true,
      backdropClass: "customBackdrop",
      // size: "lg",
      size: "xl",
    }
    this.initTable()

    this.uploadForm = this.formBuilder.group({
      myfile: ["", Validators.required],
    })

    this.sample_file =
      environment.SAMPLE_FILE_URL + "employee-schedule-template.xlsx"

    this.listenToRoute()
  }

  ngOnDestroy(): void {
    this.subs.clear()
  }

  listenToRoute() {
    this.subs.add = this.route.queryParams.subscribe((params) => {
      if (Object.keys(params)) {
        if (params["pageIndex"]) this.pageIndex.set(params["pageIndex"])
        if (params["pageSize"]) this.pageSize.set(params["pageSize"])
        this.employeeScheduleService
          .getEmployees(this.pageIndex(), this.pageSize())
          .subscribe((res) => {
            this.employeesList.set(res.data)
            this.totalLength.set(res.data?.totalCount)
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

  initTable() {
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
        // { extend: 'copy',  className: 'btn btn-outline-dark', text: '<i class="far fa-copy"> Copy</i>' },
        // tslint:disable-next-line: max-line-length
        {
          extend: "csv",
          className: "btn btn-outline-dark export-btn",
          text: '<i class="fas fa-file-csv"> CSV</i>',
          exportOptions: {columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
        },
        // tslint:disable-next-line: max-line-length
        {
          extend: "excel",
          className: "btn btn-outline-dark export-btn",
          text: '<i class="fas fa-file-excel"> Excel</i>',
          exportOptions: {columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
        },

        {
          extend: "pdfHtml5",
          className: "btn btn-outline-dark export-btn",
          text: '<i class="fas fa-file-pdf"> PDF</i>',
          orientation: "landscape",
          pageSize: "LEGAL",
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          },

          customize: function (doc: any) {
            doc.content.splice(1, 0, {
              margin: [0, 0, 0, 10],
              alignment: "left",
              image: EmployeeTableImage,
            })
          },
        },
      ],
    }
  }

  initialiseAddForm() {
    // this.ngxService.start();
    this.addEmployeeForm = this.formBuilder.group({
      emailAddress: [
        "",
        [
          Validators.required,
          Validators.maxLength(45),
          Validators.email,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
      zipCode: ["", [Validators.required]],
      nationality: [
        "Nigerian",
        [Validators.required, Validators.pattern(this.textOnlyRegex)],
      ],
      startMonthId: ["01", Validators.required],
      NHF: ["0", [Validators.pattern(this.validatorRegex)]],
      NHIS: ["0", [Validators.pattern(this.validatorRegex)]],
      // CRA: ["0", [Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,3})$/)]],
      pension: ["0", [Validators.pattern(this.validatorRegex)]],
      grossIncome: [
        "",
        [Validators.required, Validators.pattern(this.validatorRegex)],
      ],
      totalIncome: [
        "",
        [Validators.required, Validators.pattern(this.validatorRegex)],
      ],
      basicIncome: [
        "0",
        [Validators.required, Validators.pattern(this.validatorRegex)],
      ],
      rent: [
        "0",
        [
          // Validators.required,
          Validators.pattern(this.validatorRegex),
        ],
      ],
      transport: [
        "0",
        [
          // Validators.required,
          Validators.pattern(this.validatorRegex),
        ],
      ],
      otherIncome: [
        "0",
        [
          // Validators.required,
          Validators.pattern(this.validatorRegex),
        ],
      ],
      lifeAssurance: ["0", [Validators.pattern(this.validatorRegex)]],
      bvn: [
        "",
        [
          Validators.pattern(this.cardIdRegex),
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      nin: [
        "",
        [
          Validators.pattern(this.cardIdRegex),
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      employeeTIN: [
        "",
        [
          Validators.pattern(this.cardIdRegex),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      phoneNumber: [
        "",
        [
          Validators.required,
          Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/),
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      existingTaxId: ["", [Validators.minLength(11), Validators.maxLength(11)]], //Not reuired for edit action
      firstName: [
        "",
        [
          Validators.required,
          Validators.pattern(this.textOnlyRegex),
          Validators.maxLength(30),
        ],
      ],
      surname: [
        "",
        [
          Validators.required,
          Validators.pattern(this.textOnlyRegex),
          Validators.maxLength(30),
        ],
      ],
      otherName: [
        "",
        [
          // Validators.required,
          Validators.pattern(this.textOnlyRegex),
          Validators.maxLength(30),
        ],
      ],
      titleId: ["", Validators.required],
      designation: [
        "",
        [
          Validators.required,
          Validators.pattern(this.textOnlyRegex),
          Validators.maxLength(40),
        ],
      ],
      contactAddress: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(80),
        ],
      ],
      localGovernmentId: ["", Validators.required],

      NSIRSTaxPayerID: [""], //existingTaxId can replace this.
      CRA: [""], //Added to fix bug on calculateGrossIncome() in util service.
      taxYear: [""], //Required for edit action
    })

    // this.ngxService.stop();
  }

  initialiseEditForms() {
    this.editEmployeeForm = this.formBuilder.group({
      emailAddress: [
        "",
        [Validators.required, Validators.maxLength(60), Validators.email],
      ],
      NSIRSTaxPayerID: [""],
      zipCode: ["", Validators.required],
      nationality: ["", Validators.required],
      startMonthId: ["01", Validators.required],
      NHF: ["", [Validators.pattern(this.validatorRegex)]],
      NHIS: ["", [Validators.pattern(this.validatorRegex)]],
      // CRA: ["", [Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,3})$/)]],
      pension: ["", [Validators.pattern(this.validatorRegex)]],
      grossIncome: [
        "",
        [Validators.required, Validators.pattern(this.validatorRegex)],
      ],
      totalIncome: [
        "",
        [Validators.required, Validators.pattern(this.validatorRegex)],
      ],
      basicIncome: [
        "0",
        [Validators.required, Validators.pattern(this.validatorRegex)],
      ],
      rent: [
        "0",
        [
          // Validators.required,
          Validators.pattern(this.validatorRegex),
        ],
      ],
      transport: [
        "0",
        [
          // Validators.required,
          Validators.pattern(this.validatorRegex),
        ],
      ],
      otherIncome: [
        "0",
        [
          // Validators.required,
          Validators.pattern(this.validatorRegex),
        ],
      ],
      lifeAssurance: ["0", [Validators.pattern(this.validatorRegex)]],
      taxYear: [
        "",
        [
          Validators.required,
          Validators.pattern(this.cardIdRegex),
          Validators.minLength(4),
          Validators.maxLength(4),
        ],
      ],
      taxMonthId: ["", Validators.required],
      bvn: [
        "",
        [
          Validators.pattern(this.cardIdRegex),
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      nin: [
        "",
        [
          Validators.pattern(this.cardIdRegex),
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      employeeTIN: [
        "",
        [
          Validators.pattern(this.cardIdRegex),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],

      phoneNumber: [
        "",
        [
          Validators.required,
          Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/),
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      firstName: ["", Validators.required],
      surname: ["", Validators.required],
      otherName: [
        "",
        [
          // Validators.required,
          Validators.pattern(this.textOnlyRegex),
          Validators.maxLength(30),
        ],
      ],
      titleId: ["", Validators.required],
      contactAddress: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(80),
        ],
      ],
      designation: ["", Validators.required],
      localGovernmentId: ["", Validators.required],
    })

    this.forwardScheduleForm = this.formBuilder.group({
      // [Validators.required, Validators.pattern(this.cardIdRegex), Validators.minLength(4), Validators.maxLength(4)]
      scheduleYear: [
        "",
        [
          Validators.required,
          Validators.pattern(this.cardIdRegex),
          Validators.minLength(4),
          Validators.maxLength(4),
        ],
      ],
      scheduleMonthId: [""],
      comment: [""],
    })
  }

  onSubmitEdit(formAllData: any) {
    this.submitted = true

    // stop the process here if form is invalid
    this.validateTinPhoneNinBvn(this.editEmployeeForm)

    if (this.editEmployeeForm.invalid || this.validateCacTin) {
      return
    }

    let corporateId = localStorage.getItem("corporate_id")

    const obj = {
      id: this.selectedEmployee.id,
      tin: formAllData.employeeTIN,
      bvn: formAllData.bvn,
      nhis: formAllData.NHIS,
      nhf: formAllData.NHF,
      designation: formAllData.designation,
      title: formAllData.titleId,
      first_name: formAllData.firstName,
      last_name: formAllData.surname,
      email: formAllData.emailAddress,
      nationality: formAllData.nationality,
      tax_year: formAllData.taxYear,
      tax_month: formAllData.taxMonthId,
      zip_code: formAllData.zipCode,
      // cra: formAllData.CRA,
      pension: formAllData.pension,
      gross_income: formAllData.grossIncome.toString(),
      phone: formAllData.phoneNumber,
      start_month: formAllData.startMonthId,
      home_address: formAllData.contactAddress,
      corporate_id: corporateId == null ? "" : corporateId,
      business_id: this.businessId.toString(),
      life_assurance: formAllData.lifeAssurance,
      total_income: formAllData.totalIncome.toString(),
      taxpayer_id: formAllData.NSIRSTaxPayerID,
      lga_code: formAllData.localGovernmentId,
      nin: formAllData.nin,
      basic: formAllData.basicIncome,
    }

    console.log("employeeFormData: ", obj)
    this.postUpdateEmployee(obj)
  }

  addEmployee(content: any) {
    this.modalService.open(content, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
      }
    )
  }

  viewEmployee(modal: any, selectedEmployee: any) {
    console.log("selectedEmployee: ", selectedEmployee)
    this.submitted = false
    this.showSaveEmployee = false
    this.initialiseAddForm()
    this.showModal(modal)
    this.getSingleEmployee(selectedEmployee.id)
  }

  viewAddEmployee(modal: any) {
    this.showModal(modal)
    this.initialiseAddForm()
  }

  viewUploadEmployee(modal: any) {
    this.showModal(modal)
  }

  viewBusinessEmployees(modal: any, selectedBusiness: any) {
    this.showModal(modal)
    this.businessId = selectedBusiness.id
    this.getEmployees(this.businessId)
  }

  editEmployee(modal: any, selectedEmployee: any) {
    // console.log("selectedEmployee: ", selectedEmployee);
    this.submitted = false
    this.showSaveEmployee = true
    this.initialiseAddForm()
    this.showModal(modal)
    this.getSingleEmployee(selectedEmployee.id)
  }

  loadSelectedEmployeeData(selectedEmployee: any) {
    this.addEmployeeForm.controls["emailAddress"].setValue(
      selectedEmployee.email
    )
    this.addEmployeeForm.controls["zipCode"].setValue(selectedEmployee.zip_code)
    this.addEmployeeForm.controls["nationality"].setValue(
      selectedEmployee.nationality
    )
    this.addEmployeeForm.controls["startMonthId"].setValue(
      selectedEmployee.start_month
    )

    this.addEmployeeForm.controls["NHF"].setValue(selectedEmployee.nhf)
    this.addEmployeeForm.controls["NHIS"].setValue(selectedEmployee.nhis)
    this.addEmployeeForm.controls["pension"].setValue(selectedEmployee.pension)
    this.addEmployeeForm.controls["grossIncome"].setValue(
      selectedEmployee.gross_income
    )
    this.addEmployeeForm.controls["totalIncome"].setValue(
      selectedEmployee.total_income
    )
    this.addEmployeeForm.controls["basicIncome"].setValue(
      selectedEmployee.basic
    )
    this.addEmployeeForm.controls["rent"].setValue(selectedEmployee.rent)
    this.addEmployeeForm.controls["transport"].setValue(
      selectedEmployee.transport
    )
    this.addEmployeeForm.controls["otherIncome"].setValue(
      selectedEmployee.other_income
    )
    this.addEmployeeForm.controls["lifeAssurance"].setValue(
      selectedEmployee.life_assurance
    )

    this.addEmployeeForm.controls["bvn"].setValue(selectedEmployee.bvn)
    this.addEmployeeForm.controls["nin"].setValue(selectedEmployee.nin)
    this.addEmployeeForm.controls["employeeTIN"].setValue(selectedEmployee.tin)
    this.addEmployeeForm.controls["phoneNumber"].setValue(
      selectedEmployee.phone
    )
    this.addEmployeeForm.controls["firstName"].setValue(
      selectedEmployee.first_name
    )
    this.addEmployeeForm.controls["surname"].setValue(
      selectedEmployee.last_name
    )
    this.addEmployeeForm.controls["otherName"].setValue(
      selectedEmployee.other_name
    )
    this.addEmployeeForm.controls["titleId"].setValue(selectedEmployee.title)
    this.addEmployeeForm.controls["designation"].setValue(
      selectedEmployee.designation
    )
    this.addEmployeeForm.controls["contactAddress"].setValue(
      selectedEmployee.home_address
    )
    this.addEmployeeForm.controls["localGovernmentId"].setValue(
      selectedEmployee.lga_code
    )
    this.addEmployeeForm.controls["NSIRSTaxPayerID"].setValue(
      selectedEmployee.taxpayer_id
    )
    this.addEmployeeForm.controls["existingTaxId"].setValue(
      selectedEmployee.taxpayer_id
    )

    //Disable fields
    this.disbableEmployeeFormFields()
  }

  disbableEmployeeFormFields(): void {
    const enableFields: string[] = [
      "NHF",
      "NHIS",
      "pension",
      "basicIncome",
      "rent",
      "transport",
      "otherIncome",
      "lifeAssurance",
    ]

    for (let key in this.addEmployeeForm.controls) {
      ;(!this.showSaveEmployee || !enableFields.includes(key)) &&
        this.addEmployeeForm.controls[key].disable()
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

  getZipcodes() {
    this.apiUrl = environment.AUTHAPIURL + "LocalGovtPostalCode/getall"

    this.subs.add = this.httpClient.get<any>(this.apiUrl).subscribe((data) => {
      console.log("zipcodes: ", data)
      this.zipCodes = data.data
    })
  }

  getStateLocalGovts() {
    this.apiUrl = `${environment.AUTHAPIURL}LocalGovernmentArea/getall`

    this.subs.add = this.httpClient.get<any>(this.apiUrl).subscribe((data) => {
      this.stateLocalGovts = data.data
      console.log("stateLocalGovts: ", data)
    })
  }

  getSingleEmployee(employeeId: any) {
    this.ngxService.start()
    this.apiUrl = environment.AUTHAPIURL + "Employee/GetbyId/" + employeeId

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.subs.add = this.httpClient
      .get<any>(this.apiUrl, {headers: reqHeader})
      .subscribe((data) => {
        console.log("singleEmployeeData: ", data)
        this.loadSelectedEmployeeData(data.data)
        this.selectedEmployee = data.data
        this.ngxService.stop()
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

    this.subs.add = this.httpClient
      .get<any>(this.apiUrl, {headers: reqHeader})
      .subscribe((data) => {
        console.log("BusinessData: ", data)

        this.businessesData = data.data
        this.ngxService.stop()
      })
  }

  getSingleBusiness(businessId: any) {
    // this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "Business/GetbyId/" + businessId

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.subs.add = this.httpClient
      .get<any>(this.apiUrl, {headers: reqHeader})
      .subscribe((data) => {
        console.log("singleBusinessData: ", data)

        this.selectedBusiness = data.response
        // this.ngxService.stop();
      })
  }

  postUpdateEmployee(jsonData: any) {
    // this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "employees/update"
    console.log("Okay")
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.subs.add = this.httpClient
      .post<any>(this.apiUrl, jsonData, {headers: reqHeader})
      .subscribe((data) => {
        console.log("employeeResponseData: ", data)

        if (data.status === true) {
          // Rest form fithout errors
          this.editEmployeeForm.reset()

          Object.keys(this.editEmployeeForm.controls).forEach((key) => {
            this.editEmployeeForm.get(key)?.setErrors(null)
          })
          // this.formDirective.resetForm()
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Employee has been updated successfully!",
            // text: data.response != null && data.response[0] != undefined ? data.response[0].message : data.message,
            showConfirmButton: true,
            timer: 5000,
            timerProgressBar: true,
          })
          document.getElementById("closeUpdateModal")!.click()
          // this.ngxService.stop();
          this.modalService.dismissAll()
          this.getEmployees(this.businessId)
          this.reload()
        } else {
          // this.ngxService.stop();

          Swal.fire({
            icon: "error",
            title: "Oops...",
            text:
              data.response != null ? data.response[0].message : data.message,
            showConfirmButton: true,
            timer: 5000,
            timerProgressBar: true,
          })
        }
      })
  }

  getEmployees(businessId: any) {
    // this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "Employee/getall"

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    // let corporateId = localStorage.getItem("corporate_id");

    // const obj = {
    //   corporate_id: corporateId,
    //   business_id: businessId,
    // };

    this.subs.add = this.httpClient
      .get<any>(this.apiUrl, {headers: reqHeader})
      .subscribe((data) => {
        console.log("employeesData: ", data)
        this.employeesData = data.data == null ? [] : data.data.reverse()
        if (data.data.length > 0) {
          this.apidataEmpty = true
        }
        // this.ngxService.stop();
      })
  }

  forwardSchedule(modal: any) {
    this.showModal(modal)
  }

  openCreateScheduleModal() {
    this.dialog.open(CreateScheduleComponent)
  }

  openEmployeeDetails(data: any) {
    this.dialog.open(MonthlyRemittanceEmployeesComponent, {
      data,
      minWidth: 1000,
    })
  }

  onSubmitSchedule(formAllData: any) {
    this.submitted = true

    this.validateScheduleYear(this.forwardScheduleForm)

    // stop the process here if form is invalid
    if (this.forwardScheduleForm.invalid || !this.isScheduleYearValid) {
      return
    }

    let corporateId = localStorage.getItem("corporate_id")

    const obj = {
      comment: formAllData.comment,
      due_date: formAllData.scheduleYear + "-" + formAllData.scheduleMonthId,
      corporate_ids: [corporateId],
      business_id: this.businessId,
    }

    console.log("scheduleFormData: ", obj)
    this.postForwardSchedule(obj)
  }

  postForwardSchedule(jsonData: any) {
    // this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "schedules/forward"

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.subs.add = this.httpClient
      .post<any>(this.apiUrl, jsonData, {headers: reqHeader})
      .subscribe((data) => {
        console.log("scheduleApiResponseData: ", data)

        if (data.status === true) {
          // Rest form fithout errors
          this.forwardScheduleForm.reset()
          Object.keys(this.forwardScheduleForm.controls).forEach((key) => {
            this.forwardScheduleForm.get(key)?.setErrors(null)
          })
          // this.formDirective.resetForm()
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Schedule Forawarded Successfully to Manager",
            showConfirmButton: true,
            timer: 5000,
            timerProgressBar: true,
          })

          // this.ngxService.stop();
          this.modalService.dismissAll()
          this.getEmployees(this.businessId)
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
            timer: 7000,
            timerProgressBar: true,
          })
        }
      })
  }

  deleteEmployee(id: number) {
    let corporateId = localStorage.getItem("corporate_id")

    const obj = {
      corporate_ids: [corporateId],
      id: id,
    }

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.apiUrl = environment.AUTHAPIURL + "employees/delete"

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
        // this.ngxService.start();
        this.subs.add = this.httpClient
          .post<any>(this.apiUrl, obj, {headers: reqHeader})
          .subscribe((data) => {
            if (data.status == true) {
              // this.ngxService.stop();
              Swal.fire({
                icon: "success",
                title: "Deleted",
                text: "Employee was deleted successfully",
                showConfirmButton: false,
                timer: 5000,
                timerProgressBar: true,
              })
              this.getEmployees(this.businessId)
              // this.ngxService.stop();
              this.modalService.dismissAll()
            } else {
              // this.ngxService.stop();
              Swal.fire({
                icon: "error",
                title: "An error occurred",
                text: data.message,
                showConfirmButton: false,
                timer: 5000,
                timerProgressBar: true,
              })
              this.router.navigate(["admin", "employee-schedule"])
            }
          })
      }
    })
  }

  calculateGrossIncome(event: any) {
    this.grossIncomeIncorrect = this.utilityService.calculateGrossIncome(
      this.addEmployeeForm
    )
  }

  calculateTotalIncome(event: any) {
    this.utilityService.calculateTotalIncome(this.addEmployeeForm)
  }

  validateScheduleYear(selectedForm: any) {
    let year = Number(selectedForm.get("scheduleYear").value)
    this.toggleScheduleYear(year)
  }

  changeScheduleYearStatus() {
    let year = Number(this.forwardScheduleForm.get("scheduleYear")!.value)
    this.toggleScheduleYear(year)
  }

  toggleScheduleYear(year: any) {
    if (year < 2010) {
      this.isScheduleYearValid = false
    } else {
      this.isScheduleYearValid = true
    }
  }

  onSubmit(formAllData: any) {
    this.submitted = true

    // stop the process here if form is invalid
    this.validateTinPhoneNinBvn(this.addEmployeeForm)

    if (this.addEmployeeForm.invalid || this.validateCacTin) {
      return
    }

    let corporateId = localStorage.getItem("corporate_id")

    let obj = {
      tin: this.isEdit ? this.selectedEmployee.tin : formAllData.employeeTIN,
      bvn: this.isEdit ? this.selectedEmployee.bvn : formAllData.bvn,
      nhis: formAllData.NHIS,
      nhf: formAllData.NHF,
      designation: formAllData.designation,
      title: formAllData.titleId,
      first_name: formAllData.firstName,
      last_name: formAllData.surname,
      email: formAllData.emailAddress,
      nationality: formAllData.nationality,
      zip_code: formAllData.zipCode,
      cra: formAllData.CRA.toString(),
      taxpayer_id: formAllData.existingTaxId,
      pension: formAllData.pension,
      gross_income: formAllData.grossIncome.toString(),
      phone: this.isEdit
        ? this.selectedEmployee.phone
        : formAllData.phoneNumber,
      start_month: formAllData.startMonthId,
      corporate_id: corporateId == null ? "6" : corporateId,
      home_address: formAllData.contactAddress,
      business_id: this.businessId.toString(),
      life_assurance: formAllData.lifeAssurance,
      total_income: formAllData.totalIncome.toString(),
      lga_code: formAllData.localGovernmentId,
      nin: this.isEdit ? this.selectedEmployee.nin : formAllData.nin,
      basic: formAllData.basicIncome,
      rent: formAllData.rent,
      transport: formAllData.transport,
      other_income: formAllData.otherIncome,
      other_name: formAllData.otherName,

      ////////
      id: "",
      tax_year: "",
      tax_month: "",
      deleted_at: "0",
    }

    console.log("employeeFormData: ", obj)
    // this.postCreateEmployee(obj);
    this.apiUrl = environment.AUTHAPIURL + "Employee/AddEmployee"

    if (this.isEdit) {
      obj["id"] = this.selectedEmployee.id
      obj["tax_year"] = formAllData.taxYear
      // obj["cra"] = formAllData.CRA;
      obj["tax_month"] = formAllData.taxMonthId
      this.apiUrl = environment.AUTHAPIURL + "employees/update"
    }

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.ngxService.start()
    this.subs.add = this.httpClient
      .post<any>(this.apiUrl, obj, {headers: reqHeader})
      .subscribe((data) => {
        console.log("employeeResponseData: ", data)

        if (data.status === true) {
          this.ngxService.stop()
          // Rest form fithout errors
          !this.isEdit && this.addEmployeeForm.reset()
          // this.addEmployeeForm.get("nationality").setValue("Nigerian");
          // Object.keys(this.addEmployeeForm.controls).forEach((key) => {
          //   this.addEmployeeForm.get(key).setErrors(null);
          // });

          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Employee has been saved successfully!",
            // text: data.response != null && data.response[0] != undefined ? data.response[0].message : data.message,
            showConfirmButton: true,
            timer: 5000,
          })
          // document.getElementById("closeCreateModal").click();
          this.modalService.dismissAll()
          this.getEmployees(this.businessId)
          // this.router.navigate(['admin', 'employee-schedule']);
          this.reload()
        } else {
          this.ngxService.stop()
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text:
              data.response != null ? data.response[0].message : data.message,
            // text:  data.response[0].message == '' || data.response[0].message == null ? 'Something went wrong, Please try again with correct employee details' : data.response[0].message,
            showConfirmButton: true,
            timer: 7000,
            timerProgressBar: true,
          })
        }
      })
  }

  postCreateEmployee(jsonData: any) {
    this.apiUrl = environment.AUTHAPIURL + "employees"
    // this.ngxService.start();

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.subs.add = this.httpClient
      .post<any>(this.apiUrl, jsonData, {headers: reqHeader})
      .subscribe((data) => {
        console.log("employeeResponseData: ", data)

        if (data.status === true) {
          // this.ngxService.stop();
          // Rest form fithout errors
          this.addEmployeeForm.reset()
          this.addEmployeeForm.get("nationality")?.setValue("Nigerian")
          Object.keys(this.addEmployeeForm.controls).forEach((key) => {
            this.addEmployeeForm.get(key)?.setErrors(null)
          })

          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Employee has been saved successfully!",
            // text: data.response != null && data.response[0] != undefined ? data.response[0].message : data.message,
            showConfirmButton: true,
            timer: 5000,
          })
          document.getElementById("closeCreateModal")!.click()
          this.getEmployees(this.businessId)
          this.router.navigate(["admin", "employee-schedule"])
        } else {
          // this.ngxService.stop();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text:
              data.response != null ? data.response[0].message : data.message,
            // text:  data.response[0].message == '' || data.response[0].message == null ? 'Something went wrong, Please try again with correct employee details' : data.response[0].message,
            showConfirmButton: true,
            timer: 7000,
            timerProgressBar: true,
          })
        }
      })
  }

  validateTinPhoneNinBvn(selectedForm: any) {
    let tin = selectedForm.get("employeeTIN").value
    let nin = selectedForm.get("nin").value
    let bvn = selectedForm.get("bvn").value

    if (
      (tin == "" || tin == null) &&
      (nin == "" || nin == null) &&
      (bvn == "" || bvn == null)
    ) {
      this.validateCacTin = true
    } else {
      this.validateCacTin = false
    }
  }

  changeTinPhoneNinBvnStatus() {
    this.validateCacTin = false
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

  reload() {
    this.modalService.dismissAll()
    this.router.routeReuseStrategy.shouldReuseRoute = () => false
    this.router.onSameUrlNavigation = "reload"
    this.router.navigate(["./"], {relativeTo: this.route})
  }

  validateYear(event: any) {
    let d = new Date()
    let currentYear = d.getFullYear()
    let year = event.target.value
    console.log(year, " rtyu")
    if (year < 2000 || year > currentYear) {
      this.yearIncorrect = true
    } else {
      this.yearIncorrect = false
    }
  }

  submitUpload() {
    this.submitted = true
    if (this.uploadForm.invalid) {
      return
    }
    // tslint:disable-next-line: max-line-length
    // In Angular 2+, it is very important to leave the Content-Type empty. If you set the 'Content-Type' to 'multipart/form-data' the upload will not work !
    const config = {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    }

    const formData = new FormData()
    // formData.append('employees', this.uploadForm.get('fileSource').value);
    formData.append("employees", this.uploadForm.get("myfile")!.value)
    formData.append("business_id", this.businessId)
    this.apiUrl = environment.AUTHAPIURL
    // this.ngxService.start();

    this.subs.add = this.httpClient
      .post<any>(this.apiUrl + "employees/import", formData, config)
      .subscribe((res) => {
        console.log(res)

        this.uploadForm.reset()
        Object.keys(this.uploadForm.controls).forEach((key) => {
          this.uploadForm.get(key)?.setErrors(null)
        })
        if (res.status == true) {
          // this.ngxService.stop();

          this.uploadForm.reset()
          Object.keys(this.uploadForm.controls).forEach((key) => {
            this.uploadForm.get(key)?.setErrors(null)
          })
          this.reload()
          if (res.message === "0 Employees created; 0 updated.") {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Confirm the file content and try again",
              showConfirmButton: true,
              timer: 5000,
              timerProgressBar: true,
            })
          } else {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: res.message,
              showConfirmButton: true,
              timer: 5000,
              timerProgressBar: true,
            })
            document.getElementById("closeUploadModal")!.click()
          }
        } else {
          // this.ngxService.stop();
          this.uploadForm.reset()
          Object.keys(this.uploadForm.controls).forEach((key) => {
            this.uploadForm.get(key)?.setErrors(null)
          })
          const regex = /_/g
          if (res.response == null) {
            this.reload()
            Swal.fire({
              icon: "warning",
              title: "Validation not passed",
              // html: '<div class="text-left ml-3 ">' + this.columnError.join('<br />') + '</div>' ,
              text: "The content of this file does not match the template provided",
              showConfirmButton: true,
              timer: 10000,
              timerProgressBar: true,
            })
          }

          for (const key of Object.keys(res.response)) {
            const row = res.response[key]

            for (const error of row) {
              let err = key.replace(regex, " " + ":")
              this.error =
                err.toUpperCase() + " " + (key.replace(regex, " ") + ":", error)
              this.columnError.push(this.error)
              console.log(this.error)
            }
          }

          this.reload()
          if (this.columnError.length < 12) {
            Swal.fire({
              icon: "warning",
              title: res.message,
              html:
                '<div class="text-left ml-3 ">  ERROR: ' +
                this.columnError.join("<br /> ERROR: ") +
                "</div>",
              // text: this.columnError.join('\n'),
              showConfirmButton: true,
            })
          } else {
            Swal.fire({
              icon: "error",
              title: res.message,
              html:
                '<div class="text-left ml-3 p-0 my-4 div-scroll-alert"> ERROR: ' +
                this.columnError.join("<br /> ERROR: ") +
                "</div>",
              // text: this.columnError.join('\n'),
              showConfirmButton: true,
            })
          }
        }
      })
  }

  onFileChange(event: any) {
    //Validate file extension
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
      this.uploadForm.get("myfile")?.setValue(file)
    }
    return true
  }
}
