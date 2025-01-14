import {Component} from "@angular/core"
import {HttpClient, HttpHeaders} from "@angular/common/http"
import {Router} from "@angular/router"
//import { SessionService } from '../../session.service';
import {environment} from "../../../../environments/environment"
import Swal from "sweetalert2"
import {FormBuilder, FormGroup, Validators} from "@angular/forms"
import {NgxUiLoaderService} from "ngx-ui-loader"
@Component({
  selector: "app-forgotpassword",
  templateUrl: "./forgotpassword.component.html",
  styleUrls: ["./forgotpassword.component.css"],
})
export class ForgotpasswordComponent {
  forgotEmailForm!: FormGroup
  forgotPasswordForm!: FormGroup
  submitted = false
  apiUrl: any
  email: any
  fieldTextType!: boolean
  fieldTextType2!: boolean
  fieldTextType1!: boolean
  showForgotPasswordForm: boolean = false
  showRequestOtpForm: boolean = true

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.initialiseForms()
    this.initialiseForgotForms()
  }

  initialiseForms() {
    this.forgotEmailForm = this.formBuilder.group({
      emailAddress: [
        "",
        [
          Validators.required,
          Validators.maxLength(40),
          Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
    })
  }
  initialiseForgotForms() {
    this.forgotPasswordForm = this.formBuilder.group({
      newPassword: [
        "",
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(40),
          // Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$')
        ],
      ],
      confirmPassword: [
        "",
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(40),
          //   Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$')
        ],
      ],
      enterOtp: ["", Validators.required],
    })
  }

  onEmailSubmit(formAllData: any) {
    this.submitted = true

    if (this.forgotEmailForm.invalid) {
      return
    }
    this.email = formAllData.emailAddress

    var requestObj = {
      email: formAllData.emailAddress,
    }
    this.ngxService.start()
    this.apiUrl = environment.AUTHAPIURL + "auth/send-pass-reset-email"

    this.http.post<any>(this.apiUrl, requestObj).subscribe((data) => {
      this.ngxService.stop()

      if (data.status == true) {
        this.submitted = false
        this.showRequestOtpForm = false
        this.showForgotPasswordForm = true

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Password reset token has been sent successfully to your mail!",
          showConfirmButton: true,
          timer: 5000,
          timerProgressBar: true,
        })
      } else {
        this.showRequestOtpForm = true
        this.showForgotPasswordForm = false

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
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType
  }
  toggleFieldTextType1() {
    this.fieldTextType1 = !this.fieldTextType1
  }
  toggleFieldTextType2() {
    this.fieldTextType2 = !this.fieldTextType2
  }

  onSubmitForgotPassword(formAllData: any) {
    this.submitted = true

    if (this.forgotPasswordForm.invalid) {
      return
    }
    var requestObj = {
      email: this.email,
      password: formAllData.newPassword,
      token: formAllData.enterOtp,
    }
    this.ngxService.start()
    this.apiUrl = environment.AUTHAPIURL + "auth/reset-password"

    this.http.post<any>(this.apiUrl, requestObj).subscribe((data) => {
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
        this.router.navigate(["/login"])
        // this.initialiseForgotForms();
        // this.submitted= false;
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
    })
  }
}
