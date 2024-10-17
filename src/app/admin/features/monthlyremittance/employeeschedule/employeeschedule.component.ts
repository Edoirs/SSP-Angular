import {NgxUiLoaderService} from "ngx-ui-loader"
import {Component, inject, OnDestroy, OnInit, signal} from "@angular/core"
import {HttpClient} from "@angular/common/http"
import {FormBuilder, FormGroup} from "@angular/forms"
import {Title} from "@angular/platform-browser"
import {ActivatedRoute, Router} from "@angular/router"
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap"
import {SessionService} from "src/app/session.service"
import {UtilityService} from "src/app/utility.service"
import Swal from "sweetalert2"
import {MatDialog} from "@angular/material/dialog"
import {CreateScheduleComponent} from "./ui/create-schedule/create-schedule.component"
import {SubscriptionHandler} from "src/app/shared/utils/subscription-handler.utils"
import {EmployeeScheduleService} from "./services/employee-schedule.service"
import {EmployeeScheduleResInterface} from "./data-access/employee-schedule.model"
import {PageEvent} from "@angular/material/paginator"
import {MonthlyRemittanceEmployeesComponent} from "./ui/monthly-remittance-employees/monthly-remittance-employees.component"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"
import {TokenService} from "@shared/services/token.service"
import {MaterialDialogConfig} from "@shared/utils/material.utils"

@Component({
  selector: "app-employeeschedule",
  templateUrl: "./employeeschedule.component.html",
  styleUrl: "./employeeschedule.component.css",
})
export class EmployeescheduleComponent implements OnInit, OnDestroy {
  private readonly employeeScheduleService = inject(EmployeeScheduleService)
  public readonly tokenService = inject(TokenService)
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

  pageSize = signal(10)
  totalLength = signal(500)
  pageIndex = signal(0)

  employeesList = signal<EmployeeScheduleResInterface | null>(null)
  dataLoading = signal(false)
  dataMessage = signal("")

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

    this.listenToRoute()
  }

  ngOnDestroy(): void {
    this.subs.clear()
  }

  listenToRoute() {
    this.dataLoading.set(true)
    this.subs.add = this.route.queryParams.subscribe((params) => {
      if (Object.keys(params)) {
        if (params["pageIndex"]) this.pageIndex.set(params["pageIndex"])
        if (params["pageSize"]) this.pageSize.set(params["pageSize"])
        this.employeeScheduleService
          .getEmployees(this.pageIndex(), this.pageSize())
          .subscribe({
            next: (res) => {
              this.dataLoading.set(false)
              if (res.status) {
                this.employeesList.set(res.data)
                this.totalLength.set(
                  res?.data?.totalCount || res?.data?.businesses?.length
                )
              } else {
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

  openCreateScheduleModal() {
    this.dialog.open(CreateScheduleComponent, MaterialDialogConfig())
  }

  openEmployeeDetails(data: any) {
    this.dialog.open(
      MonthlyRemittanceEmployeesComponent,
      MaterialDialogConfig(data)
    )
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
}
