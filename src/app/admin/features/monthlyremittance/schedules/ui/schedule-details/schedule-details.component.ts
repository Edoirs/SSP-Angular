import {CommonModule, TitleCasePipe} from "@angular/common"
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
import {MatSnackBar} from "@angular/material/snack-bar"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator"
import {ScheduleService} from "../../services/schedules.service"
import {
  ScheduleDetailResInterface,
  ScheduleResInterface,
  SendRdmInterface,
} from "../../data-access/schedule.model"
import {
  MaterialDialogConfig,
  MaterialSnackErrorConfig,
} from "@shared/utils/material.utils"
import {ViewScheduleComponent} from "../view-schedule/view-schedule.component"

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
  private readonly snackBar = inject(MatSnackBar)
  private readonly injectedData = inject<ScheduleResInterface>(MAT_DIALOG_DATA)
  private readonly scheduleService = inject(ScheduleService)

  buttonLoading = signal(false)

  schedulesData = signal<ScheduleDetailResInterface[] | null>(null)

  showSendToRDM = computed(
    () =>
      this.buttonLoading() ||
      !(
        this.injectedData.assessementStatus.toLowerCase() ===
        "awaiting approval"
      )
  )

  showResendToRDM = computed(
    () =>
      this.buttonLoading() ||
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
        this.injectedData.businessRin,
        this.injectedData.companyRin
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
    this.buttonLoading.set(true)
    const payload: SendRdmInterface = {
      businessRin: this.injectedData.businessRin,
      companyRin: this.injectedData.companyRin,
      taxMonth: this.injectedData.taxMonth,
      taxYear: this.injectedData.taxYear,
    }
    this.subs.add = this.scheduleService.sendToRdm(payload).subscribe({
      next: (res) => {
        this.buttonLoading.set(false)
        if (res.status === true) {
          window.location.reload()
        } else {
          this.snackBar.open(res?.message, "close", {
            duration: 2000,
            horizontalPosition: "right",
            verticalPosition: "top",
          })
        }
      },
      error: (err) => {
        console.error(err)
        this.buttonLoading.set(false)
        this.snackBar.open(
          err?.error?.message || err?.message,
          "close",
          MaterialSnackErrorConfig()
        )
      },
    })
  }

  reSendToRdm() {
    this.buttonLoading.set(true)
    const payload: SendRdmInterface = {
      businessRin: this.injectedData.businessRin,
      companyRin: this.injectedData.companyRin,
      taxMonth: this.injectedData.taxMonth,
      taxYear: this.injectedData.taxYear,
    }
    this.subs.add = this.scheduleService.resendToRdm(payload).subscribe({
      next: (res) => {
        this.buttonLoading.set(false)
        if (res.status === true) {
          window.location.reload()
        } else {
          this.snackBar.open(res?.message, "close", MaterialSnackErrorConfig())
        }
      },
      error: (err) => {
        console.error(err)
        this.buttonLoading.set(false)
        this.snackBar.open(
          err?.error?.message || err?.message,
          "close",
          MaterialSnackErrorConfig()
        )
      },
    })
  }

  reviseSubmission() {
    this.buttonLoading.set(true)
    const payload: SendRdmInterface = {
      businessRin: this.injectedData.businessRin,
      companyRin: this.injectedData.companyRin,
      taxMonth: this.injectedData.taxMonth,
      taxYear: this.injectedData.taxYear,
    }
    this.subs.add = this.scheduleService.reviseSubmission(payload).subscribe({
      next: (res) => {
        this.buttonLoading.set(false)
        if (res.status === true) {
          window.location.reload()
        } else {
          this.snackBar.open(res?.message, "close", MaterialSnackErrorConfig())
        }
      },
      error: (err) => {
        console.error(err)
        this.buttonLoading.set(false)
        this.snackBar.open(
          err?.error?.message || err?.message,
          "close",
          MaterialSnackErrorConfig()
        )
      },
    })
  }

  reAssess() {
    if (
      confirm(
        "Assessment will be recomputed and new amount generated against assessment reference number?"
      )
    )
      this.buttonLoading.set(true)
    const payload: SendRdmInterface = {
      businessRin: this.injectedData.businessRin,
      companyRin: this.injectedData.companyRin,
      taxMonth: this.injectedData.taxMonth,
      taxYear: this.injectedData.taxYear,
    }
    this.subs.add = this.scheduleService.reAssess(payload).subscribe({
      next: (res) => {
        this.buttonLoading.set(false)
        if (res.status === true) {
          window.location.reload()
        } else {
          this.snackBar.open(res?.message, "close", MaterialSnackErrorConfig())
        }
      },
      error: (err) => {
        console.error(err)
        this.buttonLoading.set(false)
        this.snackBar.open(
          err?.error?.message || err?.message,
          "close",
          MaterialSnackErrorConfig()
        )
      },
    })
  }

  downloadPdf() {
    this.buttonLoading.set(true)
    const payload: SendRdmInterface = {
      businessRin: this.injectedData.businessRin,
      companyRin: this.injectedData.companyRin,
      taxMonth: this.injectedData.taxMonth,
      taxYear: this.injectedData.taxYear,
    }
    this.subs.add = this.scheduleService.downloadPdf(payload).subscribe({
      next: (res) => {
        this.buttonLoading.set(false)
        if (res.status === true) {
          console.log(res.data)
          // window.location.href = res.data
        } else {
          this.snackBar.open(res?.message, "close", MaterialSnackErrorConfig())
        }
      },
      error: (err) => {
        console.error(err)
        this.snackBar.open(
          err?.error?.message || err?.message,
          "close",
          MaterialSnackErrorConfig()
        )
        this.buttonLoading.set(false)
      },
    })
  }
}
