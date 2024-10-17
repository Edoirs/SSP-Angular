import {Component, inject, OnDestroy, OnInit, signal} from "@angular/core"
import {HttpClient, HttpHeaders} from "@angular/common/http"
import {Router} from "@angular/router"
//import { SessionService } from '../../session.service';
import {environment} from "../../../../environments/environment"
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
import {ServerResInterface} from "@shared/types/server-response.model"
import {timer} from "rxjs"

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.css"],
})
export class SignUpComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService)
  public readonly authUtilsService = inject(AuthUtilsService)
  private readonly http = inject(HttpClient)
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
    userName: new FormControl("", {validators: [Validators.required]}),
  })

  adminSignUpOtpForm = new FormGroup({
    isAdmin: new FormControl(true, {validators: [Validators.required]}),
    newPassword: new FormControl("", {validators: [Validators.required]}),
    confirmPassword: new FormControl("", {validators: [Validators.required]}),
    companyRin_Phone: new FormControl("", {validators: [Validators.required]}),
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
  }

  ngOnDestroy(): void {
    this.subs.clear()
    this.authUtilsService.deleteAuthUser()
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

  getTaxOffices() {
    this.subs.add = this.authService.getTaxOffices().subscribe((res) => {
      this.taxOffices.set(res.data)
    })
  }

  onAdminSubmit() {
    if (this.adminSignUpForm.valid)
      this.subs.add = this.authService
        .adminSignUp(
          this.adminSignUpForm.value as AuthModels.AdminSignupInterface
        )
        .subscribe({
          next: (res) => {
            if (res.status == true) {
              this.ngxService.stop()
              this.showCreateUserForm.set(false)
              this.authUtilsService.saveAuthOtp("admin", 0)
            } else {
              Swal.fire(SweetAlertOptions(res.message))
            }
          },
          error: (err) => {
            this.ngxService.stop()
            Swal.fire(SweetAlertOptions(err?.message || err?.error?.message))
          },
        })
  }

  onAdminOtpSubmit() {
    if (this.adminSignUpOtpForm.valid) {
      const payload = {
        isAdmin: true,
        newPassword: this.adminSignUpOtpForm.value.newPassword,
        companyRin_Phone: this.adminSignUpOtpForm.value.companyRin_Phone,
        otp: this.adminSignUpOtpForm.value.otp,
      } as AuthModels.AdminChangePasswordInterface

      this.subs.add = this.authService.adminChangePassword(payload).subscribe({
        next: (res) => {
          if (res.status == true) {
            this.ngxService.stop()
            this.router.navigate(["/login"])
          } else {
            Swal.fire(SweetAlertOptions(res.message))
          }
        },
        error: (err) => {
          this.ngxService.stop()
          Swal.fire(SweetAlertOptions(err?.message || err?.error?.message))
        },
      })
    }
  }

  onSubmitCreateUser(formAllData: any) {
    this.submitted = true

    if (this.createUserForm.invalid) {
      return
    }

    let requestObj = {
      // userType: formAllData.taxTypeId,
      // companyName: formAllData.companyName,
      // contactAddress: formAllData.address,
      companyRin: this.companyRIN,
      phoneNumber: formAllData.phoneNumber,
    }

    this.postCreateAccountStepTwo(requestObj)
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

    let request = {
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
          this.loadCompanyDetailsData(res.data)

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
        Swal.fire(SweetAlertOptions(err?.message || err?.error?.message))
      },
    })
  }

  loadCompanyDetailsData(companyData: any) {
    const company = companyData as AuthModels.RegisterStepOneResInterface
    let phoneNumber = `0${company[0].mobileNumber}`
    this.createUserForm.controls["phoneNumber"].setValue(phoneNumber)
    this.createUserForm.controls["address"].setValue(company[0].contactAddress)
    this.createUserForm.controls["companyName"].setValue(
      company[0].taxPayerName
    )

    //Disable fields
    this.disbableFormFields()
  }

  loadCompanyOtpDetailData(company: AuthModels.UserRegisterStepOneInterface) {
    this.createUserForm.patchValue({
      companyName: company.companyName,
      ...(company?.phoneNumber && {
        phoneNumber: `0${company?.phoneNumber}`,
      }),
    })

    this.companyName?.disable()

    if (company?.phoneNumber) {
      this.phoneNumber?.disable()
    }
  }

  disbableFormFields(): void {
    const enableFields: string[] = ["phoneNumber", "address", "companyName"]

    for (let key in this.createUserForm.controls) {
      !enableFields.includes(key) && this.createUserForm.controls[key].disable()
    }
  }

  postCreateAccountStepTwo(jsonData: any) {
    this.ngxService.start()
    this.apiUrl = environment.AUTHAPIURL + "Login/CreateAccountStepTwo"

    const myheaders = new HttpHeaders({
      "Content-Type": "application/json",
    })

    const options = {headers: myheaders}

    this.http
      .post<any>(this.apiUrl, jsonData, options)
      .subscribe((data: any) => {
        // console.log("CreateAccountStepTwo: ", data)

        if (data.status == true) {
          this.ngxService.stop()
          Swal.fire({
            icon: "info",
            title: "OTP sent successfully",
            text: data.message,
            showConfirmButton: true,
            timer: 5000,
          })

          this.showCreateUserForm.set(false)
          // this.showEnterOtpForm = true
          // this.router.navigate(['/admin', 'dashboard']);
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

  postCreateAccountStepThree(jsonData: any) {
    this.ngxService.start()
    this.apiUrl = environment.AUTHAPIURL + "Login/CreateAccountStepThree"

    const myheaders = new HttpHeaders({
      "Content-Type": "application/json",
    })

    const options = {headers: myheaders}

    this.http
      .post<any>(this.apiUrl, jsonData, options)
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
