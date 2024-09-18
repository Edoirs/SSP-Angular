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
import {TccApplicationDetailsComponent} from "../tcc-details/tcc-details.component"
import {TccAppDetailsInterface} from "@admin-pages/tcc-application/data-access/tcc.model"

@Component({
  selector: "app-view-submitted-employee",
  templateUrl: "./view-submitted-tcc.component.html",
  styleUrl: "./view-submitted-tcc.component.css",
  standalone: true,
  imports: [CommonModule, MatDialogClose],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewSubmittedTccApplicationComponent implements OnInit, OnDestroy {
  private readonly dialogRef = inject(
    MatDialogRef<TccApplicationDetailsComponent>
  )
  public readonly injectedData = inject<TccAppDetailsInterface>(MAT_DIALOG_DATA)

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
