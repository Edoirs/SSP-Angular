import {Component, inject, OnDestroy, signal} from "@angular/core"
import {AddUserFormComponent} from "./ui/add-user-form/add-user-form.component"
import {
  AdminChangePasswordInterface,
  AdminInitChangePasswordInterface,
} from "src/app/auth/data-access/auth.models"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {AuthService} from "src/app/auth/services/auth.services"
import {AuthUtilsService} from "src/app/auth/services/auth-utils.service"
import {
  SweetAlertInfoOption,
  SweetAlertOptions,
} from "@shared/utils/sweet-alert.utils"
import {NgxUiLoaderService} from "ngx-ui-loader"
import Swal from "sweetalert2"
import {Router} from "@angular/router"
import {SettingsRoute} from "@admin-pages/settings/settings.route"

@Component({
  selector: "app-add-user",
  standalone: true,
  imports: [AddUserFormComponent],
  providers: [AuthService, AuthUtilsService],
  templateUrl: "./add-user.component.html",
  styleUrl: "./add-user.component.scss",
})
export class AddUserComponent implements OnDestroy {
  private readonly authService = inject(AuthService)
  public readonly authUtilsService = inject(AuthUtilsService)
  private readonly ngxService = inject(NgxUiLoaderService)
  private readonly router = inject(Router)
  hasRegistered = signal(false)
  subs = new SubscriptionHandler()

  ngOnDestroy(): void {
    this.subs.clear()
  }

  onAdminSubmit(payload: AdminInitChangePasswordInterface) {
    this.ngxService.start()
    this.subs.add = this.authService
      .adminInitChangePassword(payload)
      .subscribe({
        next: (res) => {
          this.ngxService.stop()
          if (res.status == true) {
            this.hasRegistered.set(true)
            this.authUtilsService.saveAuthOtp("admin", res.data || 0)
          } else {
            Swal.fire(SweetAlertOptions(res.message))
          }
        },
        error: (err) => {
          this.ngxService.stop()
          this.hasRegistered.set(false)
          Swal.fire(SweetAlertOptions(err?.error?.message || err?.message))
        },
      })
  }

  createAccountStepThree(jsonData: any) {
    this.ngxService.start()

    this.subs.add = this.authService
      .createAccountStepThree(jsonData)
      .subscribe((data: any) => {
        this.ngxService.stop()
        if (data.status == true) {
          Swal.fire({
            icon: "info",
            title: "Account created successfully",
            text: data.message,
            showConfirmButton: true,
            timer: 5000,
          })
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.message,
            showConfirmButton: true,
            timer: 5000,
          })
        }
      })
  }

  onAdminOtpSubmit(payload: AdminChangePasswordInterface) {
    this.ngxService.start()

    this.subs.add = this.authService.adminChangePassword(payload).subscribe({
      next: (res) => {
        this.ngxService.stop()
        if (res.status == true) {
          Swal.fire(SweetAlertOptions(res.message, true))
          this.router.navigate([
            "/admin",
            "settings",
            SettingsRoute.manageUsers,
          ])
        } else {
          Swal.fire(SweetAlertOptions(res.message))
        }
      },
      error: (err) => {
        this.ngxService.stop()
        Swal.fire(SweetAlertOptions(err?.error?.message || err?.message))
      },
    })
  }
}
