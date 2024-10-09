import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
import {CommonModule, DecimalPipe} from "@angular/common"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"
import Swal from "sweetalert2"
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader"
import {AssessmentResInterface} from "../../data-access/assessment.model"

@Component({
  selector: "app-view-assessment",
  templateUrl: "./view-assessment.component.html",
  styleUrl: "./view-assessment.component.css",
  standalone: true,
  imports: [CommonModule, MatDialogClose, DecimalPipe, NgxSkeletonLoaderModule],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewAssesmentComponent implements OnInit, OnDestroy {
  public readonly injectedData = inject<{
    data: AssessmentResInterface
  }>(MAT_DIALOG_DATA)

  loading = signal(false)
  message = signal("")

  subs = new SubscriptionHandler()

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subs.clear()
  }
}
