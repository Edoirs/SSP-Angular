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
import {CommonModule} from "@angular/common"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {AnnualProjectionService} from "../../../../services/annual-projection.service"
import Swal from "sweetalert2"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"
import {UploadprojectionComponent} from "../../uploadprojection.component"
import {PositiveNumberRegex} from "@admin-pages/monthlyremittance/employeeschedule/utils/employeeschedule.utils"
import {timer} from "rxjs"

@Component({
  selector: "app-edit-employee",
  templateUrl: "./forward-projection.component.html",
  styleUrl: "./forward-projection.component.css",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatDialogClose],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForwaedProjectionComponent implements OnInit, OnDestroy {
  private readonly annualProjectionService = inject(AnnualProjectionService)
  private readonly dialogRef = inject(MatDialogRef<UploadprojectionComponent>)
  private readonly injectedData = inject(MAT_DIALOG_DATA)

  loading = signal(false)
  message = signal("")

  subs = new SubscriptionHandler()

  forwardProjectionForm = new FormGroup({
    taxYear: new FormControl(0, {
      validators: [
        Validators.pattern(PositiveNumberRegex),
        Validators.required,
      ],
    }),
  })

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subs.clear()
  }

  closeModal() {
    this.dialogRef.close()
  }

  onSubmit() {
    this.loading.set(true)
    if (this.forwardProjectionForm.valid)
      this.subs.add = this.annualProjectionService
        .forwardProjection(this.forwardProjectionForm.value)
        .subscribe({
          next: (res) => {
            this.loading.set(false)
            if (res.status === true) {
              Swal.fire(SweetAlertOptions(res?.message, true))
              this.subs.add = timer(5000).subscribe(() =>
                window.location.reload()
              )
            } else {
              Swal.fire(SweetAlertOptions(res?.message))
            }
          },
          error: (err) => {
            this.loading.set(false)
            Swal.fire(SweetAlertOptions(err?.message || err?.error?.message))
          },
        })
  }
}
