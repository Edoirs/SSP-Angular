import {Component, inject, OnDestroy, OnInit} from "@angular/core"
import {Router} from "@angular/router"

import Swal from "sweetalert2"
import {FormBuilder, FormGroup, Validators} from "@angular/forms"
import {NgxUiLoaderService} from "ngx-ui-loader"
import {TokenService} from "@shared/services/token.service"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {
  SweetAlertInfoOption,
  SweetAlertOptions,
} from "@shared/utils/sweet-alert.utils"
import {LoginService} from "./service/login.service"
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly tokenService = inject(TokenService)
  private readonly loginService = inject(LoginService)
  submitted = false
  apiUrl: any
  loginForm!: FormGroup
  otpForm!: FormGroup
  showLoginForm: boolean = true
  showOtpForm: boolean = false
  defaultPwd!: boolean
  fieldTextType: boolean = false
  fieldTextType2: boolean = false
  status: any
  appKey: any
  md5: any
  rinPhoneNumber: any
  password: any
  companyId: any

  subs = new SubscriptionHandler()

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.initialiseForms()
    this.initialiseOtpForm()
  }

  ngOnDestroy(): void {
    this.subs.clear()
  }

  initialiseForms() {
    this.loginForm = this.formBuilder.group({
      rinPhoneNumber: [
        "",
        [
          Validators.required,
          // Validators.minLength(11),
          // Validators.maxLength(11),
          // Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/),
        ],
      ],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(40),
        ],
      ],
      // rememberMe: [false, []],
      taxTypeId: ["", Validators.required],
      // captcha: ['', Validators.required],
    })
  }

  initialiseOtpForm() {
    this.otpForm = this.formBuilder.group({
      enterOtp: ["", [Validators.required, Validators.pattern(/^[0-9]*$/)]],
    })
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType
  }

  toggleFieldTextType2() {
    this.fieldTextType2 = !this.fieldTextType2
  }

  checkEmail(formAllData: any) {
    this.submitted = true

    if (this.loginForm.controls["emailAddress"].status === "INVALID") {
      return
    }

    let requestObj = {
      email: formAllData.emailAddress,
    }

    this.ngxService.start()
    this.subs.add = this.loginService
      .sendOtp(requestObj)
      .subscribe((data: any) => {
        this.ngxService.stop()
        if (data.status == true) {
          this.showOtpForm = true
          this.submitted = false
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "The OTP has been sent to mail successfully!",
            showConfirmButton: true,
            timer: 100000,
            timerProgressBar: true,
          })
        } else {
          this.showLoginForm = true
          this.showOtpForm = false

          Swal.fire({
            icon: "error",
            title: "Oops...",
            text:
              data.response != null ? data.response[0].message : data.message,
            showConfirmButton: true,
            timer: 5000,
            timerProgressBar: true,
          })
        }
      })
  }

  onSubmit(formAllData: any) {
    this.submitted = true

    if (this.loginForm.invalid) {
      // console.log("Here is we!")
      return
    }

    this.password = formAllData.password
    this.rinPhoneNumber = formAllData.rinPhoneNumber

    var requestObj = {
      userType: formAllData.taxTypeId,
      password: this.password,
      phoneNumber_RIN: this.rinPhoneNumber,
    }

    this.ngxService.start()
    this.subs.add = this.loginService.signIn(requestObj).subscribe({
      next: (data: any) => {
        this.ngxService.stop()

        if (data != null) {
          this.defaultPwd =
            data.hasDefaultPassword == undefined
              ? false
              : data.hasDefaultPassword
        }

        if (this.defaultPwd) {
          Swal.fire(SweetAlertInfoOption(data.message))

          this.router.navigate(["/resetpassword"])
        }

        if (data.status == true) {
          this.tokenService.saveLoginResData(data.data)
          let loginData = data.data
          localStorage.setItem("access_token", loginData?.token)
          localStorage.setItem("email", loginData?.email)
          localStorage.setItem("companyName", loginData?.name)
          localStorage.setItem("companyId", loginData?.companyId)
          localStorage.setItem("companyRIN", loginData?.comanyRin)
          this.companyId = formAllData.companyId
          // this.goToOtp();
          this.router.navigate(["/admin", "dashboard"])
        } else {
          Swal.fire(SweetAlertOptions(data.message))
        }
      },
      error: (err) => {
        this.ngxService.stop()
        Swal.fire(SweetAlertOptions(err?.error?.message || err?.message))
      },
    })
  }

  onOtpSubmit(otpFormData: any) {
    this.submitted = true
    // let enterOtp = otpFormData.enterOtp;

    let requestObj = {
      companyId: this.companyId,
      password: this.password,
      verificationOtp: otpFormData.enterOtp,
    }

    // console.log("loginRequest: ", requestObj)
    if (this.otpForm.valid) {
      this.userLogin(requestObj)
    } else {
      return
    }
  }

  userLogin(jsonData: any) {
    this.ngxService.start()
    this.subs.add = this.loginService
      .validateOTPAccount(jsonData)
      .subscribe((data: any) => {
        this.status = data.status
        if (this.status == true) {
          this.initialiseOtpForm()
          this.ngxService.stop()
          this.router.navigate(["/admin", "dashboard"])
        } else {
          this.ngxService.stop()
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

  requestNewOtp() {
    this.ngxService.start()

    var otpObjData = {
      companyId: this.companyId,
      password: this.password,
    }

    this.subs.add = this.loginService
      .resendOTPAccount(otpObjData)
      .subscribe((data: any) => {
        this.ngxService.stop()

        if (data.status == true) {
          this.showLoginForm = false
          this.showOtpForm = true

          Swal.fire({
            icon: "success",
            title: "Success",
            text: "The OTP has been sent to mail successfully!",
            showConfirmButton: true,
            timer: 5000,
            timerProgressBar: true,
          })
        } else {
          this.showLoginForm = true
          this.showOtpForm = false

          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.message,
            showConfirmButton: true,
            timer: 5000,
            timerProgressBar: true,
          })
        }
      })
  }

  goToOtp() {
    this.showLoginForm = false
    this.showOtpForm = true
  }

  backToLogin() {
    this.showLoginForm = true
    this.showOtpForm = false
  }

  keyPressNumbersWithDecimal(event: any) {
    var charCode = event.which ? event.which : event.keyCode
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault()
      return false
    }
    return true
  }
}
