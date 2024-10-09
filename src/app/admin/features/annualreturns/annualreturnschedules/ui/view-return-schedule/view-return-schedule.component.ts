import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core"
import {MAT_DIALOG_DATA, MatDialogClose} from "@angular/material/dialog"
import {CommonModule, DecimalPipe} from "@angular/common"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader"
import {AnnualScheduleReInterface} from "../../data-access/annual-return-schedule.model"

@Component({
  selector: "app-view-return-schedule",
  templateUrl: "./view-return-schedule.component.html",
  styleUrl: "./view-return-schedule.component.css",
  standalone: true,
  imports: [CommonModule, MatDialogClose, DecimalPipe, NgxSkeletonLoaderModule],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewReturnScheduleComponent implements OnInit, OnDestroy {
  public readonly injectedData = inject<{
    data: AnnualScheduleReInterface
  }>(MAT_DIALOG_DATA)

  loading = signal(false)
  message = signal("")

  subs = new SubscriptionHandler()

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subs.clear()
  }
}
