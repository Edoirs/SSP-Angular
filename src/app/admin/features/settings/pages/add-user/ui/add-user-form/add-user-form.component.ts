import {NgClass} from "@angular/common"
import {
  Component,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
} from "@angular/core"
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {
  SweetAlertInfoOption,
  SweetAlertOptions,
} from "@shared/utils/sweet-alert.utils"
import {NgxUiLoaderService} from "ngx-ui-loader"
import {
  switchMap,
  tap,
  of,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  map,
} from "rxjs"
import {
  AdminChangePasswordInterface,
  AdminInitChangePasswordInterface,
} from "src/app/auth/data-access/auth.models"
import {AuthService} from "src/app/auth/services/auth.services"
import Swal from "sweetalert2"

@Component({
  selector: "app-add-user-form",
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: "./add-user-form.component.html",
  styleUrl: "./add-user-form.component.scss",
})
export class AddUserFormComponent implements OnInit, OnDestroy {
  private readonly ngxService = inject(NgxUiLoaderService)
  private readonly authService = inject(AuthService)
  isRegisterSent = input.required()
  adminSignUpEvent = output<AdminInitChangePasswordInterface>()
  otpSignUpEvent = output<AdminChangePasswordInterface>()
  message = input("")

  adminSignUpForm = new FormGroup({
    phoneNumber: new FormControl("", {validators: [Validators.required]}),
    userName: new FormControl("", {
      validators: [Validators.required, Validators.email],
    }),
  })

  get adminEmail() {
    return this.adminSignUpForm.get("userName")
  }

  get adminPhone() {
    return this.adminSignUpForm.get("phoneNumber")
  }

  subs = new SubscriptionHandler()

  ngOnInit(): void {
    this.getCompanyDetails()
  }

  ngOnDestroy(): void {
    this.subs.clear()
  }

  getCompanyDetails() {
    this.subs.add = this.adminEmail!.valueChanges.pipe(
      debounceTime(1500),
      distinctUntilChanged(),
      tap(() => {
        this.ngxService.start()
      }),
      switchMap((email) => {
        if (email)
          return this.authService.signUpUserStepOne({
            companyRin: email as unknown as string,
          })

        return EMPTY
      })
    ).subscribe({
      next: (res) => {
        this.ngxService.stop()
        if (res.status == true) {
          Swal.fire(SweetAlertInfoOption(res?.message))
          this.adminSignUpForm.patchValue({
            phoneNumber: res?.data?.phoneNumber,
          })
          this.adminPhone?.disable()
        } else {
          Swal.fire(SweetAlertOptions(res?.message))
        }
      },
      error: (err) => {
        this.ngxService.stop()
        Swal.fire(SweetAlertOptions(err?.error?.message || err?.message))
      },
    })
  }

  onAdminSubmit() {
    if (this.adminSignUpForm.valid) {
      const payload = {
        isAdmin: true,
        companyRin: this.adminEmail?.value,
      } as AdminInitChangePasswordInterface

      this.adminSignUpEvent.emit(payload)
    }
  }
}
