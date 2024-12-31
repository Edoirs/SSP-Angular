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
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator"

import Swal from "sweetalert2"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"
import {MaterialDialogConfig} from "@shared/utils/material.utils"
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader"
import {NgxUiLoaderService} from "ngx-ui-loader"
import {AnnualAssesmentService} from "@admin-pages/annualreturns/data-access/services/annual-return.service"
import {ViewFormH1EmployeeComponent} from "../view-employee/view-employee.component"

@Component({
  selector: "app-annual-assesment-companies",
  templateUrl: "./annual-assesment-companies.component.html",
  styleUrl: "./annual-assesment-companies.component.css",
  standalone: true,
  imports: [
    TitleCasePipe,
    DecimalPipe,
    MatPaginatorModule,
    MatDialogClose,
    NgxSkeletonLoaderModule,
  ],
  providers: [AnnualAssesmentService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnualAssesmentCompaniesComponent implements OnInit, OnDestroy {
  private readonly annualAssesmentService = inject(AnnualAssesmentService)
  private readonly dialog = inject(MatDialog)
  private readonly injectedData = inject<any>(MAT_DIALOG_DATA)
  private readonly ngxService = inject(NgxUiLoaderService)

  employeeDetails = signal<any[] | null>(null)
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
    this.subs.add = this.annualAssesmentService
      .getBusinesses(
        this.injectedData.businessId.toString(),
        this.injectedData.companyId.toString(),
        pageNumber || 1
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
          this.dataMessage.set(err?.error?.message || err?.message)
          Swal.fire(SweetAlertOptions(err?.error?.message || err?.message))
        },
      })
  }

  handlePageEvent(event: PageEvent) {
    const pageIndex = event.pageIndex === 0 ? 1 : event.pageIndex
    this.getEmployeeDetail(pageIndex, event.pageSize)
  }

  openViewEmployee(data: any) {
    this.dialog.open(
      ViewFormH1EmployeeComponent,
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
    } as any
    const ask = window.confirm(
      "Are you sure you want to mark all employees inactive?"
    )
    if (ask) {
      this.subs.add = this.annualAssesmentService
        .getBusinesses(payload)
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
            Swal.fire(SweetAlertOptions(err?.error?.message || err?.message))
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
    } as any

    const ask = window.confirm(
      "Are you sure you want to change this employee's status?"
    )
    if (ask) {
      this.subs.add = this.annualAssesmentService
        .getBusinesses(payload)
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

  async downloadExcel() {
    this.btnLoading.set(true)
    this.ngxService.start()
    const payload = {
      companyId: this.injectedData.companyId.toString(),
      businessId: this.injectedData.businessId.toString(),
    } as any

    try {
      this.ngxService.stop()
      this.btnLoading.set(false)
      const pdf: any = await this.annualAssesmentService.getBusinesses(payload)
      window.open(pdf, "_blank")
    } catch (err: any) {
      // console.log({err})
      this.ngxService.stop()
      this.btnLoading.set(false)
      Swal.fire(SweetAlertOptions(err?.error?.error?.message || err?.message))
    }
  }
}
