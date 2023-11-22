import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  submitted = false;
  apiUrl: any;
  loginForm!: FormGroup
  otpForm!: FormGroup
  showLoginForm: boolean = true;
  showOtpForm: boolean = false;
  defaultPwd!: boolean
  fieldTextType: boolean = false;
  fieldTextType2: boolean = false;
  status: any;
  appKey: any;
  md5: any;
  rinPhoneNumber: any;
  password: any;
  companyId: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.initialiseForms();
    this.initialiseOtpForm();
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
      password: ["",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(40),
        ]
      ],
      // rememberMe: [false, []],
      taxTypeId: ["", Validators.required],
      // captcha: ['', Validators.required],
    });
  }

  initialiseOtpForm() {
    this.otpForm = this.formBuilder.group({
      enterOtp: ["", [Validators.required, Validators.pattern(/^[0-9]*$/)]],
    });
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  toggleFieldTextType2() {
    this.fieldTextType2 = !this.fieldTextType2;
  }

  checkEmail(formAllData: any) {
    this.submitted = true;

    if (this.loginForm.controls['emailAddress'].status === 'INVALID') {
      return;
    }

    var requestObj = {
      email: formAllData.emailAddress,
    };

    this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "auth/send-otp";
    this.http.post<any>(this.apiUrl, requestObj).subscribe((data: any) => {

      this.ngxService.stop();
      if (data.status == true) {
        this.showOtpForm = true;
        this.submitted = false;
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "The OTP has been sent to mail successfully!",
          showConfirmButton: true,
          timer: 100000,
          timerProgressBar: true,
        });
      } else {
        this.showLoginForm = true;
        this.showOtpForm = false;

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.response != null ? data.response[0].message : data.message,
          showConfirmButton: true,
          timer: 5000,
          timerProgressBar: true,
        });
      }
    });

  }

  onSubmit(formAllData: any) {
    this.submitted = true;

    if (this.loginForm.invalid) {
      console.log("Here is we!");
      return;
    }

    this.password = formAllData.password;
    this.rinPhoneNumber = formAllData.rinPhoneNumber;

    var requestObj = {
      userType: formAllData.taxTypeId,
      password: this.password,
      phoneNumber_RIN: this.rinPhoneNumber
    };

    this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "Login/SignIn";

    this.http.post<any>(this.apiUrl, requestObj).subscribe((data: any) => {
      console.log("SignInResponse: ", data);
      this.ngxService.stop();

      if (data != null) {
        this.defaultPwd = data.hasDefaultPassword == undefined ? false : data.hasDefaultPassword;
      }

      if (this.defaultPwd) {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: data.message,
          showConfirmButton: true,
          timer: 5000,
          timerProgressBar: true,
        });

        this.router.navigate(["/resetpassword"]);
      }

      if (data.status == true) {
        localStorage.setItem("token", data?.token);
        localStorage.setItem("email", data?.email);
        localStorage.setItem("name", data?.name);
        localStorage.setItem("companyId", data?.companyId);
        this.companyId = formAllData.companyId;
        // this.goToOtp();
        this.router.navigate(["/dashboard"])
      }
      else if (data.status != true && this.defaultPwd != false) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.message,
          showConfirmButton: true,
          timer: 5000,
          timerProgressBar: true,
        });
      }
    });
  }

  onOtpSubmit(otpFormData: any) {
    this.submitted = true;
    // let enterOtp = otpFormData.enterOtp;

    let requestObj = {
      companyId: this.companyId,
      password: this.password,
      verificationOtp: otpFormData.enterOtp
    }

    console.log("loginRequest: ", requestObj);
    if (this.otpForm.valid) {
      this.userLogin(requestObj);
    }
    else {
      return;
    }
  }

  userLogin(jsonData: any) {
    this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + 'Login/ValidateOTPAccount';

    const myheaders = new HttpHeaders({
      'Content-Type': 'application/json',
      // 'token': this.md5
    });

    const options = { headers: myheaders };

    this.http.post<any>(this.apiUrl, jsonData, options).subscribe((data: any) => {
      console.log("ValidateOTPAccountResponse: ", data);
      this.status = data.status;
      if (this.status == true) {
        console.log("user: ", data);
        // localStorage.setItem('admin_email', data.response.user.email);
        // localStorage.setItem('admin_id', data.response.user.id);
        // localStorage.setItem('admin_access_token', data.response.access_token);

        this.initialiseOtpForm();
        this.ngxService.stop();
        this.router.navigate(['/dashboard']);
      }
      else {
        this.ngxService.stop();
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: data.message,
          showConfirmButton: true,
          timer: 5000
        });
      }
    });
  }

  requestNewOtp() {
    this.ngxService.start();

    var otpObjData = {
      companyId: this.companyId,
      password: this.password,
    };

    this.apiUrl = environment.AUTHAPIURL + "Login/ResendOTPAccount";

    this.http.post<any>(this.apiUrl, otpObjData).subscribe((data: any) => {
      console.log("ResendOTPAccountResponse: ", data);
      this.ngxService.stop();

      if (data.status == true) {
        this.showLoginForm = false;
        this.showOtpForm = true;

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "The OTP has been sent to mail successfully!",
          showConfirmButton: true,
          timer: 5000,
          timerProgressBar: true,
        });
      }
      else {
        this.showLoginForm = true;
        this.showOtpForm = false;

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.message,
          showConfirmButton: true,
          timer: 5000,
          timerProgressBar: true,
        });
      }
    });
  }

  goToOtp() {
    this.showLoginForm = false;
    this.showOtpForm = true;
  }

  backToLogin() {
    this.showLoginForm = true;
    this.showOtpForm = false;
  }

  keyPressNumbersWithDecimal(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

}

