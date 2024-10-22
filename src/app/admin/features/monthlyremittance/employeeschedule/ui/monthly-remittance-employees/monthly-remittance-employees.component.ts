import {DecimalPipe, TitleCasePipe} from "@angular/common"
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core"
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogClose,
} from "@angular/material/dialog"
import {
  BusinessesResInterface,
  DownloadEmployeePdfInterface,
  EmployeeDetailResInterface,
  MarkEmployeeInterface,
} from "../../data-access/employee-schedule.model"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {EmployeeScheduleService} from "../../services/employee-schedule.service"
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator"
import {CreateScheduleComponent} from "../create-schedule/create-schedule.component"
import {NgToggleModule} from "ng-toggle-button"
import {BulkUploadComponent} from "../bulk-upload/bulk-upload.component"
import {AddEmployeeComponent} from "../add-employee/add-employee.component"
import {EditEmployeeComponent} from "../edit-employee/edit-employee.component"
import {ViewEmployeeComponent} from "../view-employee/view-employee.component"

import Swal from "sweetalert2"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"
import {MaterialDialogConfig} from "@shared/utils/material.utils"
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader"
import {NgxUiLoaderService} from "ngx-ui-loader"

@Component({
  selector: "app-monthly-remittance-employees",
  templateUrl: "./monthly-remittance-employees.component.html",
  styleUrl: "./monthly-remittance-employees.component.css",
  standalone: true,
  imports: [
    TitleCasePipe,
    DecimalPipe,
    MatPaginatorModule,
    MatDialogClose,
    NgToggleModule,
    NgxSkeletonLoaderModule,
  ],
  providers: [EmployeeScheduleService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthlyRemittanceEmployeesComponent implements OnInit, OnDestroy {
  private readonly employeeScheduleService = inject(EmployeeScheduleService)
  private readonly dialog = inject(MatDialog)
  private readonly injectedData =
    inject<BusinessesResInterface>(MAT_DIALOG_DATA)
  private readonly ngxService = inject(NgxUiLoaderService)

  employeeDetails = signal<EmployeeDetailResInterface[] | null>(null)
  anyEmployeeActive = computed(
    () =>
      !!this.employeeDetails()?.find(
        (employee) => employee?.status?.toLowerCase() === "active"
      )
  )
  dataLoading = signal(false)
  btnLoading = signal(false)
  dataMessage = signal("")

  totalLength = signal(0)

  subs = new SubscriptionHandler()

  ngOnInit(): void {
    this.getEmployeeDetail()
  }

  ngOnDestroy(): void {
    this.subs.clear()
  }

  getEmployeeDetail(pageNumber?: number, pageSize?: number) {
    this.dataLoading.set(true)
    this.subs.add = this.employeeScheduleService
      .getEmployeeDetails(
        this.injectedData.businessId.toString(),
        this.injectedData.companyId.toString(),
        pageNumber || 0,
        pageSize
      )
      .subscribe({
        next: (res) => {
          this.dataLoading.set(false)
          if (res.status) {
            this.employeeDetails.set(res.data)
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

  handlePageEvent(event: PageEvent) {
    const pageIndex = event.pageIndex === 0 ? 1 : event.pageIndex
    this.getEmployeeDetail(pageIndex, event.pageSize)
  }

  openCreateSchedule() {
    this.dialog.open(
      CreateScheduleComponent,
      MaterialDialogConfig(this.injectedData)
    )
  }

  openBulkUpload() {
    this.dialog.open(
      BulkUploadComponent,
      MaterialDialogConfig(this.injectedData)
    )
  }

  openAddEmployee() {
    this.dialog.open(
      AddEmployeeComponent,
      MaterialDialogConfig(this.injectedData)
    )
  }

  openEditEmployee(data: EmployeeDetailResInterface) {
    this.dialog.open(
      EditEmployeeComponent,
      MaterialDialogConfig({employee: data, company: this.injectedData})
    )
  }

  openViewEmployee(data: EmployeeDetailResInterface) {
    this.dialog.open(
      ViewEmployeeComponent,
      MaterialDialogConfig({employee: data, company: this.injectedData})
    )
  }

  closeModal() {}

  viewAddEmployee(modal: any) {}

  markAllEmployeeInActive(activate?: boolean) {
    this.btnLoading.set(true)
    const payload = {
      companyId: this.injectedData.companyId.toString(),
      businessId: this.injectedData.businessId.toString(),
      active: activate || false,
      source: "monthly",
    } as MarkEmployeeInterface
    const ask = window.confirm(
      "Are you sure you want to mark all employees inactive?"
    )
    if (ask) {
      this.subs.add = this.employeeScheduleService
        .markEmployeeInactive(payload)
        .subscribe({
          next: (res) => {
            this.btnLoading.set(false)
            if (res.status) {
              this.getEmployeeDetail()
              Swal.fire(SweetAlertOptions(res?.message, true))
            } else {
              Swal.fire(SweetAlertOptions(res?.message))
            }
          },
          error: (err) => {
            this.btnLoading.set(false)
            Swal.fire(SweetAlertOptions(err?.message || err?.error?.message))
          },
        })
    }
    this.btnLoading.set(false)
  }

  switchStatus(event: any, employeeRin?: string) {
    const status = event.target.checked as boolean
    const payload = {
      companyId: this.injectedData.companyId.toString(),
      businessId: this.injectedData.businessId.toString(),
      ...(employeeRin && {employeeRin}),
      active: status,
      source: "monthly",
    } as MarkEmployeeInterface

    const ask = window.confirm(
      "Are you sure you want to change this employee's status?"
    )
    if (ask) {
      this.subs.add = this.employeeScheduleService
        .markEmployeeInactive(payload)
        .subscribe({
          next: (res) => {
            if (res.status) Swal.fire(SweetAlertOptions(res?.message, true))
          },
          error: (err) => {
            Swal.fire(SweetAlertOptions(err?.message || err?.error?.message))
          },
        })
    }
  }

  async downloadExcel() {
    this.btnLoading.set(true)
    this.ngxService.start()
    const payload = {
      companyId: this.injectedData.companyId.toString(),
      businessId: this.injectedData.businessId.toString(),
    } as DownloadEmployeePdfInterface

    try {
      this.ngxService.stop()
      this.btnLoading.set(false)
      const pdf =
        await this.employeeScheduleService.downloadEmployeeExcelMonthly(payload)
      window.open(pdf, "_blank")
    } catch (err: any) {
      // console.log({err})
      this.ngxService.stop()
      this.btnLoading.set(false)
      Swal.fire(SweetAlertOptions(err?.error?.error?.message || err?.message))
    }
  }
}
