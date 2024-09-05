import {
  ChangeDetectionStrategy,
  Component,
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
import {CommonModule} from "@angular/common"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {EmployeeDetailResInterface} from "../../data-access/employee-schedule.model"

@Component({
  selector: "app-view-employee",
  templateUrl: "./view-employee.component.html",
  styleUrl: "./view-employee.component.css",
  standalone: true,
  imports: [CommonModule, MatDialogClose],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewEmployeeComponent implements OnInit, OnDestroy {
  private readonly dialogRef = inject(MatDialogRef<EmployeescheduleComponent>)
  public readonly injectedData =
    inject<EmployeeDetailResInterface>(MAT_DIALOG_DATA)

  loading = signal(false)
  message = signal("")

  subs = new SubscriptionHandler()

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subs.clear()
  }

  closeModal() {
    this.dialogRef.close()
  }
}
