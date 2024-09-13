import {Component, inject, OnDestroy, OnInit} from "@angular/core"
import {MatDialog} from "@angular/material/dialog"
import {ChangePasswordModalComponent} from "./ui/change-password/change-password-modal.component"
import {TokenService} from "@shared/services/token.service"
import {AuthService} from "src/app/auth/services/auth.services"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import Swal from "sweetalert2"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"
import {AdminInitChangePasswordInterface} from "src/app/auth/data-access/auth.models"

@Component({
  selector: "app-main-header",
  templateUrl: "./main-header.component.html",
  styleUrls: ["./main-header.component.css"],
})
export class MainHeaderComponent implements OnInit, OnDestroy {
  public readonly tokenService = inject(TokenService)
  public readonly authService = inject(AuthService)
  private readonly dialog = inject(MatDialog)
  roleID: any
  roleName: any
  name: any
  middleName: any
  lastName: any

  subs = new SubscriptionHandler()

  constructor() {}

  ngOnInit(): void {
    this.roleID = localStorage.getItem("niswasec_role_id")
    this.roleName = localStorage.getItem("niswasec_role_name")
    this.name = localStorage.getItem("niswasec_name")
    this.middleName = localStorage.getItem("niswasec_middle_name")
    this.lastName = localStorage.getItem("niswasec_last_name")
  }

  ngOnDestroy(): void {
    this.subs.clear()
  }

  openChangePassword(): void {
    const payload = {
      isAdmin: this.tokenService.getLoginResData?.isAdminUser ? true : false,
      companyRin: this.tokenService.getLoginResData?.isAdminUser
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
        error: (err) =>
          Swal.fire(SweetAlertOptions(err?.message || err?.error?.message)),
      })
  }
}
