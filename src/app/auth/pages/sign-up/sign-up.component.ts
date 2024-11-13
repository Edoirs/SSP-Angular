import {Component, inject, OnDestroy, OnInit, signal} from "@angular/core"
import {Router} from "@angular/router"
//import { SessionService } from '../../session.service';
import Swal from "sweetalert2"
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms"
import {NgxUiLoaderService} from "ngx-ui-loader"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {AuthService} from "../../services/auth.services"
import {
  SweetAlertInfoOption,
  SweetAlertOptions,
} from "@shared/utils/sweet-alert.utils"
import {AuthUtilsService} from "../../services/auth-utils.service"
import * as AuthModels from "../../data-access/auth.models"
import {debounceTime, distinctUntilChanged, timer} from "rxjs"

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.css"],
})
export class SignUpComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService)
  public readonly authUtilsService = inject(AuthUtilsService)
  private readonly router = inject(Router)
  private readonly formBuilder = inject(FormBuilder)
  private readonly ngxService = inject(NgxUiLoaderService)
  createUserForm!: FormGroup
  enterOtpForm!: FormGroup
  submitted = false
  apiUrl: any
  email: any
  fieldTextType!: boolean
  fieldTextType2!: boolean
  fieldTextType1!: boolean
  // showEnterOtpForm: boolean = false
  companyId: any
  companyRIN: any

  showCreateUserForm = signal(true)

  taxOffices = signal<AuthModels.TaxOfficeResInterface[] | null>(null)

  subs = new SubscriptionHandler()

  adminSignUpForm = new FormGroup({
    phoneNumber: new FormControl("", {validators: [Validators.required]}),
    userName: new FormControl("", {
      validators: [Validators.required, Validators.email],
    }),
  })

  adminSignUpOtpForm = new FormGroup({
    newPassword: new FormControl("", {validators: [Validators.required]}),
    confirmPassword: new FormControl("", {validators: [Validators.required]}),
    otp: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
  })

  constructor() {}

  ngOnInit(): void {
    // this.showEnterOtpForm = false
    // this.showCreateUserForm = true
    this.initialiseForms()
    this.initialiseForgotForms()
    this.getTaxOffices()
    this.submitAdminEmail()
  }

  ngOnDestroy(): void {
    this.subs.clear()
    this.authUtilsService.deleteAuthUser()
  }

  get adminFormEmail() {
    return this.adminSignUpForm.get("userName")
  }

  submitAdminEmail() {
    this.subs.add = this.adminFormEmail!.valueChanges.pipe(
      debounceTime(600),
      distinctUntilChanged()
    ).subscribe((value) => {
      const emailRegex = "^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
      // check if email
      if (value?.match(emailRegex)) {
        this.ngxService.start()
        this.subs.add = this.authService
          .adminSignUp({userName: value, userRole: this.taxTypeId?.value})
          .subscribe({
            next: (res) => {
              this.ngxService.stop()

              // check if admin exist
              if (!res.data && !res.status) {
                Swal.fire(SweetAlertOptions(res?.message))
              }

              // check status and handle flow
              if (res.data?.screenDet === "LOGIN") {
                Swal.fire(SweetAlertInfoOption(res?.message))
                this.router.navigate(["/login"])
              } else {
                this.adminSignUpForm.patchValue({
                  phoneNumber: res.data?.phoneNumber,
                })
                this.adminSignUpForm.get("phoneNumber")?.disable()
              }
            },
            error: (err) => {
              this.ngxService.stop()
              Swal.fire(SweetAlertOptions(err?.error?.message || err?.message))
            },
          })
      }
    })
  }

  initialiseForms() {
    this.createUserForm = this.formBuilder.group({
      taxTypeId: ["", Validators.required],
      RIN: ["", Validators.required],
      companyName: ["", Validators.required],
      phoneNumber: [
        "",
        [
          Validators.required,
          // Validators.minLength(11),
          // Validators.maxLength(11),
          Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/),
        ],
      ],
      address: ["", Validators.required],
      // emailAddress: ["", [
      //   Validators.required,
      //   Validators.maxLength(40),
      //   Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
      // ]],
    })
  }

  initialiseForgotForms() {
    this.enterOtpForm = this.formBuilder.group({
      newPassword: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(40),
          // Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$')
        ],
      ],
      confirmPassword: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(40),
          //   Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$')
        ],
      ],
      enterOtp: ["", Validators.required],
    })
  }

  get taxTypeId() {
    return this.createUserForm.get("taxTypeId")
  }

  get phoneNumber() {
    return this.createUserForm.get("phoneNumber")
  }

  get companyName() {
    return this.createUserForm.get("companyName")
  }

  get companyAddress() {
    return this.createUserForm.get("address")
  }

  getTaxOffices() {
    this.subs.add = this.authService.getTaxOffices().subscribe((res) => {
      this.taxOffices.set(res.data)
    })
  }

  onAdminSubmit() {
    if (this.adminSignUpForm.valid) {
      this.ngxService.start()

      const payload = {
        isAdmin: true,
        companyRin: this.adminFormEmail?.value,
      } as AuthModels.AdminInitChangePasswordInterface

      this.subs.add = this.authService
        .adminInitChangePassword(payload)
        .subscribe({
          next: (res) => {
            this.ngxService.stop()
            if (res.status == true) {
              this.showCreateUserForm.set(false)
              this.authUtilsService.saveAuthOtp("admin", res.data || 0)
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

  onAdminOtpSubmit() {
    if (this.adminSignUpOtpForm.valid) {
      this.ngxService.start()
      const payload = {
        isAdmin: true,
        newPassword: this.adminSignUpOtpForm.value.newPassword,
        companyRin_Phone: this.adminSignUpForm.get("phoneNumber")?.value,
        otp: parseInt(this.adminSignUpOtpForm.value?.otp as unknown as string),
      } as AuthModels.AdminChangePasswordInterface

      this.subs.add = this.authService.adminChangePassword(payload).subscribe({
        next: (res) => {
          this.ngxService.stop()
          if (res.status == true) {
            Swal.fire(SweetAlertOptions(res.message, true))
            this.router.navigate(["/login"])
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

  onSubmitCreateUser() {
    this.submitted = true

    if (this.createUserForm.invalid) return

    let requestObj = {
      isAdmin: this.taxTypeId?.value !== "admin" ? false : true,
      companyRin: this.createUserForm.value.RIN,
      phoneNumber: this.phoneNumber?.value,
    }

    this.ngxService.start()

    this.subs.add = this.authService
      .createAccountStepTwo(requestObj)
      .subscribe({
        next: (data: any) => {
          this.ngxService.stop()

          if (data.status == true) {
            Swal.fire(SweetAlertInfoOption(data.message))

            this.showCreateUserForm.set(false)
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

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType
  }

  toggleFieldTextType1() {
    this.fieldTextType1 = !this.fieldTextType1
  }

  toggleFieldTextType2() {
    this.fieldTextType2 = !this.fieldTextType2
  }

  onSubmitEnterOtp(formAllData: any) {
    this.submitted = true

    if (this.enterOtpForm.invalid) {
      return
    }

    let requestObj = {
      companyRin: this.companyRIN,
      password: formAllData.newPassword,
      // verificationOtp: formAllData.enterOtp
    }

    this.postCreateAccountStepThree(requestObj)
  }

  getCompanyDetails(event: any) {
    const searchKeyword = event.target.value
    this.companyRIN = searchKeyword

    const request = {
      companyRin: searchKeyword,
    }

    if (searchKeyword.length == 8) {
      this.postCreateAccountStepOne(request)
    }
  }

  postCreateAccountStepOne(payload: {companyRin: string}) {
    this.ngxService.start()
    this.subs.add = this.authService.signUpUserStepOne(payload).subscribe({
      next: (res) => {
        if (res.status == true) {
          Swal.fire(SweetAlertInfoOption(res?.message))
          this.loadCompanyDetailsData(res.data as any)

          this.ngxService.stop()
          // this.router.navigate(['/admin', 'dashboard']);
        } else {
          switch (res.data?.screenDet) {
            case "LOGIN":
              Swal.fire(SweetAlertInfoOption(res?.message))
              this.subs.add = timer(5000).subscribe(() => {
                this.router.navigate(["/login"])
              })
              break
            case "OTP":
              Swal.fire(SweetAlertInfoOption(res?.message))
              this.loadCompanyOtpDetailData(res.data)
              break
            default:
              Swal.fire(SweetAlertOptions(res?.message))
          }
          this.ngxService.stop()
        }
      },
      error: (err) => {
        this.ngxService.stop()
        Swal.fire(SweetAlertOptions(err?.error?.message || err?.message))
      },
    })
  }

  loadCompanyDetailsData(companyData: AuthModels.RegisterStepOneResInterface) {
    const company = companyData as AuthModels.RegisterStepOneResInterface
    this.createUserForm.patchValue({
      companyName: company[0].taxPayerName,
      address: company[0].contactAddress,
      phoneNumber: `0${company[0].mobileNumber}`,
    })

    //Disable fields
    this.disbableFormFields()
  }

  loadCompanyOtpDetailData(company: AuthModels.UserRegisterStepOneInterface) {
    this.createUserForm.patchValue({
      companyName: company.companyName,
      address: company?.companyAddress,
      phoneNumber: company?.phoneNumber,
    })

    this.companyName?.disable()
    this.companyAddress?.disable()
  }

  disbableFormFields(): void {
    const enableFields: string[] = ["address", "companyName"]

    enableFields.forEach((key) => {
      this.createUserForm?.get(key)?.disable()
    })
  }

  postCreateAccountStepThree(jsonData: any) {
    this.ngxService.start()

    this.subs.add = this.authService
      .createAccountStepThree(jsonData)
      .subscribe((data: any) => {
        // console.log("CreateAccountStepThree: ", data)

        if (data.status == true) {
          Swal.fire({
            icon: "info",
            title: "Account created successfully",
            text: data.message,
            showConfirmButton: true,
            timer: 5000,
          })
          this.ngxService.stop()
          this.router.navigate(["/login"])
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
}
