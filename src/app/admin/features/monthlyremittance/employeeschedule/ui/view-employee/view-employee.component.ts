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
  MatDialogClose,
  MatDialogRef,
} from "@angular/material/dialog"
import {EmployeescheduleComponent} from "../../employeeschedule.component"
import {CommonModule, DecimalPipe} from "@angular/common"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {
  BusinessesResInterface,
  EmployeeDetailResInterface,
  SingleEmployeeDetailResInterface,
} from "../../data-access/employee-schedule.model"
import {EmployeeScheduleService} from "../../services/employee-schedule.service"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"
import Swal from "sweetalert2"
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader"

@Component({
  selector: "app-view-employee",
  templateUrl: "./view-employee.component.html",
  styleUrl: "./view-employee.component.css",
  standalone: true,
  imports: [CommonModule, MatDialogClose, DecimalPipe, NgxSkeletonLoaderModule],
  providers: [EmployeeScheduleService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewEmployeeComponent implements OnInit, OnDestroy {
  private readonly dialogRef = inject(MatDialogRef<EmployeescheduleComponent>)
  public readonly injectedData = inject<{
    employee: EmployeeDetailResInterface
    company: BusinessesResInterface
  }>(MAT_DIALOG_DATA)
  private readonly employeeScheduleService = inject(EmployeeScheduleService)

  employeeDetail = signal<SingleEmployeeDetailResInterface | null>(null)

  grossIncome = computed(
    () =>
      (this.employeeDetail()?.basic || 0) +
      (this.employeeDetail()?.rent || 0) +
      (this.employeeDetail()?.transport || 0) +
      (this.employeeDetail()?.others || 0)
  )

  totalIncome = computed(
    () =>
      (this.grossIncome() || 0) +
      (this.employeeDetail()?.pension || 0) +
      (this.employeeDetail()?.nhf || 0) +
      (this.employeeDetail()?.nhis || 0) +
      (this.employeeDetail()?.lifeAssurance || 0)
  )

  loading = signal(false)
  message = signal("")

  subs = new SubscriptionHandler()

  ngOnInit(): void {
    this.getEmployeeDetails()
  }

  ngOnDestroy(): void {
    this.subs.clear()
  }

  closeModal() {
    this.dialogRef.close()
  }

  getEmployeeDetails() {
    this.loading.set(true)
    this.subs.add = this.employeeScheduleService
      .getSingleEmployeeDetail(
        this.injectedData.company.businessId.toString(),
        this.injectedData.company.companyId.toString(),
        this.injectedData.employee.employeeId
      )
      .subscribe({
        next: (res) => {
          this.loading.set(false)
          if (res.status) {
            this.employeeDetail.set(res.data)
          } else {
            Swal.fire(SweetAlertOptions(res?.message))
          }
        },
        error: (err) => {
          this.loading.set(false)
          Swal.fire(SweetAlertOptions(err?.message || err?.error?.message))
        },
      })
  }
}
