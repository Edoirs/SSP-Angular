import {ChangeDetectionStrategy, Component, inject} from "@angular/core"
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms"
import {MatDialogRef} from "@angular/material/dialog"
import {EmployeescheduleComponent} from "../../employeeschedule.component"

@Component({
  selector: "app-create-schedule",
  templateUrl: "./create-schedule.component.html",
  styleUrl: "./create-schedule.component.css",
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateScheduleComponent {
  private readonly dialogRef = inject(MatDialogRef<EmployeescheduleComponent>)

  createScheduleForm = new FormGroup({
    schedule_month: new FormControl("", {validators: [Validators.required]}),
    schedule_year: new FormControl("", {validators: [Validators.required]}),
    comment: new FormControl("", {validators: [Validators.required]}),
  })

  closeModal() {
    this.dialogRef.close()
  }

  onSubmit() {
    console.log(this.createScheduleForm.value)
  }
}
