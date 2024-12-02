import {Component, inject, OnDestroy, OnInit, signal} from "@angular/core"
import {Title} from "@angular/platform-browser"
import {ActivatedRoute, Router} from "@angular/router"
import Swal from "sweetalert2"
import {MatDialog} from "@angular/material/dialog"
import {SubscriptionHandler} from "src/app/shared/utils/subscription-handler.utils"
import {EmployeeScheduleService} from "./services/employee-schedule.service"
import {EmployeeScheduleResInterface} from "./data-access/employee-schedule.model"
import {PageEvent} from "@angular/material/paginator"
import {MonthlyRemittanceEmployeesComponent} from "./ui/monthly-remittance-employees/monthly-remittance-employees.component"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"
import {TokenService} from "@shared/services/token.service"
import {MaterialDialogConfig} from "@shared/utils/material.utils"
import {EmployeeStateService} from "./services/employee-state.service"
import {ThrotlleQuery} from "@shared/utils/shared.utils"

@Component({
  selector: "app-employeeschedule",
  templateUrl: "./employeeschedule.component.html",
  styleUrl: "./employeeschedule.component.css",
})
export class EmployeescheduleComponent implements OnInit, OnDestroy {
  private readonly employeeScheduleService = inject(EmployeeScheduleService)
  private readonly employeeStateService = inject(EmployeeStateService)
  public readonly tokenService = inject(TokenService)
  private readonly dialog = inject(MatDialog)
  private readonly titleService = inject(Title)
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)

  title = "PAYE - Employees Report"

  pageSize = signal(10)
  totalLength = signal(500)
  pageIndex = signal(1)
  queryString = signal("")

  employeesList = signal<EmployeeScheduleResInterface | null>(null)
  dataLoading = signal(false)
  dataMessage = signal("")

  validatorRegex = /^(\d{1,17}|\d{0,17}\.\d{1,2})$/
  cardIdRegex = /^[0-9\s]*$/
  textOnlyRegex = "[a-zA-Z ]*"

  subs = new SubscriptionHandler()

  constructor() {}

  ngOnInit(): void {
    this.titleService.setTitle(this.title)

    this.listenToRoute()

    this.reloadTable()
  }

  ngOnDestroy(): void {
    this.subs.clear()
  }

  queryTable(domInput: HTMLInputElement) {
    this.subs.add = ThrotlleQuery(domInput, "keyup").subscribe((query) => {
      this.router.navigate(["."], {
        relativeTo: this.route,
        queryParams: {
          search: query,
          pageSize: 10,
          pageIndex: 1,
        },
        queryParamsHandling: "replace",
      })
    })
  }

  listenToRoute() {
    this.dataLoading.set(true)
    this.subs.add = this.route.queryParams.subscribe((params) => {
      if (Object.keys(params)) {
        if (params["pageIndex"]) this.pageIndex.set(params["pageIndex"])
        if (params["pageSize"]) this.pageSize.set(params["pageSize"])
        if (params["search"]) this.queryString.set(params["search"])
        this.employeeScheduleService
          .getEmployees(this.pageIndex(), this.pageSize(), params["search"])
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
              this.dataMessage.set(err?.error?.message || err?.message)
              Swal.fire(SweetAlertOptions(err?.error?.message || err?.message))
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
        pageIndex: event.pageIndex,
      },
    })
  }

  reloadTable() {
    this.subs.add = this.employeeStateService.generalState.subscribe((e) => {
      this.subs.add = this.employeeScheduleService
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
            this.dataMessage.set(err?.error?.message || err?.message)
            Swal.fire(SweetAlertOptions(err?.error?.message || err?.message))
          },
        })
    })
  }

  openEmployeeDetails(data: any) {
    this.dialog.open(
      MonthlyRemittanceEmployeesComponent,
      MaterialDialogConfig(data)
    )
  }
}
