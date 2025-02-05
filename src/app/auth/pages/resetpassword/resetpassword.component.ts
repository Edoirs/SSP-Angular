import {Component, OnDestroy} from "@angular/core"
import {HttpClient, HttpHeaders} from "@angular/common/http"
import {Router} from "@angular/router"
import {environment} from "../../../../environments/environment"
import Swal from "sweetalert2"
import {FormBuilder, FormGroup, Validators} from "@angular/forms"
import {NgxUiLoaderService} from "ngx-ui-loader"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {error} from "jquery"
@Component({
  selector: "app-resetpassword",
  templateUrl: "./resetpassword.component.html",
  styleUrls: ["./resetpassword.component.css"],
})
export class ResetpasswordComponent implements OnDestroy {
  resetPasswordForm!: FormGroup
  submitted = false
  apiUrl: any
  emailAddress: any
  fieldTextType!: boolean
  fieldTextType2!: boolean
  showForgotPasswordForm: boolean = false

  fieldTextType3!: boolean

  subs = new SubscriptionHandler()

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.emailAddress = localStorage.getItem("niswasec_username")
    this.initialiseForms()
  }

  ngOnDestroy(): void {
    this.subs.clear()
  }

  initialiseForms() {
    this.resetPasswordForm = this.formBuilder.group({
      emailAddress: [
        "",
        [Validators.required, Validators.maxLength(45), Validators.email],
      ],
      defaultPassword: ["", [Validators.required]],
      newPassword: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(40),
          // Validators.pattern(
          //   "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
          // ),
        ],
      ],
      enterOtp: [
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
  onSubmitResetPassword(formAllData: any) {
    this.submitted = true

    if (this.resetPasswordForm.invalid) {
      return
    }
    var requestObj = {
      email: this.emailAddress,
      default_password: formAllData.defaultPassword,
      password: formAllData.newPassword,
      otp: formAllData.enterOtp,
    }
    this.ngxService.start()
    this.apiUrl = environment.AUTHAPIURL + "auth/reset-default-password"

    this.http.post<any>(this.apiUrl, requestObj).subscribe({
      next: (data) => {
        this.ngxService.stop()
        if (data.status == true) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: data.message,
            showConfirmButton: true,
            timer: 5000,
            timerProgressBar: true,
          })
          if (data.response != null) {
          }
          setTimeout(() => {
            this.router.navigate(["/login"])
          }, 1000)
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.message,
            showConfirmButton: true,
            timer: 5000,
            timerProgressBar: true,
          })
        }
      },
      error: (err) => {
        this.ngxService.stop()
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err?.error?.message || err?.message,
          showConfirmButton: true,
          timer: 5000,
          timerProgressBar: true,
        })
      },
    })
  }
}
