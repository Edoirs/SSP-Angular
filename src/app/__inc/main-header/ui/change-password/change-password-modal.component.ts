import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  OnDestroy,
} from "@angular/core"
import {MatFormFieldModule} from "@angular/material/form-field"
import {MatIconModule} from "@angular/material/icon"
import {MatInputModule} from "@angular/material/input"
import {MatButtonModule} from "@angular/material/button"
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms"
import {confirmPasswordValidator} from "@shared/utils/shared.utils"
import {MainHeaderComponent} from "../../main-header.component"
import {AuthService} from "src/app/auth/services/auth.services"
import {AdminChangePasswordInterface} from "src/app/auth/data-access/auth.models"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import Swal from "sweetalert2"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"
import {TokenService} from "@shared/services/token.service"
import {MatDialogRef} from "@angular/material/dialog"

@Component({
  selector: "app-change-password-modal",
  templateUrl: "./change-password-modal.component.html",
  styleUrl: "./change-password-modal.component.scss",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordModalComponent implements OnDestroy {
  private readonly dialogRef = inject(MatDialogRef<MainHeaderComponent>)
  private readonly authService = inject(AuthService)
  private readonly tokenService = inject(TokenService)
  showPassword = signal(false)
  showRepeatPassword = signal(false)

  loading = signal(false)

  subs = new SubscriptionHandler()

  changePasswordForm = new FormGroup({
    otp: new FormControl("", {validators: [Validators.required]}),
    passwords: new FormGroup(
      {
        password: new FormControl("", {
          validators: [Validators.required],
        }),
        password_confirmation: new FormControl("", {
          validators: [Validators.required],
        }),
      },
      {validators: confirmPasswordValidator}
    ),
  })

  get passwords() {
    return this.changePasswordForm.get("passwords")
  }

  get repeatPassword() {
    return this.changePasswordForm
      .get("passwords")
      ?.get("password_confirmation")
  }

  ngOnDestroy(): void {
    this.subs.clear()
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      const payload = {
        isAdmin: !!this.tokenService.getLoginResData?.isAdminUser,
        companyRin_Phone: !!this.tokenService.getLoginResData?.isAdminUser
          ? this.tokenService.getLoginResData?.email
          : this.tokenService.getLoginResData?.comanyRin,
        newPassword: this.changePasswordForm.value.passwords?.password,
        otp: parseInt(this.changePasswordForm.value?.otp as string),
      } as AdminChangePasswordInterface
      this.subs.add = this.authService.adminChangePassword(payload).subscribe({
        next: (res) => {
          if (res.status)
            return Swal.fire(SweetAlertOptions(res?.message, true))
          this.dialogRef.close()
          return Swal.fire(SweetAlertOptions(res?.message))
        },
        error: (err) => {
          Swal.fire(SweetAlertOptions(err?.message || err?.error?.message))
        },
      })
    }
  }
}
