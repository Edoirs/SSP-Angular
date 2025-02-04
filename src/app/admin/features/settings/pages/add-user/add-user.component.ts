import {Component, inject, OnDestroy, signal} from "@angular/core"
import {AddUserFormComponent} from "./ui/add-user-form/add-user-form.component"
import {AdminCreateUserInterface} from "src/app/auth/data-access/auth.models"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {AuthService} from "src/app/auth/services/auth.services"
import {AuthUtilsService} from "src/app/auth/services/auth-utils.service"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"
import {NgxUiLoaderService} from "ngx-ui-loader"
import Swal from "sweetalert2"
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
  hasRegistered = signal(false)
  subs = new SubscriptionHandler()

  ngOnDestroy(): void {
    this.subs.clear()
  }

  onAdminSubmit(payload: AdminCreateUserInterface) {
    this.ngxService.start()
    this.subs.add = this.authService.adminCreateUser(payload).subscribe({
      next: (res) => {
        this.ngxService.stop()
        if (res.status == true) {
          this.hasRegistered.set(true)
          Swal.fire(SweetAlertOptions(res.message, true))
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
}
