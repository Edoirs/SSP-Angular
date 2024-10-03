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
import {TokenService} from "@shared/services/token.service"

@Component({
  selector: "app-view-formh1-employee",
  templateUrl: "./view-employee.component.html",
  styleUrl: "./view-employee.component.css",
  standalone: true,
  imports: [CommonModule, MatDialogClose, DecimalPipe],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewFormH1EmployeeComponent implements OnInit, OnDestroy {
  public readonly injectedData = inject(MAT_DIALOG_DATA)
  public readonly tokenService = inject(TokenService)

  loading = signal(false)
  message = signal("")

  subs = new SubscriptionHandler()

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subs.clear()
  }
}
