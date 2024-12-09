import {Component, inject, OnDestroy, OnInit, signal} from "@angular/core"
import {MatDialog} from "@angular/material/dialog"
import {ChangePasswordModalComponent} from "./ui/change-password/change-password-modal.component"
import {TokenService} from "@shared/services/token.service"
import {AuthService} from "src/app/auth/services/auth.services"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import Swal from "sweetalert2"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"
import {AdminInitChangePasswordInterface} from "src/app/auth/data-access/auth.models"
import {NavigationStart, Router} from "@angular/router"
import {filter} from "rxjs"

@Component({
  selector: "app-main-header",
  templateUrl: "./main-header.component.html",
  styleUrls: ["./main-header.component.css"],
})
export class MainHeaderComponent implements OnInit, OnDestroy {
  public readonly tokenService = inject(TokenService)
  public readonly router = inject(Router)
  public readonly authService = inject(AuthService)
  private readonly dialog = inject(MatDialog)

  curRoute = signal("")

  subs = new SubscriptionHandler()

  constructor() {}

  ngOnInit(): void {
    this.checkRoute()
  }

  ngOnDestroy(): void {
    this.subs.clear()
  }

  checkRoute() {
    // set initial route state on load
    this.curRoute.set(this.router.url)

    // set subsequent route change events
    this.subs.add = this.router.events
      .pipe(filter((e) => e instanceof NavigationStart))
      .subscribe((r) => {
        this.curRoute.set((<NavigationStart>r).url)
      })
  }

  openChangePassword(): void {
    const payload = {
      isAdmin: !!this.tokenService.getLoginResData?.isAdminUser,
      companyRin: !!this.tokenService.getLoginResData?.isAdminUser
        ? this.tokenService.getLoginResData?.email
        : this.tokenService.getLoginResData?.comanyRin,
      phoneNumber: this.tokenService.getLoginResData?.phoneNumber,
    } as AdminInitChangePasswordInterface
    this.subs.add = this.authService
      .adminInitChangePassword(payload)
      .subscribe({
        next: (res) => {
          if (res.status)
            return this.dialog.open(ChangePasswordModalComponent, {
              minWidth: 400,
            })
          return Swal.fire(SweetAlertOptions(res?.message))
        },
        error: (err) => {
          Swal.fire(SweetAlertOptions(err?.error?.message || err?.message))
        },
      })
  }
}
