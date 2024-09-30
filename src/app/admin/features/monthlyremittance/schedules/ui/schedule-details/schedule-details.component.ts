import {CommonModule, DecimalPipe, TitleCasePipe} from "@angular/common"
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
import {ScheduleService} from "../../services/schedules.service"
import {
  ScheduleDetailResInterface,
  ScheduleResInterface,
  SendRdmInterface,
} from "../../data-access/schedule.model"
import {MaterialDialogConfig} from "@shared/utils/material.utils"
import {ViewScheduleComponent} from "../view-schedule/view-schedule.component"
import Swal from "sweetalert2"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"
import {EmployeeScheduleService} from "@admin-pages/monthlyremittance/employeeschedule/services/employee-schedule.service"
import {DownloadEmployeePdfInterface} from "@admin-pages/monthlyremittance/employeeschedule/data-access/employee-schedule.model"
import {timer} from "rxjs"

@Component({
  selector: "app-schedule-details",
  templateUrl: "./schedule-details.component.html",
  styleUrl: "./schedule-details.component.css",
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, MatDialogClose],
  providers: [ScheduleService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleDetailsComponent implements OnInit, OnDestroy {
  private readonly dialog = inject(MatDialog)
  private readonly injectedData = inject<ScheduleResInterface>(MAT_DIALOG_DATA)
  private readonly scheduleService = inject(ScheduleService)
  private readonly employeeScheduleService = inject(EmployeeScheduleService)
  btnLoading = signal(false)

  schedulesData = signal<ScheduleDetailResInterface[] | null>(null)

  showSendToRDM = computed(
    () =>
      this.btnLoading() ||
      !(
        this.injectedData.assessementStatus.toLowerCase() ===
        "awaiting approval"
      )
  )

  showResendToRDM = computed(
    () =>
      this.btnLoading() ||
      !(this.injectedData.assessementStatus.toLowerCase() === "re-assessed")
  )

  subs = new SubscriptionHandler()

  ngOnInit(): void {
    this.getEmployeeDetail()
  }

  ngOnDestroy(): void {
    this.subs.clear()
  }

  getEmployeeDetail(pageNumber?: number, pageSize?: number) {
    this.subs.add = this.scheduleService
      .getScheduleView(
        this.injectedData.businessId,
        this.injectedData.companyId
      )
      .subscribe((res) => {
        this.schedulesData.set(res.data)
      })
  }

  handlePageEvent(event: PageEvent) {
    const pageIndex = event.pageIndex === 0 ? 1 : event.pageIndex
    this.getEmployeeDetail(pageIndex, event.pageSize)
  }

  viewSchedule(data: ScheduleDetailResInterface) {
    this.dialog.open(ViewScheduleComponent, MaterialDialogConfig(data))
  }

  sendToRdm() {
    this.btnLoading.set(true)
    const payload: SendRdmInterface = {
      businessId: this.injectedData.businessId,
      companyId: this.injectedData.companyId,
      taxMonth: this.injectedData.taxMonth,
      taxYear: this.injectedData.taxYear,
    }
    this.subs.add = this.scheduleService.sendToRdm(payload).subscribe({
      next: (res) => {
        this.btnLoading.set(false)
        if (res.status === true) {
          Swal.fire(SweetAlertOptions(res?.message, true))
          this.subs.add = timer(5000).subscribe(() => window.location.reload())
        } else {
          Swal.fire(SweetAlertOptions(res?.message))
        }
      },
      error: (err) => {
        console.error(err)
        this.btnLoading.set(false)
        Swal.fire(SweetAlertOptions(err?.error?.message || err?.message))
      },
    })
  }

  reSendToRdm() {
    this.btnLoading.set(true)
    const payload: SendRdmInterface = {
      businessId: this.injectedData.businessId,
      companyId: this.injectedData.companyId,
      taxMonth: this.injectedData.taxMonth,
      taxYear: this.injectedData.taxYear,
    }
    this.subs.add = this.scheduleService.resendToRdm(payload).subscribe({
      next: (res) => {
        this.btnLoading.set(false)
        if (res.status === true) {
          Swal.fire(SweetAlertOptions(res?.message, true))
          this.subs.add = timer(5000).subscribe(() => window.location.reload())
        } else {
          Swal.fire(SweetAlertOptions(res?.message))
        }
      },
      error: (err) => {
        console.error(err)
        this.btnLoading.set(false)
        Swal.fire(SweetAlertOptions(err?.error?.message || err?.message))
      },
    })
  }

  reviseSubmission() {
    this.btnLoading.set(true)
    const payload: SendRdmInterface = {
      businessId: this.injectedData.businessId,
      companyId: this.injectedData.companyId,
      taxMonth: this.injectedData.taxMonth,
      taxYear: this.injectedData.taxYear,
    }
    this.subs.add = this.scheduleService.reviseSubmission(payload).subscribe({
      next: (res) => {
        this.btnLoading.set(false)
        if (res.status === true) {
          Swal.fire(SweetAlertOptions(res?.message, true))
          this.subs.add = timer(5000).subscribe(() => window.location.reload())
        } else {
          Swal.fire(SweetAlertOptions(res?.message))
        }
      },
      error: (err) => {
        console.error(err)
        this.btnLoading.set(false)
        Swal.fire(SweetAlertOptions(err?.error?.message || err?.message))
      },
    })
  }

  reAssess() {
    if (
      confirm(
        "Assessment will be recomputed and new amount generated against assessment reference number?"
      )
    )
      this.btnLoading.set(true)
    const payload: SendRdmInterface = {
      businessId: this.injectedData.businessId,
      companyId: this.injectedData.companyId,
      taxMonth: this.injectedData.taxMonth,
      taxYear: this.injectedData.taxYear,
    }
    this.subs.add = this.scheduleService.reAssess(payload).subscribe({
      next: (res) => {
        this.btnLoading.set(false)
        if (res.status === true) {
          Swal.fire(SweetAlertOptions(res?.message, true))
          this.subs.add = timer(5000).subscribe(() => window.location.reload())
        } else {
          Swal.fire(SweetAlertOptions(res?.message))
        }
      },
      error: (err) => {
        console.error(err)
        this.btnLoading.set(false)
        Swal.fire(SweetAlertOptions(err?.error?.message || err?.message))
      },
    })
  }

  async downloadPdf() {
    this.btnLoading.set(true)
    const payload = {
      companyRin: this.injectedData.companyRin,
      businessRin: this.injectedData.businessRin,
    } as DownloadEmployeePdfInterface

    try {
      this.btnLoading.set(false)
      const pdf = await this.employeeScheduleService.downloadEmployeePdfMonthly(
        payload
      )
      window.open(pdf, "_blank")
    } catch (err: any) {
      console.log({err})
      this.btnLoading.set(false)
      Swal.fire(SweetAlertOptions(err?.error?.error?.message || err?.message))
    }
  }
}
