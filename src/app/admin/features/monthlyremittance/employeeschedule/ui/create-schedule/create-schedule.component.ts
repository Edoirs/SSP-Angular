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
  GetScheduleByDate,
} from "../../data-access/employee-schedule.model"
import {MatSnackBar} from "@angular/material/snack-bar"
import {EmployeeScheduleService} from "../../services/employee-schedule.service"

@Component({
  selector: "app-create-schedule",
  templateUrl: "./create-schedule.component.html",
  styleUrl: "./create-schedule.component.css",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatDialogClose],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateScheduleComponent implements OnInit, OnDestroy {
  private readonly employeeScheduleService = inject(EmployeeScheduleService)
  private readonly dialogRef = inject(MatDialogRef<EmployeescheduleComponent>)
  private readonly snackBar = inject(MatSnackBar)
  private readonly injectedData =
    inject<BusinessesResInterface>(MAT_DIALOG_DATA)

  loading = signal(false)
  message = signal("")

  isScheduleYearValid = signal(false)

  subs = new SubscriptionHandler()

  createScheduleForm = new FormGroup({
    month: new FormControl("", {validators: [Validators.required]}),
    year: new FormControl("", {validators: [Validators.required]}),
    comment: new FormControl("", {validators: []}),
  })

  ngOnInit(): void {
    this.checkYear()
  }

  ngOnDestroy(): void {
    this.subs.clear()
  }

  closeModal() {
    this.dialogRef.close()
  }

  checkYear() {
    this.subs.add = this.createScheduleForm
      .get("year")!
      .valueChanges.subscribe((n) => {
        if (parseInt(n as string) < 2010) {
          this.isScheduleYearValid.set(false)
        } else {
          this.isScheduleYearValid.set(true)
        }
      })
  }

  onSubmit() {
    const payload = {
      ...this.createScheduleForm.value,
      businessRin: this.injectedData.businessRin,
      companyRin: this.injectedData.companyRin,
    } as Partial<GetScheduleByDate>
    if (this.createScheduleForm.valid) {
      this.loading.set(true)
      this.subs.add = this.employeeScheduleService
        .getScheduleByDate(payload as GetScheduleByDate)
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
}
