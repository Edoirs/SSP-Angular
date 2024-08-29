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
import {MatDialogClose, MatDialogRef} from "@angular/material/dialog"
import {EmployeescheduleComponent} from "../../employeeschedule.component"
import {CommonModule} from "@angular/common"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"

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
  private readonly dialogRef = inject(MatDialogRef<EmployeescheduleComponent>)

  isScheduleYearValid = signal(false)

  subs = new SubscriptionHandler()

  createScheduleForm = new FormGroup({
    scheduleMonthId: new FormControl("", {validators: [Validators.required]}),
    scheduleYear: new FormControl("", {validators: [Validators.required]}),
    comment: new FormControl("", {validators: [Validators.required]}),
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
      .get("scheduleYear")!
      .valueChanges.subscribe((n) => {
        if (parseInt(n as string) < 2010) {
          this.isScheduleYearValid.set(false)
        } else {
          this.isScheduleYearValid.set(true)
        }
      })
  }

  onSubmit() {
    console.log(this.createScheduleForm.value)
  }
}
