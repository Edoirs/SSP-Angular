import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-selfresetpassword',
  templateUrl: './selfresetpassword.component.html',
  styleUrls: ['./selfresetpassword.component.css']
})
export class SelfresetpasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup
  submitted = false;
  apiUrl: any;
  emailAddress: any;
  fieldTextType!: boolean;
  fieldTextType2!: boolean;
  showForgotPasswordForm: boolean = false;
  fieldTextType3!: boolean;

  constructor(private http: HttpClient, private router: Router,
    private formBuilder: FormBuilder, private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.emailAddress = localStorage.getItem("niswasec_username");
    this.initialiseForms();
  }
  initialiseForms() {
    this.resetPasswordForm = this.formBuilder.group({
        emailAddress: [ "", [ Validators.required, Validators.maxLength(45),
            Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")],
        ],
        defaultPassword: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(40),
        ]],
        newPassword: ["",[ Validators.required,
            Validators.minLength(8),
            Validators.maxLength(40)],
        ],
        enterOtp: ["", [Validators.required, Validators.maxLength(6), Validators.minLength(6),
                   Validators.pattern(/^[0-9]*$/)]],
      },
    );
  }
  
  toggleFieldTextType1() {
    this.fieldTextType = !this.fieldTextType;
  }

  toggleFieldTextType2() {
    this.fieldTextType2 = !this.fieldTextType2;
  }

  toggleFieldTextType3() {
    this.fieldTextType3 = !this.fieldTextType3;
  }
  onSubmitResetPassword(formAllData: any) {
    this.submitted = true;

    if (this.resetPasswordForm.invalid) {
      return;
    }
    var requestObj = {
      email: this.emailAddress,
      default_password: formAllData.defaultPassword,
      password: formAllData.newPassword,
      otp: formAllData.enterOtp,
    };
    this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + 'self-portal/auth/reset-default-password';

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
        if (data.response != null) {
        }
        setTimeout(() => {
          this.router.navigate(["/selflogin"]);
        }, 1000);
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


