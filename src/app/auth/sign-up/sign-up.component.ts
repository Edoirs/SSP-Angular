import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
//import { SessionService } from '../../session.service';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  createUserForm!: FormGroup
  enterOtpForm!: FormGroup
  submitted = false;
  apiUrl: any;
  email: any;
  fieldTextType!: boolean;
  fieldTextType2!: boolean;
  fieldTextType1!: boolean;
  showEnterOtpForm: boolean = false;
  showCreateUserForm: boolean = true;
  companyId: any;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private formBuilder: FormBuilder, 
    private ngxService: NgxUiLoaderService,) { }

  ngOnInit(): void {
    this.initialiseForms();
    this.initialiseForgotForms()
  }

  initialiseForms() {
    this.createUserForm = this.formBuilder.group({
      taxTypeId: ['', Validators.required],
      RIN: ['', Validators.required],
      companyName: ['', Validators.required],
      phoneNumber: ['',
        [
          Validators.required,
          // Validators.minLength(11),
          // Validators.maxLength(11),
          Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/),
        ],
      ],
      emailAddress: ["", [
        Validators.required,
        Validators.maxLength(40),
        Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
      ]],
    });
  }

  initialiseForgotForms() {
    this.enterOtpForm = this.formBuilder.group({
      newPassword: ['',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(40),
          // Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$')
        ]],
      confirmPassword: ['',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(40),
          //   Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$')
        ]],
      enterOtp: ['', Validators.required],
    });
  }

  onSubmitCreateUser(formAllData: any) {
    this.submitted = true;

    if (this.createUserForm.invalid) {
      return;
    }

    this.email = formAllData.emailAddress;

    var requestObj = {
      userType: formAllData.taxTypeId,
      companyName: formAllData.companyName,
      mobileNumber1: formAllData.phoneNumber,
      contactAddress: formAllData.address,
      RIN: formAllData.RIN,
    };

    this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + 'Login/CreateAccount';

    this.http.post<any>(this.apiUrl, requestObj).subscribe(data => {
      this.ngxService.stop();
      if (data.status == true) {
        this.submitted = false;
        this.showCreateUserForm = false;
        this.showEnterOtpForm = true;
        this.companyId = data.companyId;

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: data.message,
          showConfirmButton: true,
          timer: 5000,
          timerProgressBar: true
        });
      }
      else {
        this.showCreateUserForm = true;
        this.showEnterOtpForm = false;

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: data.message,
          showConfirmButton: true,
          timer: 5000,
          timerProgressBar: true
        });
      }
    });

  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  toggleFieldTextType1() {
    this.fieldTextType1 = !this.fieldTextType1;
  }

  toggleFieldTextType2() {
    this.fieldTextType2 = !this.fieldTextType2;
  }

  onSubmitEnterOtp(formAllData: any) {
    this.submitted = true;

    if (this.enterOtpForm.invalid) {
      return;
    }

    let requestObj = {
      companyId: this.companyId,
      password: formAllData.newPassword,
      verificationOtp: formAllData.enterOtp
    }

    this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + 'Login/ValidateOTPAccount';

    this.http.post<any>(this.apiUrl, requestObj).subscribe(data => {
      this.ngxService.stop();
      if (data.status == true) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: data.message,
          showConfirmButton: true,
          timer: 5000,
          timerProgressBar: true
        });

        this.router.navigate(["/login"]);
        // this.initialiseForgotForms();
        // this.submitted= false;
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: data.message,
          showConfirmButton: true,
          timer: 5000,
          timerProgressBar: true
        });
      }
    });


  }
}

