import {
  ChangeDetectionStrategy,
  Component,
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
} from "../../data-access/employee-schedule.model"
import {EmployeeScheduleService} from "../../services/employee-schedule.service"
import {PositiveNumberRegex} from "../../utils/employeeschedule.utils"
import {MatSnackBar} from "@angular/material/snack-bar"

@Component({
  selector: "app-edit-employee",
  templateUrl: "./edit-employee.component.html",
  styleUrl: "./edit-employee.component.css",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatDialogClose],
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

  private readonly snackBar = inject(MatSnackBar)

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
    ltg: new FormControl(0, {
      validators: [Validators.pattern(PositiveNumberRegex)],
    }),
    utility: new FormControl(0, {
      validators: [Validators.pattern(PositiveNumberRegex)],
    }),
    meal: new FormControl(0, {
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

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subs.clear()
  }

  closeModal() {
    this.dialogRef.close()
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
            if (res.status === true) {
              window.location.reload()
            } else {
              this.snackBar.open(res.message, "close", {duration: 2000})
            }
          },
          complete: () => {
            this.loading.set(false)
          },
        })
  }
}
