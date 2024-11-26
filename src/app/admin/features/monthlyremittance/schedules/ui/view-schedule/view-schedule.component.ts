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
import {CommonModule} from "@angular/common"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {ScheduleDetailResInterfaceItems} from "../../data-access/schedule.model"

@Component({
  selector: "app-view-employee",
  templateUrl: "./view-schedule.component.html",
  styleUrl: "./view-schedule.component.css",
  standalone: true,
  imports: [CommonModule, MatDialogClose],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewScheduleComponent implements OnInit, OnDestroy {
  public readonly injectedData =
    inject<ScheduleDetailResInterfaceItems>(MAT_DIALOG_DATA)

  loading = signal(false)
  message = signal("")

  subs = new SubscriptionHandler()

  ngOnInit(): void {
    // console.log(this.injectedData)
  }

  ngOnDestroy(): void {
    this.subs.clear()
  }
}
