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
  providers: [],
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
    totalIncome: new FormControl(this.injectedData.employee.totalIncome, {
      validators: [Validators.pattern(PositiveNumberRegex)],
    }),
    grossIncome: new FormControl(this.injectedData.employee.grossIncome, {
      validators: [Validators.pattern(PositiveNumberRegex)],
    }),
    non_TaxableIncome: new FormControl(
      this.injectedData.employee.non_TaxableIncome,
      {
        validators: [Validators.pattern(PositiveNumberRegex)],
      }
    ),
  })

  ngOnInit(): void {
    console.log(this.injectedData.company)
  }

  ngOnDestroy(): void {
    this.subs.clear()
  }

  closeModal() {
    this.dialogRef.close()
  }

  onSubmit() {
    const payload = {
      ...this.editEmployeeForm.value,
      businessRin: this.injectedData.company.businessRin,
      companyRin: this.injectedData.company.companyRin,
    } as Partial<EditEmployeeIncomeInterface>
    console.log(this.editEmployeeForm.value)
    if (this.editEmployeeForm.valid)
      this.subs.add = this.employeeScheduleService
        .editEmployee(payload as EditEmployeeIncomeInterface)
        .subscribe({
          next: (res) => {
            window.location.reload()
          },
          error: (err) => {
            this.snackBar.open(err.message, "close", {duration: 2000})
          },
        })
  }
}
