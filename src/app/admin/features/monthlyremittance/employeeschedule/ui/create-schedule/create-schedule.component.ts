import {ChangeDetectionStrategy, Component, inject, signal} from "@angular/core"
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms"
import {MatDialogClose, MatDialogRef} from "@angular/material/dialog"
import {EmployeescheduleComponent} from "../../employeeschedule.component"
import {CommonModule} from "@angular/common"

@Component({
  selector: "app-create-schedule",
  templateUrl: "./create-schedule.component.html",
  styleUrl: "./create-schedule.component.css",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatDialogClose],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateScheduleComponent {
  private readonly dialogRef = inject(MatDialogRef<EmployeescheduleComponent>)

  isScheduleYearValid = signal(false)

  createScheduleForm = new FormGroup({
    scheduleMonth: new FormControl("", {validators: [Validators.required]}),
    scheduleYear: new FormControl("", {validators: [Validators.required]}),
    comment: new FormControl("", {validators: [Validators.required]}),
  })

  closeModal() {
    this.dialogRef.close()
  }

  toggleScheduleYear(year: any) {
    if (year < 2010) {
      this.isScheduleYearValid.set(false)
    } else {
      this.isScheduleYearValid.set(true)
    }
  }

  onSubmit() {
    console.log(this.createScheduleForm.value)
  }
}
