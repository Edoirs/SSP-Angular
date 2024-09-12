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
import {AdminSignupInterface} from "../../data-access/auth.models"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"
import {AuthUtilsService} from "../../services/auth-utils.service"

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.css"],
})
export class SignUpComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService)
  private readonly authUtilsService = inject(AuthUtilsService)
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

  subs = new SubscriptionHandler()

  adminSignUpForm = new FormGroup({
    phoneNumber: new FormControl("", {validators: [Validators.required]}),
    userName: new FormControl("", {validators: [Validators.required]}),
  })

  adminSignUpOtpForm = new FormGroup({
    isAdmin: new FormControl(true, {validators: [Validators.required]}),
    newPassword: new FormControl("", {validators: [Validators.required]}),
    companyRin_Phone: new FormControl("", {validators: [Validators.required]}),
    otp: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
  })

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    // this.showEnterOtpForm = false
    // this.showCreateUserForm = true
    this.initialiseForms()
    this.initialiseForgotForms()
  }

  ngOnDestroy(): void {
    this.subs.clear()
    this.authUtilsService.deleteAuthOtp()
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

  onAdminSubmit() {
    this.subs.add = this.authService
      .adminSignUp(this.adminSignUpForm.value as AdminSignupInterface)
      .subscribe({
        next: (res) => {
          if (res.status == true) {
            this.ngxService.stop()
            this.showCreateUserForm.set(false)
            console.log(res?.data)
            Swal.fire(SweetAlertOptions(res.message))
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

  postCreateAccountStepOne(jsonData: any) {
    this.ngxService.start()
    this.apiUrl = environment.AUTHAPIURL + "Login/CreateAccountStepOne"

    const myheaders = new HttpHeaders({
      "Content-Type": "application/json",
    })

    const options = {headers: myheaders}

    this.http
      .post<any>(this.apiUrl, jsonData, options)
      .subscribe((data: any) => {
        console.log("CreateAccountStepOne: ", data)

        if (data.status == true) {
          Swal.fire({
            icon: "info",
            title: "Info",
            text: data.message,
            showConfirmButton: true,
            timer: 5000,
          })
          let companyDetail = data.data
          this.loadCompanyDetailsData(companyDetail)
          this.ngxService.stop()
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

  loadCompanyDetailsData(company: any) {
    console.log("company: ", company)
    let phoneNumber = `0${company[0].mobileNumber1}`
    this.createUserForm.controls["phoneNumber"].setValue(phoneNumber)
    this.createUserForm.controls["address"].setValue(company[0].contactAddress)
    this.createUserForm.controls["companyName"].setValue(company[0].companyName)

    //Disable fields
    this.disbableFormFields()
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
        console.log("CreateAccountStepTwo: ", data)

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
        console.log("CreateAccountStepThree: ", data)

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
