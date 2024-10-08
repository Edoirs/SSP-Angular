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
  MatDialog,
  MatDialogClose,
} from "@angular/material/dialog"
import {CommonModule} from "@angular/common"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {
  BusinessesResInterface,
  GetScheduleByDateInterface,
} from "../../data-access/employee-schedule.model"
import {EmployeeScheduleService} from "../../services/employee-schedule.service"
import {ValidYears} from "@shared/utils/shared.utils"
import Swal from "sweetalert2"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"
import {TokenService} from "@shared/services/token.service"
import {Router} from "@angular/router"
import {timer} from "rxjs"

@Component({
  selector: "app-create-schedule",
  templateUrl: "./create-schedule.component.html",
  styleUrl: "./create-schedule.component.css",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatDialogClose],
  providers: [EmployeeScheduleService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateScheduleComponent implements OnInit, OnDestroy {
  private readonly employeeScheduleService = inject(EmployeeScheduleService)
  private readonly router = inject(Router)
  private readonly dialog = inject(MatDialog)
  private readonly injectedData =
    inject<BusinessesResInterface>(MAT_DIALOG_DATA)

  private readonly tokenService = inject(TokenService)

  readonly validYears = ValidYears()

  loading = signal(false)
  message = signal("")

  isScheduleYearValid = signal(false)

  subs = new SubscriptionHandler()

  createScheduleForm = new FormGroup({
    month: new FormControl("", {validators: [Validators.required]}),
    year: new FormControl("", {validators: [Validators.required]}),
    // comment: new FormControl("", {validators: []}),
  })

  ngOnInit(): void {
    this.checkYear()
  }

  ngOnDestroy(): void {
    this.subs.clear()
  }

  closeAllModal() {
    this.dialog.closeAll()
  }

  checkYear() {
    this.subs.add = this.createScheduleForm
      .get("year")!
      .valueChanges.subscribe((n) => {
        if (parseInt(n as string) < 2010) {
          this.isScheduleYearValid.set(false)
        } else {
          this.isScheduleYearValid.set(true)
        }
      })
  }

  onSubmit() {
    let payload = {
      ...this.createScheduleForm.value,
      businessId: this.injectedData.businessId.toString(),
      companyId: this.injectedData.companyId.toString(),
      year: parseInt(this.createScheduleForm.value?.year as string),
    } as Partial<GetScheduleByDateInterface>
    if (this.createScheduleForm.valid) {
      this.loading.set(true)
      this.subs.add = this.employeeScheduleService
        .getScheduleByDate(payload as GetScheduleByDateInterface)
        .subscribe({
          next: (res) => {
            this.loading.set(false)
            if (res.status === true) {
              Swal.fire(SweetAlertOptions(res?.message, true, 2000))
              this.subs.add = timer(2500).subscribe(() => {
                this.closeAllModal()
                this.router.navigate(["/admin/schedules"])
              })
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
}
