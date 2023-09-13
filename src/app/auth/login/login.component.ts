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
    showLoginForm: boolean = true;
    showOtpForm: boolean = false;
    defaultPwd!: boolean
    fieldTextType: boolean=false;
    fieldTextType2: boolean=false;
  
  
    constructor(private http: HttpClient, private router: Router,
      private formBuilder: FormBuilder, private ngxService: NgxUiLoaderService) { }
  
  
    ngOnInit(): void {
      this.initialiseForms();
  
    }
  
    initialiseForms() {
      this.loginForm = this.formBuilder.group({
        emailAddress: ["", [
          Validators.required,
          Validators.maxLength(40),
          Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ]],
  
        password: ["", [
          Validators.required,
       //   Validators.minLength(8),
          Validators.maxLength(40),
        ]],
        enterOtp: ["", [Validators.required, Validators.maxLength(6), Validators.minLength(6), Validators.pattern(/^[0-9]*$/)]],
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
      this.http.post<any>(this.apiUrl, requestObj).subscribe((data) => {
  
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
  
    onOtpSubmit(formAllData: any) {
      this.submitted = true;
  
      if (this.loginForm.invalid) {
        return;
      }
      var otpObj = {
        email: formAllData.emailAddress,
        password: formAllData.password,
        otp: formAllData.enterOtp
      };
      this.ngxService.start();
      this.apiUrl = environment.AUTHAPIURL + "auth/login";
      this.http.post<any>(this.apiUrl, otpObj).subscribe((data) => {
        this.ngxService.stop();
        if (data.response != null) {
          this.defaultPwd = data.response.changed_default_password;
        }
  
        if (this.defaultPwd == false) {
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
          localStorage.setItem("niswasec_access_token", data.response?.access_token);
          localStorage.setItem("niswasec_email", data.response?.user?.email);
          localStorage.setItem("niswasec_name", data.response?.user?.name);
          localStorage.setItem("niswasec_role_id", data.response?.role?.id);
  
          localStorage.setItem("niswasec_role_name", data.response?.role?.name);
          localStorage.setItem("niswasec_phone", data.response?.user?.phone);
          localStorage.setItem("niswasec_designation", data.response?.user?.designation);
          localStorage.setItem("niswasec_department", data.response?.user?.department);
          this.router.navigate(["/dashboard"])
        }
        else if(data.status != true  && this.defaultPwd != false) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.message || data.error.errors.email[0],
            showConfirmButton: true,
            timer: 5000,
            timerProgressBar: true,
          });
        }
      });
    }
    backToLogin() {
      
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
  
