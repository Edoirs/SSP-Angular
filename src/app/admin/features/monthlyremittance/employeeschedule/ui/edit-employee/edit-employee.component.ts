import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core"
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms"
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogRef,
} from "@angular/material/dialog"
import {EmployeescheduleComponent} from "../../employeeschedule.component"
import {CommonModule} from "@angular/common"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {
  BusinessesResInterface,
  EditEmployeeIncomeInterface,
  EmployeeDetailResInterface,
  SingleEmployeeDetailResInterface,
} from "../../data-access/employee-schedule.model"
import {EmployeeScheduleService} from "../../services/employee-schedule.service"
import {PositiveNumberRegex} from "../../utils/employeeschedule.utils"
import Swal from "sweetalert2"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader"
import {timer} from "rxjs"

@Component({
  selector: "app-edit-employee",
  templateUrl: "./edit-employee.component.html",
  styleUrl: "./edit-employee.component.css",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatDialogClose,
    NgxSkeletonLoaderModule,
  ],
  providers: [EmployeeScheduleService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditEmployeeComponent implements OnInit, OnDestroy {
  private readonly dialogRef = inject(MatDialogRef<EmployeescheduleComponent>)
  private readonly injectedData = inject<{
    employee: EmployeeDetailResInterface
    company: BusinessesResInterface
  }>(MAT_DIALOG_DATA)
  private readonly employeeScheduleService = inject(EmployeeScheduleService)

  employeeDetail = signal<SingleEmployeeDetailResInterface | null>(null)

  checkFetchedEmployee = effect(() => {
    if (this.employeeDetail()) this.populateForm()
  })

  employeeLoading = signal(false)

  loading = signal(false)
  message = signal("")

  subs = new SubscriptionHandler()

  editEmployeeForm = new FormGroup({
    basic: new FormControl(0, {
      validators: [Validators.pattern(PositiveNumberRegex)],
    }),
    rent: new FormControl(0, {
      validators: [Validators.pattern(PositiveNumberRegex)],
    }),
    transport: new FormControl(0, {
      validators: [Validators.pattern(PositiveNumberRegex)],
    }),
    others: new FormControl(0, {
      validators: [Validators.pattern(PositiveNumberRegex)],
    }),
    nhf: new FormControl(0, {
      validators: [Validators.pattern(PositiveNumberRegex)],
    }),
    nhis: new FormControl(0, {
      validators: [Validators.pattern(PositiveNumberRegex)],
    }),
    pension: new FormControl(0, {
      validators: [Validators.pattern(PositiveNumberRegex)],
    }),
    lifeAssurance: new FormControl(0, {
      validators: [Validators.pattern(PositiveNumberRegex)],
    }),
  })

  constructor() {
    this.checkFetchedEmployee
  }

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
    this.employeeLoading.set(true)
    this.subs.add = this.employeeScheduleService
      .getSingleEmployeeDetail(
        this.injectedData.company.businessId.toString(),
        this.injectedData.company.companyId.toString(),
        this.injectedData.employee.employeeId
      )
      .subscribe({
        next: (res) => {
          this.employeeLoading.set(false)
          if (res.status) {
            this.employeeDetail.set(res.data)
          } else {
            Swal.fire(SweetAlertOptions(res?.message))
          }
        },
        error: (err) => {
          this.employeeLoading.set(false)
          Swal.fire(SweetAlertOptions(err?.error?.message || err?.message))
        },
      })
  }

  populateForm() {
    this.editEmployeeForm.setValue({
      basic: this.employeeDetail()?.basic as number,
      rent: this.employeeDetail()?.rent as number,
      transport: this.employeeDetail()?.transport as number,
      others: this.employeeDetail()?.others as number,
      nhf: this.employeeDetail()?.nhf as number,
      nhis: this.employeeDetail()?.nhis as number,
      pension: this.employeeDetail()?.pension as number,
      lifeAssurance: this.employeeDetail()?.lifeAssurance as number,
    })
  }

  onSubmit() {
    this.loading.set(true)
    const payload = {
      ...this.editEmployeeForm.value,
      businessRin: this.injectedData.company.businessRin,
      companyRin: this.injectedData.company.companyRin,
      employeeRin: this.injectedData.employee.employeeRin,
    } as Partial<EditEmployeeIncomeInterface>
    if (this.editEmployeeForm.valid)
      this.subs.add = this.employeeScheduleService
        .editEmployee(payload as EditEmployeeIncomeInterface)
        .subscribe({
          next: (res) => {
            this.loading.set(false)
            if (res.status === true) {
              Swal.fire(SweetAlertOptions(res?.message, true))
              this.subs.add = timer(5000).subscribe(() =>
                window.location.reload()
              )
            } else {
              Swal.fire(SweetAlertOptions(res?.message))
            }
          },
          error: (err) => {
            this.loading.set(false)
            Swal.fire(SweetAlertOptions(err?.error?.message || err?.message))
          },
        })
  }
}
