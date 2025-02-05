import {Component, inject, OnDestroy} from "@angular/core"
import {HttpClient, HttpHeaders} from "@angular/common/http"
import {Router} from "@angular/router"
import {environment} from "../../../../environments/environment"
import Swal from "sweetalert2"
import {FormBuilder, FormGroup, Validators} from "@angular/forms"
import {NgxUiLoaderService} from "ngx-ui-loader"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {error} from "jquery"
import {AdminChangePasswordInterface} from "../../data-access/auth.models"
import {AuthService} from "../../services/auth.services"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"
@Component({
  selector: "app-resetpassword",
  templateUrl: "./resetpassword.component.html",
  styleUrls: ["./resetpassword.component.css"],
})
export class ResetpasswordComponent implements OnDestroy {
  private readonly authService = inject(AuthService)
  resetPasswordForm!: FormGroup
  submitted = false
  apiUrl: any
  fieldTextType!: boolean
  fieldTextType2!: boolean

  fieldTextType3!: boolean

  timeOut?: any

  subs = new SubscriptionHandler()

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.initialiseForms()
  }

  ngOnDestroy(): void {
    this.subs.clear()
    clearTimeout(this.timeOut)
  }

  initialiseForms() {
    this.resetPasswordForm = this.formBuilder.group({
      email: [
        "",
        [Validators.required, Validators.maxLength(45), Validators.email],
      ],
      newPassword: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(40),
        ],
      ],
      otp: [
        "",
        [
          Validators.maxLength(6),
          Validators.minLength(6),
          Validators.pattern(/^[0-9]*$/),
        ],
      ],
    })
  }
  toggleFieldTextType1() {
    this.fieldTextType = !this.fieldTextType
  }

  toggleFieldTextType2() {
    this.fieldTextType2 = !this.fieldTextType2
  }

  toggleFieldTextType3() {
    this.fieldTextType3 = !this.fieldTextType3
  }
  onSubmitResetPassword() {
    this.submitted = true

    if (this.resetPasswordForm.invalid) {
      return
    }
    let payload: AdminChangePasswordInterface = {
      companyRin_Phone: this.resetPasswordForm?.value?.email,
      newPassword: this.resetPasswordForm?.value?.newPassword,
      isAdmin: true,
      otp: this.resetPasswordForm?.value?.otp,
    }
    this.ngxService.start()
    this.apiUrl = 1
    this.subs.add = this.authService.adminChangePassword(payload).subscribe({
      next: (data) => {
        this.ngxService.stop()
        if (data.status == true) {
          Swal.fire(SweetAlertOptions(data?.message, true))
          this.timeOut = setTimeout(() => {
            this.router.navigate(["/login"])
          }, 3000)
        } else {
          Swal.fire(SweetAlertOptions(data?.message))
        }
      },
      error: (err) => {
        this.ngxService.stop()
        Swal.fire(SweetAlertOptions(err?.error?.message || err?.message))
      },
    })
  }
}
