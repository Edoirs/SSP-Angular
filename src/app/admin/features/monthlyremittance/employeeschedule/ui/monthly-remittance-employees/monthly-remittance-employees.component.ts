import {TitleCasePipe} from "@angular/common"
import {
  ChangeDetectionStrategy,
  Component,
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
import {MatSnackBar} from "@angular/material/snack-bar"
import {
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

@Component({
  selector: "app-monthly-remittance-employees",
  templateUrl: "./monthly-remittance-employees.component.html",
  styleUrl: "./monthly-remittance-employees.component.css",
  standalone: true,
  imports: [TitleCasePipe, MatPaginatorModule, MatDialogClose, NgToggleModule],
  providers: [EmployeeScheduleService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthlyRemittanceEmployeesComponent implements OnInit, OnDestroy {
  private readonly employeeScheduleService = inject(EmployeeScheduleService)
  private readonly dialog = inject(MatDialog)
  private readonly snackBar = inject(MatSnackBar)
  private readonly injectedData = inject<any>(MAT_DIALOG_DATA)

  employeeDetails = signal<EmployeeDetailResInterface[] | null>(null)
  dataLoading = signal(false)
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
    this.subs.add = this.employeeScheduleService
      .getEmployeeDetails(
        this.injectedData.businessRin,
        this.injectedData.companyRin,
        pageNumber,
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
    this.dialog.open(AddEmployeeComponent, {
      data: this.injectedData,
      minWidth: 1000,
      maxHeight: 700,
    })
  }

  openEditEmployee(data: EmployeeDetailResInterface) {
    this.dialog.open(
      EditEmployeeComponent,
      MaterialDialogConfig({employee: data, company: this.injectedData})
    )
  }

  openViewEmployee(data: EmployeeDetailResInterface) {
    this.dialog.open(ViewEmployeeComponent, MaterialDialogConfig(data))
  }

  closeModal() {}

  viewAddEmployee(modal: any) {}

  markAllEmployeeInActive() {
    const payload = {
      companyRin: this.injectedData.companyRin,
      businessRin: this.injectedData.businessRin,
    } as MarkEmployeeInterface
    if (window.confirm("Are you sure you want to mark all employees inactive?"))
      this.subs.add = this.employeeScheduleService
        .markAllEmployeeInactive(payload)
        .subscribe({
          next: (res) => {
            if (res.status) return window.location.reload()
            Swal.fire(SweetAlertOptions(res?.message))
          },
          error: (err) => {
            Swal.fire(SweetAlertOptions(err?.message || err?.error?.message))
          },
        })
  }

  switchStatus(event: any, employeeRin?: string) {
    const status = event.target.checked
    const payload = {
      companyRin: this.injectedData.companyRin,
      businessRin: this.injectedData.businessRin,
      ...(employeeRin && {employeeRin}),
    } as MarkEmployeeInterface
    if (
      window.confirm("Are you sure you want to change this employee's status?")
    )
      this.subs.add = this.employeeScheduleService
        .markEmployeeInactive(payload)
        .subscribe({
          next: (res) => {
            Swal.fire(SweetAlertOptions(res?.message))
          },
          error: (err) => {
            Swal.fire(SweetAlertOptions(err?.message || err?.error?.message))
          },
        })
  }

  downloadPdf() {
    const payload = {
      companyRin: this.injectedData.companyRin,
      businessRin: this.injectedData.businessRin,
      taxMonth: this.injectedData.taxMonth,
      taxYear: this.injectedData.taxYear,
    } as DownloadEmployeePdfInterface
    this.subs.add = this.employeeScheduleService
      .downloadEmployeePdf(payload)
      .subscribe({
        next: (res) => {
          if (res.status) window.open(res?.data)
        },
        error: (err) => {
          Swal.fire(SweetAlertOptions(err?.message || err?.error?.message))
        },
      })
  }
}
